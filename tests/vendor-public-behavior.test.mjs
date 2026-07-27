import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

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

async function generatedCategoryScript(repoRoot) {
  const page = await readFile(path.join(repoRoot, 'assets/js/vendor-page.js'), 'utf8');
  const start = page.indexOf('const vendorCard = (vendor, category) => {');
  const end = page.indexOf('const matchesFilter =', start);

  assert.notEqual(start, -1, 'generated category page should contain the vendor-card renderer');
  assert.notEqual(end, -1, 'generated category page should end the vendor-card renderer before filtering');

  return page.slice(start, end);
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
    const cardScript = await generatedCategoryScript(repoRoot);

    assert.equal(runtimeVendors.length, 11);
    assert.ok(runtimeVendors.every((vendor) => vendor.publicationStatus === 'published'));
    assert.ok(runtimeVendors.every((vendor) => vendor.verified === true));
    assert.ok(runtimeVendors.every((vendor) => vendor.rating === null));
    assert.ok(runtimeVendors.every((vendor) => typeof vendor.phone === 'string' && vendor.phone.length > 0));
    assert.ok(runtimeVendors.every((vendor) => typeof vendor.address === 'string' && vendor.address.length > 0));
    assert.ok(runtimeVendors.every((vendor) => /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/.test(vendor.mapUrl)));
    assert.ok(sourceCategories.candidateVendors.every((candidate) => !runtimeVendors.some((vendor) => vendor.id === candidate.id)));

    assert.doesNotMatch(cardScript, /vendor\.rating/);
    assert.match(cardScript, /const phoneHref = vendor\.phone \? 'tel:' \+ String\(vendor\.phone\)\.replace\(/);
    assert.match(cardScript, /quickLink\('map', '導航', vendor\.mapUrl \|\| null/);
  });
});

test('generated public vendor cards never route missing store contacts to a generic platform', async () => {
  await withGeneratedSite(async (repoRoot) => {
    const cardScript = await generatedCategoryScript(repoRoot);

    assert.match(cardScript, /const officialHref = vendor\.officialUrl \|\| null;/);
    assert.match(cardScript, /const inquiryHref = vendor\.lineUrl \|\| vendor\.officialUrl \|\| null;/);
    assert.doesNotMatch(cardScript, /vendor\.lineUrl \|\| vendor\.officialUrl \|\| LINE_URL/);
    assert.match(cardScript, /inquiryHref\s*\?\s*`<a class="vendor-card-action vendor-card-action--primary"/);
    assert.match(cardScript, /aria-disabled="true"/);
  });
});
