# Homepage Thumbnail Check

Date: 2026-07-03

## Result

Homepage thumbnails were checked on mobile and desktop with a real browser.

Initial finding:

- Functional card thumbnails loaded correctly.
- Media gallery thumbnails loaded, but rendered at `0px` height because `aspect-[3/4]` is not available in the local Tailwind build.
- The main media display also depended on the unsupported arbitrary aspect utility and became too tall on desktop after adding fallback aspect rules.

Fix:

- Added native CSS sizing in `assets/js/homepage-thumbnails.js`.
- Added `.media-thumb-frame` with `aspect-ratio: 3/4`.
- Added a responsive fixed height for `#mainMediaDisplay`:
  - Mobile: `16rem`
  - Desktop: `clamp(16rem, 42vw, 30rem)`

## Verification

- `node --check assets/js/homepage-thumbnails.js`
- Browser image request failures: 0
- Browser image 4xx/5xx responses: 0
- Broken images: 0
- Home function thumbnails: 40 / 40 loaded
- Mobile media thumbnails: 4 / 4 visible at `164x219`
- Desktop media thumbnails: 4 / 4 visible at `297x395`
- Mobile main media frame: `341x256`
- Desktop main media frame: `1222x480`

## Screenshots

- `output/playwright/homepage-thumbnail-check-mobile390-top.png`
- `output/playwright/homepage-thumbnail-check-mobile390-media.png`
- `output/playwright/homepage-thumbnail-check-desktop1440-top.png`
- `output/playwright/homepage-thumbnail-check-desktop1440-media.png`
