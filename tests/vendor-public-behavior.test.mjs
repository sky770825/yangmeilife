import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

function runNode(cwd, args) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      BUILD_TIMESTAMP: '2026-07-27T00:00:00.000Z',
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

async function withGeneratedSite(callback) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'yangmeilife-public-behavior-'));
  const repoRoot = path.join(tempRoot, 'repo');

  await cp(root, repoRoot, {
    recursive: true,
    filter(source) {
      const relative = path.relative(root, source);
      return !relative.startsWith('.git')
        && !relative.startsWith('archive')
        && !relative.startsWith('.playwright')
        && !relative.startsWith('.superpowers');
    },
  });

  try {
    runNode(repoRoot, ['scripts/build-main-structure.mjs']);
    await callback(repoRoot);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function generatedVendorPageScript(repoRoot) {
  return readFile(path.join(repoRoot, 'assets/js/vendor-page.js'), 'utf8');
}

async function generatedCategoryScript(repoRoot) {
  const page = await generatedVendorPageScript(repoRoot);
  const start = page.indexOf('const vendorCard = (vendor, category) => {');
  const end = page.indexOf('const applyFilters =', start);

  assert.notEqual(start, -1, 'generated category page should contain the vendor-card renderer');
  assert.notEqual(end, -1, 'generated category page should end the vendor-card renderer before applying filters');

  return page.slice(start, end);
}

async function renderGeneratedCard(repoRoot, vendor, { captureListeners = false } = {}) {
  const grid = { className: '', innerHTML: '' };
  const listeners = [];
  const nodes = new Map([
    ['#vendorGrid', grid],
    ['#vendorCount', { textContent: '' }],
    ['#vendorEmpty', { hidden: false, textContent: '' }],
    ['#vendorSearch', { addEventListener() {} }],
    ['#vendorSort', { addEventListener() {} }],
    ['#vendorFilter', { addEventListener() {} }],
  ]);
  const app = {
    dataset: { vendorPage: 'fixture.html' },
    addEventListener(type, listener, options) {
      listeners.push({ type, listener, capture: options === true });
    },
    querySelector(selector) {
      return nodes.get(selector);
    },
    querySelectorAll() {
      return [];
    },
  };
  let shellMarkup = '';
  Object.defineProperty(app, 'innerHTML', {
    get() {
      return shellMarkup;
    },
    set(value) {
      shellMarkup = value;
    },
  });

  const category = {
    page: 'fixture.html',
    title: 'Fixture vendors',
    displayTitle: 'Fixture vendors',
    intro: '',
    displayIntro: '',
    categoryTitle: 'Fixture',
    categoryUrl: 'pages/fixture/index.html',
    accent: '#123456',
    vendors: [vendor],
  };
  const context = {
    window: { YANGMEI_VENDOR_CATEGORIES: [category] },
    document: {
      body: { appendChild() {} },
      createElement() {
        return { className: '', textContent: '', remove() {} };
      },
      getElementById(id) {
        return id === 'vendorPageApp' ? app : null;
      },
    },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {},
    },
    location: { pathname: '/fixture.html' },
    setTimeout() {},
  };

  vm.runInNewContext(await generatedVendorPageScript(repoRoot), context);
  await new Promise((resolve) => setImmediate(resolve));
  return captureListeners ? { markup: grid.innerHTML, listeners } : grid.innerHTML;
}

