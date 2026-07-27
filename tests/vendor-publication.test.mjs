import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateVendorData } from '../scripts/validate-vendor-data.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const referenceNow = new Date('2026-07-27T00:00:00.000Z');
const publishedVendorFields = {
  publicationStatus: 'published',
  sourceCheckedAt: '2026-07-03T09:23:39+08:00',
  nextReviewAt: '2026-10-01',
  reviewedBy: '2026-07-03 review migration',
  fieldSources: {
    name: ['https://example.com/source'],
    phone: ['https://example.com/source'],
    address: ['https://example.com/source'],
    businessHours: ['https://example.com/source'],
    officialUrl: ['https://example.com/source'],
    lineUrl: [],
    image: []
  },
  placeId: null,
  coordinates: { latitude: null, longitude: null },
  media: {
    rightsStatus: 'permission-pending',
    sourceUrl: null,
    assetPath: null,
    permissionEvidence: null,
    checkedAt: '2026-07-03T09:23:39+08:00'
  },
  merchantConsent: {
    status: 'not-recorded',
    recordedAt: null,
    evidence: null
  }
};

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

const addPublicationContract = (vendor) => {
  const sourceUrls = [
    ...new Set([
      ...(vendor.sourceUrls || []),
      vendor.officialUrl,
      vendor.imageSourceUrl,
      vendor.lineUrl
    ].filter(Boolean))
  ];
  const officialUrls = [vendor.officialUrl, ...sourceUrls].filter(Boolean);
  return {
    ...vendor,
    ...publishedVendorFields,
    fieldSources: {
      ...publishedVendorFields.fieldSources,
      name: sourceUrls,
      phone: sourceUrls,
      address: sourceUrls,
      businessHours: vendor.businessHours ? sourceUrls : [],
      officialUrl: officialUrls,
      lineUrl: vendor.lineUrl ? [vendor.lineUrl] : [],
      image: vendor.imageSourceUrl ? [vendor.imageSourceUrl] : []
    },
    media: {
      ...publishedVendorFields.media,
      sourceUrl: vendor.imageSourceUrl || null
    }
  };
};

const migratePublishedVendors = async (root) => {
  for (const slug of ['beauty-skin', 'hair-salon', 'nail-service', 'kungfu-tea']) {
    await updateVendorFile(root, slug, (source) => {
      source.vendors = source.vendors.map(addPublicationContract);
    });
  }
};

const withTemporaryRepository = async (mutate, callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-publication-'));
  try {
    await cp(repositoryRoot, root, { recursive: true, filter: shouldCopy });
    await migratePublishedVendors(root);
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
