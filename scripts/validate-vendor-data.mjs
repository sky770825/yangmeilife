import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CATEGORY_COUNT = 11;
const PUBLIC_VENDOR_COUNT = 11;
const MAX_VERIFICATION_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const VENDOR_SOURCE_ROOT = 'data/vendors/categories';
const KUNGFU_TEA = {
  id: 'kungfu-tea-1',
  name: '功夫茶楊梅四維店',
  address: '楊梅區四維路 90 號'
};

const isPresent = (value) => typeof value === 'string' && value.trim().length > 0;

const formatContext = ({ file, slug, vendor }) => {
  const parts = [`file=${file}`, `category=${slug}`];
  if (vendor) parts.push(`vendor=${vendor.id || vendor.name || 'unknown'}`);
  return `[${parts.join('] [')}]`;
};

const isMainModule = () => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export const validateVendorData = async ({ root = process.cwd(), now = new Date() } = {}) => {
  const errors = [];
  const sourceRoot = path.join(root, VENDOR_SOURCE_ROOT);
  let categoryEntries = [];

  try {
    categoryEntries = await readdir(sourceRoot, { withFileTypes: true });
  } catch (error) {
    return {
      valid: false,
      errors: [`[file=${VENDOR_SOURCE_ROOT}] Cannot read vendor category source folders: ${error.message}`],
      categoryCount: 0,
      publicVendorCount: 0
    };
  }

  const categoryFolders = categoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (categoryFolders.length !== CATEGORY_COUNT) {
    errors.push(`[file=${VENDOR_SOURCE_ROOT}] Expected exactly ${CATEGORY_COUNT} vendor category source folders; found ${categoryFolders.length}.`);
  }

  const publicVendors = [];
  const vendorIds = new Map();
  const sourceBySlug = new Map();

  for (const slug of categoryFolders) {
    const relativeFile = `${VENDOR_SOURCE_ROOT}/${slug}/vendors.json`;
    const file = path.join(root, relativeFile);
    let source;

    try {
      source = JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
      errors.push(`${formatContext({ file: relativeFile, slug })} Cannot read valid JSON: ${error.message}`);
      continue;
    }

    sourceBySlug.set(slug, source);

    if (!Array.isArray(source.vendors)) {
      errors.push(`${formatContext({ file: relativeFile, slug })} Public vendors must be an array in vendors[].`);
      continue;
    }

    if (!Array.isArray(source.candidateVendors)) {
      errors.push(`${formatContext({ file: relativeFile, slug })} Candidate records must be an array in candidateVendors[].`);
    } else {
      source.candidateVendors.forEach((candidate, index) => {
        if (candidate?.verified === true) {
          errors.push(`${formatContext({ file: relativeFile, slug, vendor: candidate })} Candidate record at candidateVendors[${index}] must not have verified: true.`);
        }
      });
    }

    source.vendors.forEach((vendor, index) => {
      const context = formatContext({ file: relativeFile, slug, vendor });
      publicVendors.push({ vendor, slug, relativeFile });

      if (!isPresent(vendor?.id)) {
        errors.push(`${context} Public vendor at vendors[${index}] requires id.`);
      } else if (vendorIds.has(vendor.id)) {
        errors.push(`${context} Public vendor id "${vendor.id}" must be globally unique; already used by ${vendorIds.get(vendor.id)}.`);
      } else {
        vendorIds.set(vendor.id, `${relativeFile} (${slug})`);
      }

      for (const field of ['name', 'verificationStatus', 'updatedAt']) {
        if (!isPresent(vendor?.[field])) {
          errors.push(`${context} Public vendor requires ${field}.`);
        }
      }

      if (!isPresent(vendor?.dataSource)) {
        errors.push(`${context} Public vendor requires category source context in dataSource.`);
      } else if (vendor.dataSource !== relativeFile) {
        errors.push(`${context} Public vendor dataSource must be "${relativeFile}".`);
      }

      if (vendor?.verified !== true) return;

      for (const field of ['phone', 'address', 'officialSource', 'lastVerifiedAt']) {
        if (!isPresent(vendor[field])) {
          errors.push(`${context} Verified vendor requires ${field}.`);
        }
      }

      if (!Array.isArray(vendor.sourceUrls) || !vendor.sourceUrls.some(isPresent)) {
        errors.push(`${context} Verified vendor sourceUrls must contain at least one entry.`);
      }

      if (isPresent(vendor.lastVerifiedAt)) {
        const lastVerifiedAt = Date.parse(vendor.lastVerifiedAt);
        if (Number.isNaN(lastVerifiedAt)) {
          errors.push(`${context} Verified vendor lastVerifiedAt must be a valid date.`);
        } else if (now.getTime() - lastVerifiedAt > MAX_VERIFICATION_AGE_MS) {
          errors.push(`${context} Verified vendor lastVerifiedAt is older than 90 days.`);
        }
      }
    });
  }

  if (publicVendors.length !== PUBLIC_VENDOR_COUNT) {
    errors.push(`[file=${VENDOR_SOURCE_ROOT}] Expected exactly ${PUBLIC_VENDOR_COUNT} public vendors across all vendors[] arrays; found ${publicVendors.length}.`);
  }

  const kungfuTea = sourceBySlug.get('kungfu-tea');
  const kungfuTeaFile = `${VENDOR_SOURCE_ROOT}/kungfu-tea/vendors.json`;
  if (!kungfuTea) {
    errors.push(`[file=${kungfuTeaFile}] Missing required kungfu-tea category source folder.`);
  } else if (!Array.isArray(kungfuTea.vendors)) {
    errors.push(`${formatContext({ file: kungfuTeaFile, slug: 'kungfu-tea' })} Public vendors must be an array in vendors[].`);
  } else {
    if (kungfuTea.vendors.length !== 1) {
      errors.push(`${formatContext({ file: kungfuTeaFile, slug: 'kungfu-tea' })} kungfu-tea must contain exactly one public vendor; found ${kungfuTea.vendors.length}.`);
    }

    const vendor = kungfuTea.vendors[0];
    const context = formatContext({ file: kungfuTeaFile, slug: 'kungfu-tea', vendor });
    if (vendor?.id !== KUNGFU_TEA.id) {
      errors.push(`${context} kungfu-tea public vendor id must be "${KUNGFU_TEA.id}".`);
    }
    if (vendor?.name !== KUNGFU_TEA.name) {
      errors.push(`${context} kungfu-tea public vendor name must be "${KUNGFU_TEA.name}".`);
    }
    if (vendor?.address !== KUNGFU_TEA.address) {
      errors.push(`${context} kungfu-tea public vendor address must be "${KUNGFU_TEA.address}".`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    categoryCount: categoryFolders.length,
    publicVendorCount: publicVendors.length
  };
};

export const assertValidVendorData = async (options = {}) => {
  const result = await validateVendorData(options);
  if (!result.valid) {
    throw new Error(`Vendor data validation failed:\n${result.errors.map((error) => `- ${error}`).join('\n')}`);
  }
  return result;
};

if (isMainModule()) {
  const result = await validateVendorData();
  if (!result.valid) {
    console.error('Vendor data validation failed:');
    result.errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log(`Vendor data validation passed: ${result.categoryCount} categories, ${result.publicVendorCount} public vendors.`);
  }
}
