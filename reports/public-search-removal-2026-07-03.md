# Public Search Removal

Date: 2026-07-03

## Decision

`search.html` was a public static page, not a backend or authenticated admin surface. It should not be shown to regular users while the experience is still too basic.

## Changes

- Removed the homepage hero search box from `index.html`.
- Changed residual homepage search actions to send users to `pages/index.html`.
- Removed the public search nav link from the generated category overview.
- Excluded internal categories `site-core` and `vendors-admin` from the public category overview.
- Restricted `assets/js/site-search-data.js` to public consumer/service functions only.
- Changed root `search.html` into a noindex redirect to `pages/index.html`.

## Verification

- `node --check scripts/build-main-structure.mjs`
- `node scripts/build-main-structure.mjs`
- `node --check assets/js/site-search.js`
- `node --check assets/js/service-page.js`
- `node --check assets/js/service-page-data.js`

Browser checks at `127.0.0.1:8044`:

- Homepage `#mainSearchInput`: 0
- Homepage links/buttons to `search.html`: 0
- Public category links to `search.html`: 0
- Public category text `網站核心與導覽`: 0
- Public category text `店家合作與資料管理`: 0
- Public category card count: 9
- Opening `/search.html` redirects to `/pages/index.html`

## Screenshots

- `output/playwright/public-no-search-home-mobile390.png`
- `output/playwright/public-no-search-categories-mobile390.png`
- `output/playwright/public-no-search-categories-desktop1440.png`
