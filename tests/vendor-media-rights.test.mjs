import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
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

const expectValid = async (root) => {
  const result = await validateVendorData({ root, now: referenceNow });
  assert.equal(result.valid, true, result.errors.join('\n'));
};

const configureOfficialExternal = (vendor) => {
  vendor.media.rightsStatus = 'official-external';
  vendor.image = 'https://cdn.example.test/official-image.jpg';
  vendor.imageSourceType = 'official';
  vendor.imageSource = 'Official store page';
  vendor.imageSourceUrl = vendor.officialUrl;
  vendor.media.sourceUrl = vendor.officialUrl;
  vendor.media.assetPath = null;
  vendor.media.permissionEvidence = null;
};

const configurePermissionPending = (vendor) => {
  vendor.media.rightsStatus = 'permission-pending';
  vendor.image = 'https://cdn.example.test/pending-store-image.jpg';
  vendor.imageSourceType = 'official';
  vendor.imageSource = 'Official store page';
  vendor.imageSourceUrl = vendor.officialUrl;
  vendor.media.sourceUrl = vendor.officialUrl;
  vendor.media.assetPath = null;
  vendor.media.permissionEvidence = null;
  vendor.media.pendingReason = 'Origin is verified; reuse permission remains unrecorded.';
};

const configureLicensedLocal = (vendor, assetPath) => {
  vendor.media.rightsStatus = 'licensed-local';
  vendor.media.assetPath = assetPath;
  vendor.media.permissionEvidence = 'https://evidence.example.test/vendor-license';
};

test('checked-in published records have the audited media-rights distribution', async () => {
  const vendors = await publishedVendors();
  assert.equal(vendors.length, 11);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'official-external').length, 4);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'no-approved-image').length, 7);
  assert.equal(vendors.filter((vendor) => vendor.media.rightsStatus === 'permission-pending').length, 0);
});

test('official-external accepts a valid permission evidence URL', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      const vendor = source.vendors[0];
      configureOfficialExternal(vendor);
      vendor.media.permissionEvidence = 'https://evidence.example.test/permission';
    }),
    expectValid
  );
});

for (const [name, mutate, expectedError] of [
  ['requires an external image URL', (vendor) => { vendor.image = null; }, /official-external.*image.*http/i],
  ['requires official image source type', (vendor) => { vendor.imageSourceType = 'stock'; }, /official-external.*imageSourceType.*official/i],
  ['requires non-empty image source metadata', (vendor) => { vendor.imageSource = ''; }, /official-external.*source metadata/i],
  ['requires an HTTP(S) image source URL', (vendor) => { vendor.imageSourceUrl = 'mailto:source@example.test'; }, /official-external.*source metadata/i],
  ['requires a traceable source page', (vendor) => { vendor.media.sourceUrl = 'https://untracked.example.test/source'; }, /official-external.*traceable official page/i],
  ['requires a null local asset path', (vendor) => { vendor.media.assetPath = 'media/vendor.jpg'; }, /official-external.*assetPath.*null/i],
  ['rejects non-URL permission evidence', (vendor) => { vendor.media.permissionEvidence = 'merchant email'; }, /official-external.*permissionEvidence.*http/i]
]) {
  test(`official-external ${name}`, async () => {
    await withTemporaryVendorData(
      (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
        const vendor = source.vendors[0];
        configureOfficialExternal(vendor);
        mutate(vendor);
      }),
      (root) => expectFailure(root, expectedError)
    );
  });
}

test('permission-pending accepts a known official image pending a documented decision', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      configurePermissionPending(source.vendors[0]);
    }),
    expectValid
  );
});

