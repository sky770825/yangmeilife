import assert from 'node:assert/strict';
import { access, cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourceCategories = path.join(repositoryRoot, 'data/vendors/categories');
const referenceNow = new Date('2026-07-27T12:00:00+08:00');

const publishedVendors = async (root = repositoryRoot) => {
  const entries = await readdir(
    path.join(root, 'data/vendors/categories'),
    { withFileTypes: true }
  );
  const sources = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => JSON.parse(await readFile(
    path.join(root, 'data/vendors/categories', entry.name, 'vendors.json'),
    'utf8'
  ))));
  return sources.flatMap((source) => source.vendors.filter((vendor) => vendor.publicationStatus === 'published'));
};

const withTemporaryVendorData = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-media-rights-'));
  const categories = path.join(root, 'data/vendors/categories');
  await cp(sourceCategories, categories, { recursive: true });

  try {
    await mutate(categories);
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

const updateVendorFile = async (categories, slug, mutate) => {
  const file = path.join(categories, slug, 'vendors.json');
  const source = JSON.parse(await readFile(file, 'utf8'));
  mutate(source);
  await writeFile(file, `${JSON.stringify(source, null, 2)}\n`);
};

const expectFailure = async (root, expectedError) => {
  const result = await validateVendorData({ root, now: referenceNow });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), expectedError);
};

test('checked-in published records have the audited media-rights distribution', async () => {
  const vendors = await publishedVendors();
  assert.equal(vendors.length, 11);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'official-external').length, 4);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'no-approved-image').length, 7);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'permission-pending').length, 0);
});

test('official-external requires official metadata, an external image, traceable page, and no local asset', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      const vendor = source.vendors[0];
      vendor.media.rightsStatus = 'official-external';
      vendor.imageSourceType = 'official';
      vendor.imageSource = 'Official store page';
      vendor.imageSourceUrl = vendor.officialUrl;
      vendor.media.sourceUrl = vendor.officialUrl;
      vendor.media.assetPath = 'assets/images/kungfu-tea.png';
    }),
    (root) => expectFailure(root, /kungfu-tea.*official-external.*assetPath.*null/i)
  );
});

test('no-approved-image requires image and source fields to be cleared', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      const vendor = source.vendors[1];
      vendor.media.rightsStatus = 'no-approved-image';
      vendor.image = 'https://example.test/misleading-store-image.jpg';
      vendor.imageSourceType = 'official';
      vendor.imageSource = 'Unverified source';
      vendor.imageSourceUrl = 'https://example.test/source';
      vendor.fieldSources.image = ['https://example.test/source'];
      vendor.media.sourceUrl = 'https://example.test/source';
      vendor.media.assetPath = 'assets/images/misleading-store-image.jpg';
      vendor.media.permissionEvidence = 'Unverified claim';
      vendor.media.checkedAt = '2026-07-27T12:00:00+08:00';
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      const errors = result.errors.join('\n');
      for (const expectedError of [
        /beauty-skin.*no-approved-image.*image.*null/i,
        /beauty-skin.*no-approved-image.*imageSourceType.*null/i,
        /beauty-skin.*no-approved-image.*fieldSources\.image.*empty/i,
        /beauty-skin.*no-approved-image.*media\.sourceUrl.*null/i,
        /beauty-skin.*no-approved-image.*media\.assetPath.*null/i,
        /beauty-skin.*no-approved-image.*media\.permissionEvidence.*null/i
      ]) assert.match(errors, expectedError);
    }
  );
});

test('licensed-local requires permission evidence, local path, and an existing file', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      const vendor = source.vendors[0];
      vendor.media.rightsStatus = 'licensed-local';
      vendor.media.assetPath = 'assets/images/missing-kungfu-tea.png';
      vendor.media.permissionEvidence = null;
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      const errors = result.errors.join('\n');
      assert.match(errors, /kungfu-tea.*licensed-local.*assetPath.*existing file/i);
      assert.match(errors, /kungfu-tea.*licensed-local.*permissionEvidence/i);
    }
  );
});

test('invalid media rights status fails validation', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].media.rightsStatus = 'cleared-by-guesswork';
    }),
    (root) => expectFailure(root, /kungfu-tea.*rightsStatus.*invalid/i)
  );
});

test('media checkedAt must be valid and not in the future', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].media.checkedAt = '2026-07-28T12:00:00+08:00';
    }),
    (root) => expectFailure(root, /kungfu-tea.*media\.checkedAt.*future/i)
  );
});

test('no published vendor uses an Unsplash URL as its store image', async () => {
  const vendors = await publishedVendors();
  assert.equal(vendors.filter((vendor) => vendor.image && /(^|\.)unsplash\.com/i.test(new URL(vendor.image).hostname)).length, 0);
});

test('validation rejects an Unsplash URL used as a store image', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].image = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e';
    }),
    (root) => expectFailure(root, /kungfu-tea.*must not use an Unsplash URL/i)
  );
});

test('audited media changes do not alter merchant consent without evidence', async () => {
  const vendors = await publishedVendors();
  for (const vendor of vendors) {
    assert.equal(vendor.merchantConsent.status, 'not-recorded');
    assert.equal(vendor.merchantConsent.recordedAt, null);
    assert.equal(vendor.merchantConsent.evidence, null);
  }
});

test('licensed-local paths used by a vendor resolve within the repository', async () => {
  const vendors = await publishedVendors();
  for (const vendor of vendors.filter((candidate) => candidate.media.rightsStatus === 'licensed-local')) {
    await access(path.join(repositoryRoot, vendor.media.assetPath));
  }
});
