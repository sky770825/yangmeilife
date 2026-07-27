import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourceCategories = path.join(repositoryRoot, 'data/vendors/categories');
const referenceNow = new Date('2026-07-27T12:00:00+08:00');

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

test('rejects a verified vendor with a future verification date', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      source.vendors[0].lastVerifiedAt = '2026-07-28';
    }),
    (root) => expectFailure(root, /kungfu-tea.*lastVerifiedAt.*must not be in the future/i)
  );
});

test('accepts the current Taipei calendar date during Taiwan early morning', async () => {
  await withTemporaryVendorData(
    async (categories) => {
      for (const slug of ['beauty-skin', 'hair-salon', 'kungfu-tea', 'nail-service']) {
        await updateVendorFile(categories, slug, (source) => {
          source.vendors.forEach((vendor) => {
            vendor.media.checkedAt = '2026-07-27T00:00:00+08:00';
          });
          if (slug === 'kungfu-tea') {
            source.vendors[0].lastVerifiedAt = '2026-07-27';
            source.vendors[0].nextReviewAt = '2026-10-25';
          }
        });
      }
    },
    async (root) => {
      const result = await validateVendorData({
        root,
        now: new Date('2026-07-26T16:30:00.000Z')
      });

      assert.equal(result.valid, true, result.errors.join('\n'));
    }
  );
});

test('rejects a missing expected category even when an extra category keeps the count at 11', async () => {
  await withTemporaryVendorData(
    (categories) => rename(
      path.join(categories, 'beauty-skin'),
      path.join(categories, 'unexpected-category')
    ),
    (root) => expectFailure(root, /missing required vendor category.*beauty-skin/i)
  );
});

test('a failed build does not overwrite generated output', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-build-'));
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
    const generatedOutput = path.join(root, 'data/vendors/vendor-categories.json');
    const before = await readFile(generatedOutput, 'utf8');
    await rename(
      path.join(root, 'data/vendors/categories/beauty-skin'),
      path.join(root, 'data/vendors/categories/unexpected-category')
    );

    const result = await runBuild(root);

    assert.notEqual(result.code, 0);
    assert.match(result.stderr, /Vendor data validation failed/);
    assert.equal(await readFile(generatedOutput, 'utf8'), before);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
