# YangmeiLife A2 Vendor Source Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-check every currently published vendor against current public sources, record field-level evidence and media rights, and prevent stale or conflicting records from remaining publicly presented as verified.

**Architecture:** Manually maintained category `vendors.json` files remain the factual source. The validator enforces publication and evidence rules before the existing generator creates runtime assets. Research evidence is stored per category so multiple researchers can work without editing the same report; a final summary consolidates publication decisions.

**Tech Stack:** Static HTML, JSON, Node.js ESM scripts, Node built-in test runner, Cloudflare Pages, Playwright.

## Global Constraints

- The drinks category must contain only `功夫茶楊梅四維店` at `楊梅區四維路 90 號`.
- Do not restore the deleted 33 demo vendors.
- Do not invent names, phone numbers, addresses, ratings, hours, coordinates, image rights, or official sources.
- A missing or conflicting field remains `null`; it must not be inferred from unrelated directories.
- Candidate records must not appear in generated public vendor assets.
- Do not expose engineering notes, source conflicts, review identities, or internal status fields on customer pages.
- Do not change vendor-card layout in A2; that belongs to A3.
- Each approved research batch gets its own commit and GitHub push before the next batch starts.
- A different reviewer must approve factual changes; the researcher cannot approve their own records.

---

## Current Inventory

| Category | Published | Candidates | Remote images |
| --- | ---: | ---: | ---: |
| `beauty-skin` | 3 | 3 | 3 |
| `hair-salon` | 3 | 3 | 3 |
| `nail-service` | 4 | 3 | 4 |
| `kungfu-tea` | 1 | 0 | 1 |
| Other 7 categories | 0 | 21 | 0 |
| **Total** | **11** | **30** | **11** |

All 11 published records were last checked on `2026-07-03`. A2 must refresh facts before changing UI.

## Accepted Evidence

Use sources in this order:

1. Store or brand official website.
2. Store or brand official Facebook, Instagram, LINE, or booking page.
3. Government business registration or other government open data.
4. Google Business Profile / Google Maps listing.
5. Established booking or commerce platform clearly controlled by the store.

Directories, reposts, blogs, scraped databases, search snippets, and AI summaries may locate a source but cannot independently verify a field.

For each field:

- One authoritative official source is sufficient when it clearly identifies the same branch.
- Government registration may verify legal name/address but not current hours, phone, or consumer-facing brand.
- Conflicting phone/address/closure information requires `publicationStatus: "hold"` until reviewed.
- Ratings are not published in A2.
- Coordinates and `placeId` remain `null` unless copied from a traceable map record.
- An official image URL does not prove reuse permission. Record the source and rights state separately.

## Record Contract

Each published or held vendor must add these fields:

```json
{
  "publicationStatus": "published",
  "sourceCheckedAt": "2026-07-27T00:00:00+08:00",
  "nextReviewAt": "2026-10-25",
  "reviewedBy": "A2-researcher",
  "fieldSources": {
    "name": ["https://www.kungfutea.com.tw/location/?page=11"],
    "phone": ["https://www.kungfutea.com.tw/location/?page=11"],
    "address": ["https://www.kungfutea.com.tw/location/?page=11"],
    "businessHours": [],
    "officialUrl": ["https://www.kungfutea.com.tw/location/?page=11"],
    "lineUrl": [],
    "image": ["https://www.kungfutea.com.tw/location/?page=11"]
  },
  "placeId": null,
  "coordinates": {
    "latitude": null,
    "longitude": null
  },
  "media": {
    "rightsStatus": "permission-pending",
    "sourceUrl": "https://www.kungfutea.com.tw/location/?page=11",
    "assetPath": null,
    "permissionEvidence": null,
    "checkedAt": "2026-07-27"
  },
  "merchantConsent": {
    "status": "not-recorded",
    "recordedAt": null,
    "evidence": null
  }
}
```

Allowed values:

