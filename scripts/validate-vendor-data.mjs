import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_CATEGORY_SLUGS = [
  'american-chiropractic',
  'beauty-skin',
  'eyelash-service',
  'food-truck',
  'hair-salon',
  'kungfu-tea',
  'nail-service',
  'rental-management',
  'taiwanese-massage',
  'thai-massage',
  'vietnamese-massage'
];
const CATEGORY_COUNT = REQUIRED_CATEGORY_SLUGS.length;
const PUBLIC_VENDOR_COUNT = 11;
const MAX_VERIFICATION_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const VENDOR_SOURCE_ROOT = 'data/vendors/categories';
const PUBLICATION_STATUSES = new Set(['published', 'hold', 'retired']);
const MEDIA_RIGHTS_STATUSES = new Set(['licensed-local', 'official-external', 'permission-pending', 'no-approved-image']);
const MERCHANT_CONSENT_STATUSES = new Set(['granted', 'not-required-public-source', 'not-recorded', 'declined']);
const CANDIDATE_DISPOSITIONS = new Set([
  'source-found',
  'identity-conflict',
  'possibly-closed',
  'duplicate',
  'no-authoritative-source',
  'out-of-area'
]);
const CANDIDATE_TRIAGED_AT = '2026-07-27';
const CANDIDATE_TRIAGED_BY = 'A2.4 candidate triage';
const CANDIDATE_NAME_STATUS = 'legacy-demo-label';
const CANDIDATE_UNSUPPORTED_FIELDS = [
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
const REQUIRED_FIELD_SOURCES = ['name', 'phone', 'address', 'businessHours', 'officialUrl', 'lineUrl', 'image'];
const REQUIRED_PUBLISHED_EVIDENCE = new Set(['name', 'phone', 'address', 'officialUrl']);
const KUNGFU_TEA = {
  id: 'kungfu-tea-1',
  name: '功夫茶楊梅四維店',
  address: '楊梅區四維路 90 號'
};

const isPresent = (value) => typeof value === 'string' && value.trim().length > 0;
const isNullableString = (value) => value === null || typeof value === 'string';
const hasOwn = (value, key) => value !== null && typeof value === 'object' && Object.hasOwn(value, key);
const isHttpUrl = (value) => {
  if (!isPresent(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
const isIsoDateTimeWithTimezone = (value) => isPresent(value)
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && !Number.isNaN(Date.parse(value));

const taipeiCalendarDate = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${valueByType.year}-${valueByType.month}-${valueByType.day}`;
};

const formatContext = ({ file, slug, vendor }) => {
  const parts = [`file=${file}`, `category=${slug}`];
  if (vendor) parts.push(`vendor=${vendor.id || vendor.name || 'unknown'}`);
  return `[${parts.join('] [')}]`;
};

const isValidCalendarDate = (value) => {
  if (!isPresent(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const addTaipeiCalendarDays = (value, days) => {
  if (!isValidCalendarDate(value)) return null;
  const date = new Date(`${value}T00:00:00+08:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return taipeiCalendarDate(date);
};

const validateCandidateContract = ({ candidate, context, index, relativeFile, errors }) => {
  if (!CANDIDATE_DISPOSITIONS.has(candidate?.candidateDisposition)) {
    errors.push(`${context} Candidate record at candidateVendors[${index}] candidateDisposition must be one of: ${[...CANDIDATE_DISPOSITIONS].join(', ')}.`);
  }

  if (candidate?.triagedAt !== CANDIDATE_TRIAGED_AT) {
    errors.push(`${context} Candidate triagedAt must be ${CANDIDATE_TRIAGED_AT}.`);
  }
  if (candidate?.triagedBy !== CANDIDATE_TRIAGED_BY) {
    errors.push(`${context} Candidate triagedBy must be "${CANDIDATE_TRIAGED_BY}".`);
  }
  if (candidate?.candidateNameStatus !== CANDIDATE_NAME_STATUS) {
    errors.push(`${context} Candidate candidateNameStatus must be "${CANDIDATE_NAME_STATUS}".`);
  }
  if (candidate?.verified === true) {
    errors.push(`${context} Candidate record at candidateVendors[${index}] must not have verified: true.`);
  }
  if (candidate?.verified !== false) {
    errors.push(`${context} Candidate verified must be false.`);
  }
  if (candidate?.needsVerification !== true) {
    errors.push(`${context} Candidate needsVerification must be true.`);
  }
  if (candidate?.removedFromFrontend !== true) {
    errors.push(`${context} Candidate removedFromFrontend must be true.`);
  }
  if (candidate?.publicationStatus === 'published') {
    errors.push(`${context} Candidate publicationStatus must not be "published".`);
  }

  for (const field of ['id', 'name', 'area', 'removalReason', 'removedAt']) {
    if (!isPresent(candidate?.[field])) {
      errors.push(`${context} Candidate requires retained ${field}.`);
    }
  }
  if (candidate?.dataSource !== relativeFile) {
    errors.push(`${context} Candidate dataSource must be "${relativeFile}".`);
  }
  if (!isIsoDateTimeWithTimezone(candidate?.updatedAt)
    || !candidate.updatedAt.endsWith('+08:00')
    || taipeiCalendarDate(new Date(candidate.updatedAt)) !== CANDIDATE_TRIAGED_AT) {
    errors.push(`${context} Candidate updatedAt must be an A2.4 ISO datetime on ${CANDIDATE_TRIAGED_AT} with +08:00 timezone.`);
  }

  if (candidate?.candidateDisposition !== 'no-authoritative-source') return;

  if (candidate?.dataReadiness !== 'internal-candidate') {
    errors.push(`${context} Candidate no-authoritative-source dataReadiness must be "internal-candidate".`);
  }
  if (candidate?.verificationLevel !== 'needs_contact') {
    errors.push(`${context} Candidate no-authoritative-source verificationLevel must be "needs_contact".`);
  }
  if (!isPresent(candidate?.sourceNote)
    || !/legacy demo label.*retained only for audit.*not a verified business listing/i.test(candidate.sourceNote)) {
    errors.push(`${context} Candidate no-authoritative-source sourceNote must retain the legacy demo audit decision.`);
  }
  for (const field of CANDIDATE_UNSUPPORTED_FIELDS) {
    if (candidate?.[field] !== null) {
      errors.push(`${context} Candidate no-authoritative-source ${field} must be null.`);
    }
  }
  if (!Array.isArray(candidate?.tags) || candidate.tags.length !== 0) {
    errors.push(`${context} Candidate no-authoritative-source tags must be an empty array.`);
  }
  if (!Array.isArray(candidate?.sourceUrls) || candidate.sourceUrls.length !== 0) {
    errors.push(`${context} Candidate no-authoritative-source sourceUrls must be an empty array.`);
  }
  if (candidate?.officialSource !== null) {
    errors.push(`${context} Candidate no-authoritative-source officialSource must be null.`);
  }
  if (candidate?.lastVerifiedAt !== null) {
    errors.push(`${context} Candidate no-authoritative-source lastVerifiedAt must be null.`);
  }
};

const validatePublishedContract = ({ vendor, context, currentTaipeiDate, currentTaipeiDateMs, errors }) => {
  if (vendor?.verified !== true) {
    errors.push(`${context} Published vendor requires verified: true.`);
  }

  if (!isIsoDateTimeWithTimezone(vendor?.sourceCheckedAt)) {
    errors.push(`${context} Published vendor sourceCheckedAt must be an ISO datetime with timezone.`);
  } else {
    const sourceCheckedDate = taipeiCalendarDate(new Date(vendor.sourceCheckedAt));
    const sourceCheckedAtMs = Date.parse(sourceCheckedDate);
    if (sourceCheckedDate > currentTaipeiDate) {
      errors.push(`${context} Published vendor sourceCheckedAt must not be in the future.`);
    } else if (currentTaipeiDateMs - sourceCheckedAtMs > MAX_VERIFICATION_AGE_MS) {
      errors.push(`${context} Published vendor sourceCheckedAt is older than 90 days.`);
    }
  }

  if (!isValidCalendarDate(vendor?.nextReviewAt)) {
    errors.push(`${context} Published vendor nextReviewAt must be a valid ISO date (YYYY-MM-DD).`);
  } else if (vendor.nextReviewAt < currentTaipeiDate) {
    errors.push(`${context} Published vendor nextReviewAt must not be before the current Taipei calendar date.`);
  } else {
    const expectedNextReviewAt = addTaipeiCalendarDays(vendor.lastVerifiedAt, 90);
    if (expectedNextReviewAt && vendor.nextReviewAt !== expectedNextReviewAt) {
      errors.push(`${context} Published vendor nextReviewAt must be exactly 90 calendar days after lastVerifiedAt (${expectedNextReviewAt}).`);
    }
  }

  if (!isPresent(vendor?.reviewedBy)) {
    errors.push(`${context} Published vendor requires a non-empty reviewedBy role.`);
  }

  if (vendor?.fieldSources === null || typeof vendor?.fieldSources !== 'object' || Array.isArray(vendor.fieldSources)) {
    errors.push(`${context} Published vendor requires fieldSources object.`);
  } else {
    const allowedSources = new Set([
      ...(Array.isArray(vendor.sourceUrls) ? vendor.sourceUrls : []),
      vendor.officialUrl,
      vendor.imageSourceUrl,
      vendor.lineUrl
    ].filter(isPresent));

    for (const field of REQUIRED_FIELD_SOURCES) {
      const sources = vendor.fieldSources[field];
      if (!Array.isArray(sources)) {
        errors.push(`${context} Published vendor fieldSources.${field} must be an array of non-empty source URLs.`);
        continue;
      }
      if (!sources.every(isPresent)) {
        errors.push(`${context} Published vendor fieldSources.${field} must be an array of non-empty source URLs.`);
      }
      if (REQUIRED_PUBLISHED_EVIDENCE.has(field) && sources.length === 0) {
        errors.push(`${context} Published vendor fieldSources.${field} must be non-empty.`);
      }
      for (const source of sources) {
        if (!isHttpUrl(source)) {
          errors.push(`${context} Published vendor fieldSources.${field} entries must be valid http(s) URLs.`);
        } else if (!allowedSources.has(source)) {
          errors.push(`${context} Published vendor fieldSources.${field} entries must be traceable to sourceUrls, officialUrl, imageSourceUrl, or lineUrl.`);
        }
      }
    }
  }

  if (!(vendor?.placeId === null || isPresent(vendor?.placeId))) {
    errors.push(`${context} Published vendor placeId must be a string or null.`);
  }

  const coordinates = vendor?.coordinates;
  if (coordinates === null || typeof coordinates !== 'object' || Array.isArray(coordinates)
    || !hasOwn(coordinates, 'latitude') || !hasOwn(coordinates, 'longitude')
    || !(coordinates.latitude === null || typeof coordinates.latitude === 'number')
    || !(coordinates.longitude === null || typeof coordinates.longitude === 'number')) {
    errors.push(`${context} Published vendor coordinates must provide latitude and longitude as numbers or null.`);
  }

  const media = vendor?.media;
  if (media === null || typeof media !== 'object' || Array.isArray(media)
    || !['rightsStatus', 'sourceUrl', 'assetPath', 'permissionEvidence', 'checkedAt'].every((field) => hasOwn(media, field))) {
    errors.push(`${context} Published vendor requires complete media metadata.`);
  } else {
    if (!MEDIA_RIGHTS_STATUSES.has(media.rightsStatus)) {
      errors.push(`${context} Published vendor media.rightsStatus is invalid.`);
    }
    for (const field of ['sourceUrl', 'assetPath', 'permissionEvidence']) {
      if (!isNullableString(media[field])) {
        errors.push(`${context} Published vendor media.${field} must be a string or null.`);
      }
    }
    if (!isIsoDateTimeWithTimezone(media.checkedAt)) {
      errors.push(`${context} Published vendor media.checkedAt must be an ISO datetime with timezone.`);
    }
  }

  const merchantConsent = vendor?.merchantConsent;
  if (merchantConsent === null || typeof merchantConsent !== 'object' || Array.isArray(merchantConsent)
    || !['status', 'recordedAt', 'evidence'].every((field) => hasOwn(merchantConsent, field))) {
    errors.push(`${context} Published vendor requires complete merchantConsent metadata.`);
  } else {
    if (!MERCHANT_CONSENT_STATUSES.has(merchantConsent.status)) {
      errors.push(`${context} Published vendor merchantConsent.status is invalid.`);
    }
    if (!(merchantConsent.recordedAt === null || isIsoDateTimeWithTimezone(merchantConsent.recordedAt))) {
      errors.push(`${context} Published vendor merchantConsent.recordedAt must be an ISO datetime with timezone or null.`);
    }
    if (!isNullableString(merchantConsent.evidence)) {
      errors.push(`${context} Published vendor merchantConsent.evidence must be a string or null.`);
    }
  }
};

const isMainModule = () => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export const validateVendorData = async ({ root = process.cwd(), now = new Date() } = {}) => {
  const errors = [];
  const sourceRoot = path.join(root, VENDOR_SOURCE_ROOT);
  const currentTaipeiDate = taipeiCalendarDate(now);
  const currentTaipeiDateMs = Date.parse(currentTaipeiDate);
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

  const missingCategoryFolders = REQUIRED_CATEGORY_SLUGS.filter((slug) => !categoryFolders.includes(slug));
  const unexpectedCategoryFolders = categoryFolders.filter((slug) => !REQUIRED_CATEGORY_SLUGS.includes(slug));
  if (missingCategoryFolders.length > 0) {
    errors.push(`[file=${VENDOR_SOURCE_ROOT}] Missing required vendor category source folders: ${missingCategoryFolders.join(', ')}.`);
  }
  if (unexpectedCategoryFolders.length > 0) {
    errors.push(`[file=${VENDOR_SOURCE_ROOT}] Unexpected vendor category source folders: ${unexpectedCategoryFolders.join(', ')}.`);
  }

  const publishedVendors = [];
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
        validateCandidateContract({
          candidate,
          context: formatContext({ file: relativeFile, slug, vendor: candidate }),
          index,
          relativeFile,
          errors
        });
      });
    }

    source.vendors.forEach((vendor, index) => {
      const context = formatContext({ file: relativeFile, slug, vendor });

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

      if (!PUBLICATION_STATUSES.has(vendor?.publicationStatus)) {
        errors.push(`${context} Vendor publicationStatus must be published, hold, or retired.`);
        return;
      }

      if (vendor.publicationStatus !== 'published') return;
      publishedVendors.push({ vendor, slug, relativeFile });
      validatePublishedContract({ vendor, context, currentTaipeiDate, currentTaipeiDateMs, errors });

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
        const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(vendor.lastVerifiedAt)
          && !Number.isNaN(lastVerifiedAt)
          && new Date(lastVerifiedAt).toISOString().slice(0, 10) === vendor.lastVerifiedAt;
        if (!isIsoDate) {
          errors.push(`${context} Verified vendor lastVerifiedAt must be a valid ISO date (YYYY-MM-DD).`);
        } else if (vendor.lastVerifiedAt > currentTaipeiDate) {
          errors.push(`${context} Verified vendor lastVerifiedAt must not be in the future.`);
        } else if (currentTaipeiDateMs - lastVerifiedAt > MAX_VERIFICATION_AGE_MS) {
          errors.push(`${context} Verified vendor lastVerifiedAt is older than 90 days.`);
        }
      }
    });
  }

  if (publishedVendors.length > PUBLIC_VENDOR_COUNT) {
    errors.push(`[file=${VENDOR_SOURCE_ROOT}] Expected at most ${PUBLIC_VENDOR_COUNT} published vendors across all vendors[] arrays; found ${publishedVendors.length}.`);
  }

  const kungfuTea = sourceBySlug.get('kungfu-tea');
  const kungfuTeaFile = `${VENDOR_SOURCE_ROOT}/kungfu-tea/vendors.json`;
  if (!kungfuTea) {
    errors.push(`[file=${kungfuTeaFile}] Missing required kungfu-tea category source folder.`);
  } else if (!Array.isArray(kungfuTea.vendors)) {
    errors.push(`${formatContext({ file: kungfuTeaFile, slug: 'kungfu-tea' })} Public vendors must be an array in vendors[].`);
  } else {
    if (kungfuTea.vendors.length !== 1) {
      errors.push(`${formatContext({ file: kungfuTeaFile, slug: 'kungfu-tea' })} kungfu-tea must contain exactly one public vendor source record; found ${kungfuTea.vendors.length}.`);
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
    publicVendorCount: publishedVendors.length
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