for (const [name, mutate, expectedError] of [
  ['requires an external image URL', (vendor) => { vendor.image = null; }, /permission-pending.*image.*http/i],
  ['requires official image source type', (vendor) => { vendor.imageSourceType = 'stock'; }, /permission-pending.*imageSourceType.*official/i],
  ['requires non-empty image source metadata', (vendor) => { vendor.imageSource = ''; }, /permission-pending.*source metadata/i],
  ['requires an HTTP(S) image source URL', (vendor) => { vendor.imageSourceUrl = 'mailto:source@example.test'; }, /permission-pending.*source metadata/i],
  ['requires a traceable source page', (vendor) => { vendor.media.sourceUrl = 'https://untracked.example.test/source'; }, /permission-pending.*traceable official page/i],
  ['requires a null local asset path', (vendor) => { vendor.media.assetPath = 'media/vendor.jpg'; }, /permission-pending.*assetPath.*null/i],
  ['requires null permission evidence', (vendor) => { vendor.media.permissionEvidence = 'https://evidence.example.test/permission'; }, /permission-pending.*permissionEvidence.*null/i],
  ['requires a pending decision reason', (vendor) => { vendor.media.pendingReason = ' '; }, /permission-pending.*pendingReason/i],
  ['rejects an unrelated stock image', (vendor) => {
    vendor.image = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e';
    vendor.imageSourceType = 'stock';
  }, /permission-pending.*imageSourceType.*official/i]
]) {
  test(`permission-pending ${name}`, async () => {
    await withTemporaryVendorData(
      (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
        const vendor = source.vendors[0];
        configurePermissionPending(vendor);
        mutate(vendor);
      }),
      (root) => expectFailure(root, expectedError)
    );
  });
}

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

test('licensed-local accepts a relative in-repository regular file with an HTTP(S) evidence URL', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      configureLicensedLocal(source.vendors[0], 'media/authorized-vendor-image.jpg');
    }),
    async (root) => {
      await mkdir(path.join(root, 'media'), { recursive: true });
      await writeFile(path.join(root, 'media/authorized-vendor-image.jpg'), 'temporary fixture');
      await expectValid(root);
    }
  );
});

for (const [name, assetPath, setup, expectedError] of [
  ['rejects a missing asset file', 'media/missing-vendor-image.jpg', async () => {}, /licensed-local.*regular file/i],
  ['rejects a directory asset path', 'media/vendor-directory', async (root) => {
    await mkdir(path.join(root, 'media/vendor-directory'), { recursive: true });
  }, /licensed-local.*regular file/i],
  ['rejects a final symlink asset path', 'media/vendor-link.jpg', async (root) => {
    await mkdir(path.join(root, 'media'), { recursive: true });
    await writeFile(path.join(root, 'media/vendor-target.jpg'), 'temporary fixture');
    await symlink('vendor-target.jpg', path.join(root, 'media/vendor-link.jpg'));
  }, /licensed-local.*regular file/i],
  ['rejects an absolute asset path', '/tmp/vendor-image.jpg', async () => {}, /licensed-local.*relative in-repository/i],
  ['rejects an escape asset path', '../vendor-image.jpg', async () => {}, /licensed-local.*relative in-repository/i]
]) {
  test(`licensed-local ${name}`, async () => {
    await withTemporaryVendorData(
      (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
        configureLicensedLocal(source.vendors[0], assetPath);
      }),
      async (root) => {
        await setup(root);
        await expectFailure(root, expectedError);
      }
    );
  });
}

test('licensed-local rejects a path through an in-repository symlink to outside the repository', async () => {
  const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'yangmeilife-outside-media-'));
  try {
    await writeFile(path.join(outsideRoot, 'outside-vendor-image.jpg'), 'outside fixture');
    await withTemporaryVendorData(
      (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
        configureLicensedLocal(source.vendors[0], 'media/outside-vendor-image.jpg');
      }),
      async (root) => {
        await symlink(outsideRoot, path.join(root, 'media'));
        await expectFailure(root, /licensed-local.*regular file/i);
      }
    );
  } finally {
    await rm(outsideRoot, { recursive: true, force: true });
  }
});

test('licensed-local requires an HTTP(S) permission evidence URL', async () => {
  await withTemporaryVendorData(
    (categories) => updateVendorFile(categories, 'kungfu-tea', (source) => {
      configureLicensedLocal(source.vendors[0], 'media/authorized-vendor-image.jpg');
      source.vendors[0].media.permissionEvidence = 'merchant email';
    }),
    async (root) => {
      await mkdir(path.join(root, 'media'), { recursive: true });
      await writeFile(path.join(root, 'media/authorized-vendor-image.jpg'), 'temporary fixture');
      await expectFailure(root, /licensed-local.*permissionEvidence.*http/i);
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