- `publicationStatus`: `published`, `hold`, `retired`
- `media.rightsStatus`: `licensed-local`, `official-external`, `permission-pending`, `no-approved-image`
- `merchantConsent.status`: `granted`, `not-required-public-source`, `not-recorded`, `declined`

Only `publicationStatus: "published"` records may enter generated public assets. Published records must be verified, no more than 90 days old, and have field evidence for name, phone, address, and official source.

---

### Task A2.0: Publication Schema and Regression Guards

**Files:**
- Modify: `scripts/validate-vendor-data.mjs`
- Modify: `scripts/build-main-structure.mjs`
- Modify: `tests/validate-vendor-data.test.mjs`
- Create: `tests/vendor-publication.test.mjs`
- Create: `reports/vendor-source-refresh/README.md`

**Interfaces:**
- Consumes: A1 `validateVendorData()` and `assertValidVendorData()`.
- Produces: publication-aware validation and generated output containing only `published` vendors.

- [ ] **Step 1: Write failing publication tests**

Cover these exact cases:

```text
published + verified + fresh + required fieldSources => pass
published + missing phone evidence => fail
published + stale sourceCheckedAt => fail
hold vendor => valid source record but absent from generated public data
retired vendor => absent from generated public data
candidate vendor => absent from generated public data
published Kung Fu Tea with changed name/address or second drinks record => fail
more than 11 published vendors without an approved allow-list change => fail
```

- [ ] **Step 2: Verify the new tests fail**

```bash
node --test tests/vendor-publication.test.mjs
```

Expected: failures for missing publication rules.

- [ ] **Step 3: Implement the record contract**

Update validation so `published` records require the complete evidence contract. Replace the permanent exact-11 rule with a maximum baseline guard: A2 may hold or retire inaccurate records, but may not add a twelfth published vendor or promote candidates without a separately reviewed allow-list change.

- [ ] **Step 4: Filter runtime output**

In `scripts/build-main-structure.mjs`, keep all manually maintained source records available to validation, but pass only `publicationStatus === "published"` records to:

```text
data/vendors/vendor-categories.json
data/vendors/vendor-summary.json
assets/js/vendor-data.js
vendor page generation
```

- [ ] **Step 5: Run A1 and A2 regression tests**

```bash
node --check scripts/validate-vendor-data.mjs
node --check scripts/build-main-structure.mjs
node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs
node scripts/validate-vendor-data.mjs
```

- [ ] **Step 6: Commit and push**

```bash
git add scripts tests reports/vendor-source-refresh/README.md
git commit -m "Add vendor publication evidence rules"
git push origin agent/current-site-baseline
```

Reviewer gate: no Important/Critical finding before factual refresh begins.

### Task A2.1: Kung Fu Tea and Beauty Source Refresh

**Files:**
- Modify: `data/vendors/categories/kungfu-tea/vendors.json`
- Modify: `data/vendors/categories/beauty-skin/vendors.json`
- Modify: corresponding `README.md`
- Generated: corresponding `updates.json`
- Create: `reports/vendor-source-refresh/2026-07-27/kungfu-tea.md`
- Create: `reports/vendor-source-refresh/2026-07-27/beauty-skin.md`

**Interfaces:**
- Consumes: A2.0 record contract.
- Produces: evidence packets and publication decisions for 4 records.

- [ ] **Step 1: Capture pre-refresh values**

Record the current name, phone, address, URLs, image, and `2026-07-03` verification date in each evidence packet.

- [ ] **Step 2: Check official sources live**

Check every URL, branch identity, phone, address, official/LINE link, closure or relocation indicators, and image source. Record HTTP/access failures rather than replacing facts from search snippets.

- [ ] **Step 3: Apply field-level decisions**

Use `published` only when required fields agree. Use `hold` for conflicts or unavailable branch identity. Keep business hours and coordinates `null` unless directly supported.

- [ ] **Step 4: Enforce the drinks restriction**

Assert the drinks source and generated output contain exactly:

```text
功夫茶楊梅四維店
楊梅區四維路 90 號
```

