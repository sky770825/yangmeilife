import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const referenceNow = new Date('2026-07-27T00:00:00.000Z');
const shouldCopy = (source) => {
  const relative = path.relative(repositoryRoot, source);
  return !relative.startsWith('.git')
    && !relative.startsWith('archive')
    && !relative.startsWith('output')
    && !relative.startsWith('.playwright-cli')
    && !relative.startsWith('.superpowers');
};

const updateVendorFile = async (root, slug, mutate) => {
  const file = path.join(root, 'data/vendors/categories', slug, 'vendors.json');
  const source = JSON.parse(await readFile(file, 'utf8'));
  mutate(source);
  await writeFile(file, `${JSON.stringify(source, null, 2)}\n`);
};

const withTemporaryRepository = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-publication-'));
  try {
    await cp(repositoryRoot, root, { recursive: true, filter: shouldCopy });
    await mutate(root);
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
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
  const data = JSON.parse(await readFile(path.join(root, 'data/vendors/vendor-categories.json'), 'utf8'));
  return data.categories.flatMap((category) => category.vendors.map((vendor) => vendor.id));
};

const browserRuntimeVendorIds = async (root) => {
  const payload = await readFile(path.join(root, 'assets/js/vendor-data.js'), 'utf8');
  const categories = JSON.parse(payload
    .replace(/^window\.YANGMEI_VENDOR_CATEGORIES = /, '')
    .replace(/;\n$/, ''));
  return categories.flatMap((category) => category.vendors.map((vendor) => vendor.id));
};

test('accepts a complete published vendor record', async () => {
  await withTemporaryRepository(
    async () => {},
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, true, result.errors.join('\n'));
      assert.equal(result.publicVendorCount, 11);
    }
  );
});

test('rejects a published vendor without phone evidence', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].fieldSources.phone = [];
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*fieldSources\.phone.*non-empty/i);
    }
  );
});

test('rejects a published vendor with stale sourceCheckedAt', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].sourceCheckedAt = '2026-04-26T09:23:39+08:00';
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*sourceCheckedAt.*older than 90 days/i);
    }
  );
});

test('rejects field evidence that is not traceable to the vendor source record', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].fieldSources.phone = ['https://invented.example.com/source'];
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*fieldSources\.phone.*traceable/i);
    }
  );
});

test('rejects field evidence that is not an http(s) URL', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].fieldSources.phone = ['ftp://www.kungfutea.com.tw/location/?page=11'];
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*fieldSources\.phone.*http\(s\)/i);
    }
  );
});

test('rejects a nextReviewAt value that is not 90 Taipei calendar days after lastVerifiedAt', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].nextReviewAt = '2026-10-02';
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*nextReviewAt.*90 calendar days/i);
    }
  );
});

test('keeps a hold record valid but excludes it from runtime data', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'beauty-skin', (source) => {
      source.vendors[0].publicationStatus = 'hold';
    }),
    async (root) => {
      const validation = await validateVendorData({ root, now: referenceNow });
      assert.equal(validation.valid, true, validation.errors.join('\n'));
      const build = await runBuild(root);
      assert.equal(build.code, 0, build.stderr);
      assert.ok(!(await runtimeVendorIds(root)).includes('beauty-skin-real-1'));
    }
  );
});

test('excludes a retired record from runtime data', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'beauty-skin', (source) => {
      source.vendors[0].publicationStatus = 'retired';
    }),
    async (root) => {
      const build = await runBuild(root);
      assert.equal(build.code, 0, build.stderr);
      assert.ok(!(await runtimeVendorIds(root)).includes('beauty-skin-real-1'));
    }
  );
});

test('excludes candidate records from runtime data', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'beauty-skin', (source) => {
      source.candidateVendors[0].id = 'candidate-runtime-check';
    }),
    async (root) => {
      const build = await runBuild(root);
      assert.equal(build.code, 0, build.stderr);
      assert.ok(!(await runtimeVendorIds(root)).includes('candidate-runtime-check'));
    }
  );
});

test('preserves source vendors and emits only published records to generated runtime data', async () => {
  await withTemporaryRepository(
    async (root) => {
      await updateVendorFile(root, 'beauty-skin', (source) => {
        source.vendors[0].publicationStatus = 'hold';
        source.vendors[1].publicationStatus = 'retired';
        source.candidateVendors[0].id = 'candidate-runtime-check';
      });
    },
    async (root) => {
      const sourceFile = path.join(root, 'data/vendors/categories/beauty-skin/vendors.json');
      const beforeBuild = await readFile(sourceFile, 'utf8');
      const build = await runBuild(root);
      assert.equal(build.code, 0, build.stderr);
      assert.equal(await readFile(sourceFile, 'utf8'), beforeBuild);

      const excludedIds = ['beauty-skin-real-1', 'beauty-skin-real-2', 'candidate-runtime-check'];
      const categoryIds = await runtimeVendorIds(root);
      const browserIds = await browserRuntimeVendorIds(root);
      for (const id of excludedIds) {
        assert.ok(!categoryIds.includes(id));
        assert.ok(!browserIds.includes(id));
      }

      const summary = JSON.parse(await readFile(path.join(root, 'data/vendors/vendor-summary.json'), 'utf8'));
      assert.equal(summary.vendorCount, 9);
    }
  );
});

test('rejects a changed Kung Fu Tea source record', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'kungfu-tea', (source) => {
      source.vendors[0].address = '楊梅區測試路 1 號';
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /kungfu-tea.*address.*楊梅區四維路 90 號/i);
    }
  );
});

test('rejects a twelfth published vendor', async () => {
  await withTemporaryRepository(
    (root) => updateVendorFile(root, 'beauty-skin', (source) => {
      source.vendors.push({ ...source.vendors[0], id: 'beauty-skin-real-4' });
    }),
    async (root) => {
      const result = await validateVendorData({ root, now: referenceNow });
      assert.equal(result.valid, false);
      assert.match(result.errors.join('\n'), /at most 11 published vendors/i);
    }
  );
});
