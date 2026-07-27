# Vendor Source Refresh

This folder records source-governance changes for YangmeiLife vendor records.

- Source records remain in `data/vendors/categories/<slug>/vendors.json`.
- Only records with `publicationStatus: "published"` are emitted to public runtime data.
- `hold`, `retired`, and `candidateVendors` records remain source material and are excluded from public runtime output.
- Publication evidence must be validated with `node scripts/validate-vendor-data.mjs` before building runtime assets.