- [ ] **Step 5: Validate, review, commit, and push**

```bash
node scripts/validate-vendor-data.mjs
node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs
git add data/vendors/categories/kungfu-tea data/vendors/categories/beauty-skin reports/vendor-source-refresh/2026-07-27
git commit -m "Refresh Kung Fu Tea and beauty vendor sources"
git push origin agent/current-site-baseline
```

### Task A2.2: Hair Salon Source Refresh

**Files:**
- Modify: `data/vendors/categories/hair-salon/vendors.json`
- Modify: `data/vendors/categories/hair-salon/README.md`
- Generated: `data/vendors/categories/hair-salon/updates.json`
- Create: `reports/vendor-source-refresh/2026-07-27/hair-salon.md`

**Interfaces:**
- Consumes: A2.0 record contract.
- Produces: evidence and publication decisions for 3 hair-salon records.

- [ ] **Step 1: Research each branch independently**

Do not treat similarly named salons as the same business. Match branch name, address, phone, and social identity.

- [ ] **Step 2: Record conflicts and decisions**

The report must show old value, new observed value, source, checked time, and final decision for every changed field.

- [ ] **Step 3: Validate, independently review, commit, and push**

```bash
node scripts/validate-vendor-data.mjs
node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs
git add data/vendors/categories/hair-salon reports/vendor-source-refresh/2026-07-27/hair-salon.md
git commit -m "Refresh hair salon vendor sources"
git push origin agent/current-site-baseline
```

### Task A2.3: Nail Service Source Refresh

**Files:**
- Modify: `data/vendors/categories/nail-service/vendors.json`
- Modify: `data/vendors/categories/nail-service/README.md`
- Generated: `data/vendors/categories/nail-service/updates.json`
- Create: `reports/vendor-source-refresh/2026-07-27/nail-service.md`

**Interfaces:**
- Consumes: A2.0 record contract.
- Produces: evidence and publication decisions for 4 nail-service records.

- [ ] **Step 1: Verify the exact branch identity**

Pay particular attention to stores with branch names such as `四維店`; do not merge records across branches.

- [ ] **Step 2: Verify contact actions**

Check that phone values can form a valid `tel:` target and addresses produce a Google Maps navigation URL. A shared platform LINE must not be represented as a store LINE.

- [ ] **Step 3: Validate, independently review, commit, and push**

```bash
node scripts/validate-vendor-data.mjs
node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs
git add data/vendors/categories/nail-service reports/vendor-source-refresh/2026-07-27/nail-service.md
git commit -m "Refresh nail service vendor sources"
git push origin agent/current-site-baseline
```

### Task A2.4: Candidate Triage Without Publication

**Files:**
- Modify: `data/vendors/categories/*/vendors.json`
- Create: `reports/vendor-source-refresh/2026-07-27/candidate-triage.md`

**Interfaces:**
- Consumes: 30 existing candidate records.
- Produces: candidate disposition only; no new public vendors.

- [ ] **Step 1: Classify each candidate**

Use exactly one internal disposition:

```text
source-found
identity-conflict
possibly-closed
duplicate
no-authoritative-source
out-of-area
```

- [ ] **Step 2: Preserve the publication boundary**

Do not move candidates into `vendors[]` during A2. Record promising candidates for a separately approved expansion batch.

- [ ] **Step 3: Verify the publication regression test excludes candidates**

```bash
node --test tests/vendor-publication.test.mjs
```

Expected: candidate-exclusion integration test passes.

- [ ] **Step 4: Review, commit, and push**

```bash
git add data/vendors/categories reports/vendor-source-refresh/2026-07-27/candidate-triage.md
git commit -m "Triage unpublished vendor candidates"
git push origin agent/current-site-baseline
```

### Task A2.5: Media Rights and Local Asset Plan

