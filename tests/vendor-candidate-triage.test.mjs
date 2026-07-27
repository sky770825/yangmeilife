import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourceCategories = path.join(repositoryRoot, 'data/vendors/categories');
const referenceNow = new Date('2026-07-27T00:00:00.000Z');
const allowedDispositions = new Set([
  'source-found',
  'identity-conflict',
  'possibly-closed',
  'duplicate',
  'no-authoritative-source',
  'out-of-area'
]);
const strippedFields = [
  'price',
  'rating',
  'image',
  'phone',
  'address',
  'businessHours',
  'officialUrl',
  'mapUrl',
  'lineUrl'
];

const candidateRecords = async (root = repositoryRoot) => {
  const categories = path.join(root, 'data/vendors/categories');
  const entries = await readdir(categories, { withFileTypes: true });
  const records = [];

  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const source = JSON.parse(await readFile(path.join(categories, entry.name, 'vendors.json'), 'utf8'));
    for (const candidate of source.candidateVendors ?? []) {
      records.push({ category: entry.name, candidate });
    }
  }

  return records;
};

const withTemporaryVendorData = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-candidate-triage-'));
  const categories = path.join(root, 'data/vendors/categories');
  await cp(sourceCategories, categories, { recursive: true });

  try {
    await mutate(categories);
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

const withTemporaryRepository = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-candidate-build-'));
  const shouldCopy = (source) => {
    const relative = path.relative(repositoryRoot, source);
    return !relative.startsWith('.git')
      && !relative.startsWith('archive')
      && !relative.startsWith('output')
      && !relative.startsWith('.playwright-cli')
      && !relative.startsWith('.superpowers');
  };

  try {
    await cp(repositoryRoot, root, { recursive: true, filter: shouldCopy });
    await mutate(root);
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

const runBuild = (root) => new Promise((resolve) => {
  const child = spawn(process.execPath, ['scripts/build-main-structure.mjs'], {
    cwd: root,
    env: { ...process.env, BUILD_TIMESTAMP: '2026-07-27T00:00:00.000Z' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  child.on('close', (code) => resolve({ code, stderr }));
});

const runtimeVendorIds = async (root) => {
  const categoryData = JSON.parse(await readFile(path.join(root, 'data/vendors/vendor-categories.json'), 'utf8'));
  const browserData = JSON.parse((await readFile(path.join(root, 'assets/js/vendor-data.js'), 'utf8'))
    .replace(/^window\.YANGMEI_VENDOR_CATEGORIES = /, '')
    .replace(/;\n$/, ''));

  return [
    categoryData.categories.flatMap((category) => category.vendors.map((vendor) => vendor.id)),
    browserData.flatMap((category) => category.vendors.map((vendor) => vendor.id))
  ];
};

test('checked-in data has exactly 30 fully triaged legacy demo candidates', async () => {
  const records = await candidateRecords();
  assert.equal(records.length, 30);

  for (const { candidate } of records) {
    assert.ok(allowedDispositions.has(candidate.candidateDisposition));
    assert.equal(candidate.candidateDisposition, 'no-authoritative-source');
    assert.equal(candidate.triagedAt, '2026-07-27');
    assert.equal(candidate.triagedBy, 'A2.4 candidate triage');
    assert.equal(candidate.candidateNameStatus, 'legacy-demo-label');
    assert.equal(candidate.verified, false);
    assert.equal(candidate.needsVerification, true);
    assert.equal(candidate.removedFromFrontend, true);
    assert.notEqual(candidate.publicationStatus, 'published');
    assert.equal(candidate.dataReadiness, 'internal-candidate');
    assert.equal(candidate.verificationLevel, 'needs_contact');
    assert.match(candidate.updatedAt, /^2026-07-27T\d{2}:\d{2}:\d{2}\+08:00$/);
    assert.match(candidate.sourceNote, /legacy demo label.*not a verified business listing/i);
    assert.deepEqual(candidate.tags, []);
    assert.deepEqual(candidate.sourceUrls, []);
    assert.equal(candidate.officialSource, null);
    assert.equal(candidate.lastVerifiedAt, null);
    for (const field of strippedFields) assert.equal(candidate[field], null);
  }
});

test('rejects a candidate marked verified', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      source.candidateVendors[0].verified = true;
    }),
    (root) => expectFailure(root, /beauty-skin.*candidate.*verified.*false/i)
  );
});

test('rejects a candidate marked published', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      source.candidateVendors[0].publicationStatus = 'published';
    }),
    (root) => expectFailure(root, /beauty-skin.*candidate.*publicationStatus.*published/i)
  );
});

test('rejects a candidate with a missing disposition', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      delete source.candidateVendors[0].candidateDisposition;
    }),
    (root) => expectFailure(root, /beauty-skin.*candidateDisposition/i)
  );
});

test('rejects a candidate with an invalid disposition', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      source.candidateVendors[0].candidateDisposition = 'unreviewed';
    }),
    (root) => expectFailure(root, /beauty-skin.*candidateDisposition/i)
  );
});

test('rejects a candidate missing required triage metadata', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      delete source.candidateVendors[0].triagedAt;
    }),
    (root) => expectFailure(root, /beauty-skin.*triagedAt/i)
  );
});

test('rejects an unsupported consumer fact on a no-authoritative-source candidate', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
      source.candidateVendors[0].price = '$999';
    }),
    (root) => expectFailure(root, /beauty-skin.*price.*null/i)
  );
});

test('keeps candidate IDs out of temporary generated category and browser runtime data', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(path.join(root, 'data/vendors/categories'), 'beauty-skin', (source) => {
      source.candidateVendors[0].id = 'candidate-runtime-check';
    }),
    async (root) => {
      const build = await runBuild(root);
      assert.equal(build.code, 0, build.stderr);
      const [categoryIds, browserIds] = await runtimeVendorIds(root);
      assert.ok(!categoryIds.includes('candidate-runtime-check'));
      assert.ok(!browserIds.includes('candidate-runtime-check'));
    }
  );
});
