# Generated Entry Page Compact UI Fix

Date: 2026-07-03

## Scope

- Tightened generated category overview cards, category function cards, search result cards, and formal service cards.
- Added shared compact utilities in `scripts/build-main-structure.mjs` so regenerated pages keep the same UI rules.
- Fixed search result cards that previously rendered without the shared card background/border.
- Fixed missing desktop 3-column behavior caused by unavailable `xl:grid-cols-3` utilities in the local Tailwind build.
- Fixed the search page desktop form from stacked full-width rows into a compact input / filter / button row.
- Kept mobile layouts single-column with 44px touch targets and no horizontal overflow.

## Files Updated

- `scripts/build-main-structure.mjs`
- `assets/js/site-search.js`
- `assets/js/service-page.js`
- Generated root function pages and `pages/**/index.html` / `pages/**/updates.html`

## Verification

Syntax checks:

- `node --check scripts/build-main-structure.mjs`
- `node --check assets/js/service-page.js`
- `node --check assets/js/site-search.js`
- `node --check assets/js/service-page-data.js`

Generator:

- `node scripts/build-main-structure.mjs`
- Output: 11 categories, 65 functions, 11 vendor categories, 11 vendor records.

DOM layout checks:

- `/pages/index.html` at 375x900: horizontal overflow 0
- `/search.html` at 375x900: horizontal overflow 0
- `/dashboard.html` at 375x900: horizontal overflow 0
- `/pages/index.html` at 1440x1000: category grid 3 columns
- `/dashboard.html` at 1440x1000: service grid 3 columns
- `/search.html` at 1440x1000: search form 3 columns

## Screenshots

- `output/playwright/entry-compact-categories-mobile375.png`
- `output/playwright/entry-compact-categories-desktop1440.png`
- `output/playwright/entry-compact-search-mobile375.png`
- `output/playwright/entry-compact-search-desktop1440.png`
- `output/playwright/entry-compact-service-mobile375.png`
- `output/playwright/entry-compact-service-desktop1440.png`