**Files:**
- Modify: 11 published/held vendor records in `data/vendors/categories/*/vendors.json`
- Create: `reports/vendor-media-rights-2026-07-27.md`
- Create only when reuse is confirmed: `assets/images/vendors/<vendor-id>/cover.<ext>`

**Interfaces:**
- Consumes: source-refresh evidence.
- Produces: media rights decision for every current vendor image.

- [ ] **Step 1: Audit all 11 remote images**

For each image, record source URL, owner, current availability, reuse evidence, and whether hotlinking is technically and legally acceptable.

- [ ] **Step 2: Localize only approved images**

Download an image only when `media.rightsStatus` can be set to `licensed-local` with evidence. Otherwise keep `assetPath: null`; A3 will provide a neutral fallback.

- [ ] **Step 3: Check asset integrity**

```bash
find assets/images/vendors -type f -maxdepth 3 2>/dev/null
node scripts/validate-vendor-data.mjs
```

- [ ] **Step 4: Review, commit, and push**

```bash
git add data/vendors/categories reports/vendor-media-rights-2026-07-27.md
test ! -d assets/images/vendors || git add assets/images/vendors
git commit -m "Record vendor media rights"
git push origin agent/current-site-baseline
```

### Task A2.6: Consolidated Report and Release Gate

**Files:**
- Create: `reports/vendor-source-refresh-2026-07-27.md`
- Modify: `docs/superpowers/plans/2026-07-26-yangmeilife-execution-status.md`

**Interfaces:**
- Consumes: all A2 category evidence, reviewer results, tests, and media audit.
- Produces: approved A2 handoff to A3.

- [ ] **Step 1: Build the final decision table**

Include all 11 baseline records and 30 candidates with:

```text
category
vendor ID/name
publication decision
checked sources
changed fields
missing/conflicting fields
image rights state
sourceCheckedAt
nextReviewAt
reviewer verdict
```

- [ ] **Step 2: Run the full data gate**

```bash
node --check scripts/build-main-structure.mjs
node --check scripts/validate-vendor-data.mjs
node scripts/validate-vendor-data.mjs
node --test tests/validate-vendor-data.test.mjs tests/vendor-publication.test.mjs
BUILD_TIMESTAMP=2026-07-27T00:00:00.000Z node scripts/build-main-structure.mjs
node scripts/validate-vendor-data.mjs
git diff --check
```

- [ ] **Step 3: Run public behavior checks**

Verify:

```text
No unverified rating is displayed.
Every visible phone action uses tel:.
Every visible address opens Google Maps navigation.
Missing store LINE/official URL produces no misleading platform contact action.
No candidate or hold/retired record appears in public runtime data.
```

- [ ] **Step 4: Independent review**

Require:

```text
Research review: source quality and identity match
Data review: schema, publication filter, generated output
QA review: phone/navigation/image behavior
Final verdict: no unresolved Critical or Important finding
```

- [ ] **Step 5: Commit and push the A2 closeout**

```bash
git status --short
git add assets/js data pages reports/main-structure.md reports/vendor-source-refresh-2026-07-27.md docs/superpowers/plans/2026-07-26-yangmeilife-execution-status.md
git commit -m "Complete A2 vendor source refresh"
git push origin agent/current-site-baseline
gh pr checks 1
```

## Rollback Points

Keep the existing pre-redesign tag:

```text
baseline-2026-07-27-before-redesign
```

Each A2 task is a separate commit. Do not squash A2 while research is under review. If a batch is rejected, revert only that batch commit and preserve earlier approved evidence.

## A2 Completion Criteria

- Every baseline vendor has a current evidence packet and explicit publication decision.
- Every published field is traceable to an accepted source.
- Stale, conflicting, closed, or mismatched records are held or retired instead of being presented as verified.
- The drinks category still contains only the specified Kung Fu Tea branch.
- All 30 candidates remain outside public runtime output.
- All 11 current remote images have a documented rights decision.
- Validator, generator, tests, independent review, and Cloudflare check pass.
- A2 summary is committed and pushed before A3 vendor-card UI work begins.