test('generated public vendor cards expose only verified facts and valid phone/map actions', async () => {
  await withGeneratedSite(async (repoRoot) => {
    const categories = JSON.parse(
      await readFile(path.join(repoRoot, 'data/vendors/vendor-categories.json'), 'utf8'),
    );
    const runtimeVendors = categories.categories.flatMap((category) => category.vendors);
    const sourceCategories = JSON.parse(
      await readFile(path.join(repoRoot, 'data/vendors/categories/american-chiropractic/vendors.json'), 'utf8'),
    );
    const pageScript = await generatedVendorPageScript(repoRoot);
    const cardScript = await generatedCategoryScript(repoRoot);

    assert.equal(runtimeVendors.length, 11);
    assert.ok(runtimeVendors.every((vendor) => vendor.publicationStatus === 'published'));
    assert.ok(runtimeVendors.every((vendor) => vendor.verified === true));
    assert.ok(runtimeVendors.every((vendor) => vendor.rating === null));
    assert.ok(runtimeVendors.every((vendor) => typeof vendor.phone === 'string' && vendor.phone.length > 0));
    assert.ok(runtimeVendors.every((vendor) => typeof vendor.address === 'string' && vendor.address.length > 0));
    assert.ok(runtimeVendors.every((vendor) => /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/.test(vendor.mapUrl)));
    assert.ok(sourceCategories.candidateVendors.every((candidate) => !runtimeVendors.some((vendor) => vendor.id === candidate.id)));

    assert.doesNotMatch(pageScript, /vendor\.rating/);
    assert.doesNotMatch(pageScript, /state\.sort === 'rating'/);
    assert.doesNotMatch(pageScript, /value="rating"/);
    assert.doesNotMatch(pageScript, /評分高到低/);
    assert.doesNotMatch(pageScript, /vendor\.price/);
    assert.doesNotMatch(pageScript, /state\.sort === 'price-low'/);
    assert.doesNotMatch(pageScript, /state\.sort === 'price-high'/);
    assert.doesNotMatch(pageScript, /value="price-low"/);
    assert.doesNotMatch(pageScript, /value="price-high"/);
    assert.doesNotMatch(pageScript, /價格低到高/);
    assert.doesNotMatch(pageScript, /價格高到低/);
    assert.match(pageScript, /state\.sort === 'area'/);
    assert.match(pageScript, /value="area"/);
    assert.match(pageScript, /\.vendor-card-media\{[^}]*aspect-ratio:2\/1/);
    assert.match(pageScript, /\.vendor-card-grid--gallery\{grid-template-columns:minmax\(0,1fr\)/);
    assert.match(pageScript, /@media \(min-width:768px\)\{[\s\S]*?#vendorPageApp \.vendor-card-grid--gallery\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
    assert.match(pageScript, /@media \(min-width:1180px\)\{#vendorPageApp \.vendor-card-grid--gallery\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\}/);
    assert.doesNotMatch(pageScript, /md:grid-cols-\[/);
    assert.match(pageScript, /\.vendor-page-header-layout\{display:grid;grid-template-columns:minmax\(0,1fr\)/);
    assert.match(pageScript, /\.vendor-page-summary\{width:fit-content;/);
    assert.match(pageScript, /@media \(min-width:768px\)\{[\s\S]*?\.vendor-page-summary\{width:auto;justify-self:end/);
    assert.match(pageScript, /\.vendor-page-join-action\{[^}]*min-height:44px[^}]*background:#0f172a/);
    assert.match(pageScript, /class="vendor-page-header panel"/);
    assert.match(pageScript, /class="vendor-page-summary"/);
    assert.match(pageScript, /class="vendor-page-join"/);
    assert.match(pageScript, /class="vendor-page-join-action"/);
    assert.doesNotMatch(pageScript, /lg:flex-row/);
    assert.doesNotMatch(cardScript, /vendor\.rating/);
    assert.match(cardScript, /const phoneHref = vendor\.phone \? 'tel:' \+ String\(vendor\.phone\)\.replace\(/);
    assert.match(cardScript, /quickAction\('map', '導航', vendor\.mapUrl \|\| null/);
  });
});

test('generated public vendor cards consolidate store actions without a generic inquiry row', async () => {
  await withGeneratedSite(async (repoRoot) => {
    const cardScript = await generatedCategoryScript(repoRoot);
    const pageScript = await generatedVendorPageScript(repoRoot);

    assert.match(cardScript, /const officialHref = vendor\.officialUrl \|\| null;/);
    assert.match(cardScript, /const contactHref = vendor\.lineUrl \|\| vendor\.officialUrl \|\| null;/);
    assert.doesNotMatch(cardScript, /LINE_URL/);
    assert.doesNotMatch(cardScript, /inquiryHref/);
    assert.doesNotMatch(cardScript, /洽詢/);
    assert.doesNotMatch(cardScript, /vendor-card-links/);
    assert.match(cardScript, /quickAction\('phone', '電話', phoneHref/);
    assert.match(cardScript, /quickAction\('map', '導航', vendor\.mapUrl \|\| null/);
    assert.match(cardScript, /quickAction\('message', contactLabel, contactHref/);
    assert.match(pageScript, /aria-disabled="true"/);

    const cardMarkup = await renderGeneratedCard(repoRoot, {
      id: 'fixture-actions',
      name: 'Action fixture',
      area: 'Yangmei',
      image: null,
      tags: ['A', 'B', 'C', 'D'],
      verified: true,
      needsVerification: false,
      publicationStatus: 'published',
      phone: '03-123-4567',
      address: 'Yangmei district',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yangmei',
      officialUrl: 'https://example.com/store',
      officialSource: 'Fixture official site',
      sourceUrls: ['https://example.com/store'],
      lineUrl: 'https://line.me/R/ti/p/@fixture',
      missingFields: [],
    });
    assert.match(cardMarkup, /href="tel:03-123-4567"/);
    assert.match(cardMarkup, /href="https:\/\/www\.google\.com\/maps\/search/);
    assert.match(cardMarkup, /href="https:\/\/line\.me\/R\/ti\/p\/@fixture"/);
    assert.match(cardMarkup, /aria-label="收藏 Action fixture"/);
    assert.doesNotMatch(cardMarkup, /洽詢/);
    const actionCount = [...cardMarkup.matchAll(/class="([^"]*)"/g)]
      .filter(([, classNames]) => classNames.split(/\s+/).includes('vendor-card-action')).length;
    assert.equal(actionCount, 4);
    assert.doesNotMatch(cardMarkup, />D</);

    const noContactMarkup = await renderGeneratedCard(repoRoot, {
      id: 'fixture-no-contact',
      name: 'No contact fixture',
      area: 'Yangmei',
      image: null,
      tags: [],
      verified: true,
      needsVerification: false,
      publicationStatus: 'published',
      phone: '03-123-4567',
      address: 'Yangmei district',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yangmei',
      officialUrl: null,
      officialSource: null,
      sourceUrls: [],
      lineUrl: null,
      missingFields: [],
    });
    assert.doesNotMatch(noContactMarkup, /@931aeinu/);
    assert.match(noContactMarkup, /aria-disabled="true"/);
  });
});

test('generated public vendor cards omit image markup when no approved image exists', async () => {
  await withGeneratedSite(async (repoRoot) => {
    const fixtureVendor = {
      id: 'fixture-no-image',
      name: 'No approved image',
      area: 'Yangmei',
      price: null,
      tags: [],
      verified: true,
      needsVerification: false,
      publicationStatus: 'published',
      phone: '03-123-4567',
      address: 'Yangmei district',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yangmei',
      officialUrl: 'https://example.com/store',
      officialSource: 'Fixture official site',
      sourceUrls: ['https://example.com/store'],
      lineUrl: null,
      missingFields: [],
    };

    for (const image of [null, '', 'null', 'not-a-url']) {
      const cardMarkup = await renderGeneratedCard(repoRoot, { ...fixtureVendor, image });
      assert.doesNotMatch(cardMarkup, /<img\b/i);
      assert.doesNotMatch(cardMarkup, /src="null"/);
      assert.match(cardMarkup, /vendor-card-media--fallback/);
    }

    const directFallbackMarkup = await renderGeneratedCard(repoRoot, fixtureVendor);
    const directStoreSvg = directFallbackMarkup.match(/<svg[^>]*><path d="M4 10v10h16V10"[\s\S]*?<\/svg>/)?.[0];
    assert.ok(directStoreSvg, 'direct no-image fallback should contain the store icon');

    const approvedImageResult = await renderGeneratedCard(repoRoot, {
      ...fixtureVendor,
      image: 'https://example.com/store.jpg',
    }, { captureListeners: true });
    const { markup: approvedImageMarkup, listeners } = approvedImageResult;
    assert.match(approvedImageMarkup, /<img\b/i);
    assert.match(approvedImageMarkup, /src="https:\/\/example\.com\/store\.jpg"/);
    assert.doesNotMatch(approvedImageMarkup, /\sonerror=/i);
    const errorListener = listeners.find((entry) => entry.type === 'error' && entry.capture);
    assert.ok(errorListener, 'image failures should use an app-scoped capturing error listener');

    const fallbackMedia = {
      classes: new Set(['vendor-card-media']),
      attributes: new Map(),
      dataset: { vendorName: 'No approved image' },
      innerHTML: '<img class="vendor-card-image">',
      classList: {
        add(className) {
          fallbackMedia.classes.add(className);
        },
        contains(className) {
          return fallbackMedia.classes.has(className);
        },
      },
      setAttribute(name, value) {
        this.attributes.set(name, value);
      },
      removeAttribute(name) {
        this.attributes.delete(name);
        delete this.dataset.vendorName;
      },
    };
    const failedImage = {
      alt: 'No approved image',
      parentElement: fallbackMedia,
      classList: {
        contains(className) {
          return className === 'vendor-card-image';
        },
      },
      removed: false,
      remove() {
        this.removed = true;
      },
    };
    errorListener.listener({ target: failedImage });
    assert.equal(fallbackMedia.classes.has('vendor-card-media--fallback'), true);
    assert.equal(fallbackMedia.attributes.get('role'), 'img');
    assert.equal(fallbackMedia.attributes.get('aria-label'), 'No approved image：暫無核可圖片');
    assert.equal(fallbackMedia.dataset.vendorName, undefined);
    assert.equal(failedImage.removed, true);
    assert.equal(fallbackMedia.innerHTML, directStoreSvg);
    assert.doesNotMatch(fallbackMedia.innerHTML, /<img\b/i);
  });
});
