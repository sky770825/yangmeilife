# Task A2.0 Report: Publication Schema and Regression Guards

## Status

Implemented and verified.

## RED Test Evidence

Before production edits, `node --test tests/vendor-publication.test.mjs` completed with 3 passing and 5 failing tests. The expected failures showed that the previous validator accepted missing `fieldSources.phone` and stale `sourceCheckedAt`, the builder emitted `hold` and `retired` records to runtime data, and the published-vendor count error still used the former public-record wording.

## Changed Files

- `scripts/validate-vendor-data.mjs`
- `scripts/build-main-structure.mjs`
- `tests/vendor-publication.test.mjs`
- `data/vendors/categories/beauty-skin/vendors.json`
- `data/vendors/categories/hair-salon/vendors.json`
- `data/vendors/categories/nail-service/vendors.json`
- `data/vendors/categories/kungfu-tea/vendors.json`
- `data/vendors/vendor-categories.json`
- `assets/js/vendor-data.js`
- `reports/vendor-source-refresh/README.md`

## Schema Decisions

- `vendors[]` source records require `publicationStatus` of `published`, `hold`, or `retired`.
- Published records require current verification, source-checking evidence, the complete publication contract, and non-empty evidence for name, phone, address, and official URL.
- Source-check and review dates use the Asia/Taipei calendar policy. The 11 migrated records retain their original 2026-07-03 verification times with explicit `+08:00` offsets and use `2026-10-01` for their next review date.
- Field-source arrays use only existing `sourceUrls`, `officialUrl`, `imageSourceUrl`, and `lineUrl`. No URLs or vendor facts were added.
- All migrated media remain `permission-pending`; merchant consent remains `not-recorded`; `placeId` and coordinates remain null.
- The builder retains source `vendors[]` records, but emits only `publicationStatus: "published"` records to `vendor-categories.json`, `vendor-summary.json`, browser vendor data, and vendor page runtime behavior.

## Commands and Results

- `node --check scripts/validate-vendor-data.mjs` - passed.
- `node --check scripts/build-main-structure.mjs` - passed.
- `node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs` - passed: 18 tests, 0 failures.
- `node scripts/validate-vendor-data.mjs` - passed: 11 categories, 11 public vendors.
- `node scripts/build-main-structure.mjs` - passed: 11 vendor records emitted.
- `git diff --check` - passed.

## Self-Review

- Confirmed all 11 emitted runtime vendors have `publicationStatus: "published"`.
- Confirmed browser runtime vendor data exactly matches `vendor-categories.json`.
- Confirmed `vendor-summary.json` reports 11 vendors.
- Confirmed source facts for all four migrated files are unchanged after removing the newly added publication fields.

## Concerns

- Media reuse permission and merchant-consent evidence remain pending/not recorded by design; this migration does not invent evidence.

## Commit SHA

Implementation commit: `e47df53094a29b1628c4fd985d7e9c16e40b45df` (`Add vendor publication evidence rules`).
