# A3 Vendor Card and Responsive UI Refresh

**Date:** 2026-07-27  
**Depends on:** approved A2 vendor source refresh at `3e8958d`

## Goal

Make all 11 public vendor category pages compact, trustworthy, and usable at
390px, 768px, and 1440px without changing reviewed vendor facts or introducing
unlicensed store imagery.

## Source of Truth

- Edit `scripts/build-main-structure.mjs`.
- Regenerate `assets/js/vendor-page.js` and the 11 root vendor pages.
- Do not hand-maintain generated UI separately from the generator.
- Preserve the A2 publication, contact, media-rights, and single-store rules.

## A3.1 Card Structure

- Use one consumer-facing hierarchy: store name, short area/category, at most
  three verified tags, and direct actions.
- Keep phone, Google Maps, store LINE/official link, and favorite behavior.
- Remove the duplicate large inquiry row. Use compact icon-led actions with
  accessible labels, tooltips, and at least 44px touch targets.
- Allow long names and addresses to wrap without horizontal overflow.

## A3.2 Media Behavior

- Use a stable 2:1 media ratio without stretching.
- For approved remote store images, use `object-fit: cover`, dimensions, lazy
  loading, and a neutral local-rendered fallback if loading fails.
- For `no-approved-image`, render the same neutral fallback directly. Do not
  download, generate, or imply a real storefront photo.
- Keep the fallback visually quiet and clearly non-photographic.

## A3.3 Responsive Layout

- 390px: one-column cards and controls; no horizontal scroll.
- 768px: two-column gallery; compact controls remain touch-friendly.
- 1440px: maximum three-column gallery; compact mode may use two horizontal
  cards.
- A category with one store remains centered at a moderate width.
- Replace unsupported arbitrary Tailwind grid classes with explicit generated
  CSS so the toolbar has one search field plus compact sort/view controls on
  desktop.
- Avoid equal-height stretching that creates empty card interiors.

## A3.4 Verification

- Add generated-renderer tests for fallback markup, remote-image failure
  behavior, action destinations, and the absence of duplicate inquiry UI.
- Run the complete validator and test suite.
- Capture and review:
  - `kungfu-tea.html`: 390x844, 768x1024, 1440x1000
  - `beauty-skin.html`: 390x844, 1440x1000
  - `nail-service.html`: 390x844, 1440x1000
- For every viewport: no page/console error, no failed local asset request, no
  horizontal overflow, visible 44px actions, working `tel:` and Google Maps
  links.
- Require independent UI review and QA/Bug review before push.

## Non-goals

- No new vendor facts, candidates, ratings, prices, or business claims.
- No admin/backend redesign.
- No licensed-photo acquisition; that requires separate evidence.
- No homepage or game redesign in this batch.
