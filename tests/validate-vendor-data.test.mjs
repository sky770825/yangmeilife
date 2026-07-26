import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourceCategories = path.join(repositoryRoot, 'data/vendors/categories');
const referenceNow = new Date('2026-07-27T00:00:00.000Z');

const withTemporaryVendorData = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-vendors-'));
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

test('accepts the checked-in vendor sources', async () => {
  const result = await validateVendorData({ root: repositoryRoot, now: referenceNow });

  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.categoryCount, 11);
  assert.equal(result.publicVendorCount, 11);
});

test('rejects a second public Kung Fu Tea vendor', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors.push({ ...source.vendors[0], id: 'kungfu-tea-2' });
    }),
    (root) => expectFailure(root, /kungfu-tea.*exactly one public vendor/i)
  );
});

test('rejects a changed Kung Fu Tea address', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].address = '楊梅區測試路 1 號';
    }),
    (root) => expectFailure(root, /kungfu-tea.*address.*楊梅區四維路 90 號/i)
  );
});

test('rejects a verified candidate', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      source.candidateVendors[0].verified = true;
    }),
    (root) => expectFailure(root, /beauty-skin.*candidate.*must not have verified: true/i)
  );
});

test('rejects a verified vendor without a source URL', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].sourceUrls = [];
    }),
    (root) => expectFailure(root, /kungfu-tea.*sourceUrls.*at least one/i)
  );
});

test('rejects a verified vendor with a stale verification date', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].lastVerifiedAt = '2026-04-26';
    }),
    (root) => expectFailure(root, /kungfu-tea.*lastVerifiedAt.*older than 90 days/i)
  );
});
