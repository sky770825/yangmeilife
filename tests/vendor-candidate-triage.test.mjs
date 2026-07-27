import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
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
    const publicVendorIds = source.vendors.map((vendor) => vendor.id);
    for (const candidate of source.candidateVendors ?? []) {
      records.push({ category: entry.name, candidate, publicVendorIds });
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

test('checked-in data has exactly 30 fully triaged legacy demo candidates', async () => {
  const records = await candidateRecords();
  assert.equal(records.length, 30);
  const publicVendorIds = new Set(records.flatMap((record) => record.publicVendorIds));

  for (const { candidate } of records) {
    assert.ok(allowedDispositions.has(candidate.candidateDisposition));
    assert.equal(candidate.candidateDisposition, 'no-authoritative-source');
    assert.equal(candidate.triagedAt, '2026-07-27');
    assert.equal(candidate.triagedBy, 'A2.4 candidate triage');
    assert.equal(candidate.candidateNameStatus, 'legacy-demo-label');
    assert.match(candidate.triageNote, /no authoritative source.*legacy demo label.*audit/i);
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
    assert.ok(!publicVendorIds.has(candidate.id));
  }
});

test('accepts generic non-cohort triage metadata with supported candidate name statuses', async (t) => {
  for (const candidateNameStatus of ['reported-name', 'official-name']) {
    await t.test(candidateNameStatus, async () => {
      await withTemporaryVendorData(
        (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
          Object.assign(source.candidateVendors[0], {
            triagedAt: '2026-07-26',
            triagedBy: 'vendor data reviewer',
            candidateNameStatus,
            triageNote: 'Candidate remains unpublished pending a source review.',
            updatedAt: '2026-07-26T09:00:00+08:00'
          });
        }),
        async (root) => {
          const result = await validateVendorData({ root, now: referenceNow });
          assert.equal(result.valid, true, result.errors.join('\n'));
        }
      );
    });
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

test('rejects malformed generic candidate triage metadata', async (t) => {
  const cases = [
    ['invalid triagedAt', (candidate) => { candidate.triagedAt = '2026-07-40'; }, /triagedAt.*valid ISO date/i],
    ['future triagedAt', (candidate) => { candidate.triagedAt = '2026-07-28'; }, /triagedAt.*future/i],
    ['blank triagedBy', (candidate) => { candidate.triagedBy = ' '; }, /triagedBy.*non-empty/i],
    ['invalid candidateNameStatus', (candidate) => { candidate.candidateNameStatus = 'unreviewed-name'; }, /candidateNameStatus/i],
    ['blank triageNote', (candidate) => { candidate.triageNote = ''; }, /triageNote.*non-empty/i],
    ['updatedAt before triagedAt', (candidate) => { candidate.updatedAt = '2026-07-26T09:00:00+08:00'; }, /updatedAt.*before triagedAt/i]
  ];

  for (const [name, mutate, expectedError] of cases) {
    await t.test(name, async () => {
      await withTemporaryVendorData(
        (categories) => updateVendorFile(categories, 'beauty-skin', (source) => mutate(source.candidateVendors[0])),
        (root) => expectFailure(root, expectedError)
      );
    });
  }
});

test('rejects candidates that miss disposition-specific evidence', async (t) => {
  const cases = [
    ['source-found without a valid source URL', (candidate) => { candidate.candidateDisposition = 'source-found'; }, /source-found.*at least one valid/i],
    ['identity-conflict with one valid source URL', (candidate) => {
      candidate.candidateDisposition = 'identity-conflict';
      candidate.sourceUrls = ['https://example.com/source'];
    }, /identity-conflict.*at least two valid/i],
    ['possibly-closed without a valid source URL', (candidate) => { candidate.candidateDisposition = 'possibly-closed'; }, /possibly-closed.*at least one valid/i],
    ['duplicate without duplicateOfId', (candidate) => { candidate.candidateDisposition = 'duplicate'; }, /duplicate.*duplicateOfId/i],
    ['out-of-area without a valid source URL', (candidate) => { candidate.candidateDisposition = 'out-of-area'; }, /out-of-area.*at least one valid/i],
    ['out-of-area without an area', (candidate) => {
      candidate.candidateDisposition = 'out-of-area';
      candidate.sourceUrls = ['https://example.com/source'];
      candidate.area = '';
    }, /out-of-area.*non-empty.*area/i]
  ];

  for (const [name, mutate, expectedError] of cases) {
    await t.test(name, async () => {
      await withTemporaryVendorData(
        (categories) => updateVendorFile(categories, 'beauty-skin', (source) => mutate(source.candidateVendors[0])),
        (root) => expectFailure(root, expectedError)
      );
    });
  }
});

test('rejects every unsupported no-authoritative-source field', async (t) => {
  const cases = [
    ['price', '$999'],
    ['rating', '4.9'],
    ['image', 'https://example.com/image.jpg'],
    ['phone', '03-123-4567'],
    ['address', '楊梅區測試路 1 號'],
    ['businessHours', '09:00-18:00'],
    ['officialUrl', 'https://example.com/official'],
    ['mapUrl', 'https://example.com/map'],
    ['lineUrl', 'https://example.com/line'],
    ['tags', ['unsupported']],
    ['sourceUrls', ['https://example.com/source']],
    ['officialSource', 'Example source'],
    ['lastVerifiedAt', '2026-07-27']
  ];

  for (const [field, value] of cases) {
    await t.test(field, async () => {
      await withTemporaryVendorData(
        (categories) => updateVendorFile(categories, 'beauty-skin', (source) => {
          source.candidateVendors[0][field] = value;
        }),
        (root) => expectFailure(root, new RegExp(`beauty-skin.*${field}.*${field === 'tags' || field === 'sourceUrls' ? 'empty' : 'null'}`, 'i'))
      );
    });
  }
});
