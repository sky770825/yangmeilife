# A3 Vendor Card Responsive QA - 2026-07-27

## Result

A3 is approved for the 11 public vendor category pages. The implementation
keeps reviewed A2 data unchanged and replaces the previous card layout with a
compact, responsive directory UI.

- Public vendors: 11
- Candidate/hold/retired records shown: 0
- Media: 4 reviewed official external images, 7 neutral non-photographic fallbacks
- Full tests: 115/115 passed
- Validator: 11 categories, 11 public vendors
- Console errors, page errors, unexpected request failures: 0
- Horizontal overflow in required captures: 0
- Minimum action target: 44px

## Behavior

- Mobile uses one card column.
- Tablet gallery uses two columns.
- Wide desktop gallery uses up to three columns.
- The single Kung Fu Tea card stays centered at a maximum width of 620px.
- Phone, Google Maps, store LINE/official, and favorite are the only card actions.
- Unsupported rating and price sorting are absent.
- Missing images and failed remote images use the same accessible store-icon
  fallback without a secondary network request or inline event handler.
- The store-join action and category count use explicit responsive CSS instead
  of unavailable Tailwind utility classes.

## Evidence

| Page | Viewport | Columns | Evidence |
| --- | --- | --- | --- |
| Kung Fu Tea | 390x844 | 1 | `reports/screenshots/a3-2026-07-27/kungfu-tea-390x844.png` |
| Kung Fu Tea | 768x1024 | Single-store centered | `reports/screenshots/a3-2026-07-27/kungfu-tea-768x1024.png` |
| Kung Fu Tea | 1440x1000 | Single-store centered | `reports/screenshots/a3-2026-07-27/kungfu-tea-1440x1000.png` |
| Beauty and skin | 390x844 | 1 | `reports/screenshots/a3-2026-07-27/beauty-skin-390x844.png` |
| Beauty and skin | 1440x1000 | 3 | `reports/screenshots/a3-2026-07-27/beauty-skin-1440x1000.png` |
| Nail service | 390x844 | 1 | `reports/screenshots/a3-2026-07-27/nail-service-390x844.png` |
| Nail service | 1440x1000 | 3 | `reports/screenshots/a3-2026-07-27/nail-service-1440x1000.png` |

The final evidence was captured in a fresh browser session after fonts loaded
and two animation frames completed. The replacement captures contain no clipped
or partially painted navigation/header text.

## Review

- UI Quality: Pass
- Accessibility: Pass
- Spec Compliance: Pass
- Code Quality: Pass
- Browser QA: Pass
- Final finding state: no unresolved Critical, Important, or Moderate finding

## Remaining Boundary

The four official external images remain remote dependencies, and official
origin does not mean reuse or hotlink permission. The seven neutral fallbacks
must not be replaced with photography without separate rights evidence.
