# Vendor Source Refresh Release Gate - 2026-07-27

## Scope and Result

This release ledger consolidates the A2.1 through A2.5 evidence into one decision for every vendor record: 11 published records and 30 legacy-demo candidates. It uses the checked-in vendor source files, their field-level source lists, the media-rights audit, and the fixed-timestamp release gate run on 2026-07-27.

- Public runtime result: 11 published, verified vendors in 11 categories.
- Candidate result: 30 excluded legacy-demo records; none is public, verified, or included in runtime data.
- Image result: 4 `official-external`, 7 `no-approved-image`, 0 licensed-local assets, 0 published Unsplash image URLs.
- Drinks restriction: the sole public drinks record is `kungfu-tea-1` / 功夫茶楊梅四維店 at `楊梅區四維路 90 號`.
- No images were downloaded, generated, or added to the repository.

Source labels in the table resolve to the record's `sourceUrls` / `fieldSources`; all published sources remain HTTP(S) evidence. Candidate rows have no authoritative source URL by design and must not be promoted from this ledger.

## Decision Table

| Category | ID / name | Publication decision | Checked sources | Changed fields | Missing / conflicting fields | Image rights state | sourceCheckedAt | nextReviewAt | Reviewer verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 美容護膚 | `beauty-skin-real-1` / Queenie漾美學館 | Publish | [Queenie official](https://www.queenie-spa.com/); [MyFreetime](https://myfreetime.io/shop/QueenieYang) | A2.1 provenance refresh; A2.5 official image evidence retained | No blocking conflict; separate merchant permission is not recorded | `official-external` | `2026-07-03T08:26:15+08:00` | `2026-10-01` | Pascal data Pass; Lovelace rights Pass |
| 美容護膚 | `beauty-skin-real-2` / 一一美容美體 | Publish | [Facebook](https://www.facebook.com/a220701/); [Instagram](https://www.instagram.com/reel/DSIEEBGkvBt/); [TWCompany](https://twincn.com/item.aspx?no=60094673) | Cleared stock image; media set to `no-approved-image` | No LINE; official social content was not fully readable in research | `no-approved-image` | `2026-07-03T08:26:15+08:00` | `2026-10-01` | Pascal data Pass; Lovelace rights Pass |
| 美容護膚 | `beauty-skin-real-3` / Arya愛麗雅皮膚管理體雕中心 | Publish | [Facebook](https://www.facebook.com/Aryabeautyfly/); [1111](https://www.1111.com.tw/corp/73585448/); [FindCompany](https://www.findcompany.com.tw/%E6%84%9B%E9%BA%97%E9%9B%85%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8) | Cleared stock image; media set to `no-approved-image` | Business hours absent; official social content was not fully readable in research | `no-approved-image` | `2026-07-03T08:26:15+08:00` | `2026-10-01` | Pascal data Pass; Lovelace rights Pass |
| 美髮 | `hair-salon-real-1` / Fashion Hair Salon | Publish | [Facebook](https://www.facebook.com/p/Fashion-Hair-Salon-100065096546791/); [Instagram](https://www.instagram.com/p/DWQm1L0FK0j/) | Cleared stock image; media set to `no-approved-image` | Official social content was not fully readable in research | `no-approved-image` | `2026-07-03T08:15:32+08:00` | `2026-10-01` | Curie data Pass; Lovelace rights Pass |
| 美髮 | `hair-salon-real-2` / Lin美髮沙龍楊梅旗艦店 | Publish | [Facebook](https://www.facebook.com/lin4856968/); [1111](https://www.1111.com.tw/corp/69623666/); [Gomaji](https://www.gomaji.com/store/15289/pid/279869) | Cleared stock image; media set to `no-approved-image` | No LINE; official social content was not fully readable in research | `no-approved-image` | `2026-07-03T08:15:32+08:00` | `2026-10-01` | Curie data Pass; Lovelace rights Pass |
| 美髮 | `hair-salon-real-3` / YL Hair Salon 意翎髮藝 | Publish | [Facebook](https://www.facebook.com/yiling688/); [Instagram](https://www.instagram.com/ylhairsalon/); [e-card](https://www.iringo.com.tw/myecard/ecard1.php?id=BS0000875&openExternalBrowser=1) | Confirmed contact evidence and current LINE destination; cleared stock image | No blocking conflict | `no-approved-image` | `2026-07-03T08:15:32+08:00` | `2026-10-01` | Curie data Pass; Lovelace rights Pass |
| 飲品 | `kungfu-tea-1` / 功夫茶楊梅四維店 | Publish | [Kung Fu Tea location](https://www.kungfutea.com.tw/location/?page=11); [store page](https://shop5877.noon360.com/mainssl/uploads/shop5877/html/home.html) | Refreshed checked/review dates, field provenance, and official image evidence | Business hours remain absent from reviewed official sources | `official-external` | `2026-07-27T09:51:41+08:00` | `2026-10-25` | Pascal data Pass; Lovelace rights Pass |
| 美甲 | `nail-service-real-1` / 嶼你YN美甲美學殿 | Publish | [Facebook](https://www.facebook.com/YNnewnails/); [Instagram](https://www.instagram.com/yn_newnails/) | Cleared stock image; media set to `no-approved-image` | No LINE; official social content was not fully readable in research | `no-approved-image` | `2026-07-03T08:51:37+08:00` | `2026-10-01` | Aristotle data Pass; Lovelace rights Pass |
| 美甲 | `nail-service-real-2` / 八四時髦指感空間 | Publish | [Facebook](https://www.facebook.com/84NailSalon/); [Instagram](https://www.instagram.com/84_nail_salon/) | Removed generic LINE page from fact evidence; cleared stock image | Business hours absent; LINE destination is not independently confirmed | `no-approved-image` | `2026-07-03T08:51:37+08:00` | `2026-10-01` | Aristotle data Pass; Lovelace rights Pass |
| 美甲 | `nail-service-real-3` / 妮莉莎美學 | Publish | [official nail page](https://www.nelissa.com.tw/meijia.html); [official products](https://www.nelissa.com.tw/products.html) | Normalized official name; confirmed LINE; refreshed dates and official image evidence | Business hours absent | `official-external` | `2026-07-27T10:24:18+08:00` | `2026-10-25` | Aristotle data Pass; Lovelace rights Pass |
| 美甲 | `nail-service-real-4` / Relax蕾娜絲美甲美睫概念館 | Publish | [official store page](https://shop4968.noon360.com/mainssl/uploads/shop4968/html/home.html); [Facebook](https://www.facebook.com/relax4820127/) | Normalized official name and source precision; refreshed dates and official image evidence | Official page lists two phones; displayed city phone remains `03-482-0127` | `official-external` | `2026-07-27T10:24:18+08:00` | `2026-10-25` | Aristotle data Pass; Lovelace rights Pass |
| 美式整復 | `american-chiropractic-1` / 楊梅脊衡整復所 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美式整復 | `american-chiropractic-2` / 埔心關節調理室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美式整復 | `american-chiropractic-3` / 富岡動作修復 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美容護膚 | `beauty-skin-1` / 楊梅光采肌膚管理 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美容護膚 | `beauty-skin-2` / 埔心植萃美顏室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美容護膚 | `beauty-skin-3` / 富岡亮顏工作室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美睫 | `eyelash-service-1` / 楊梅自然睫作 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美睫 | `eyelash-service-2` / 埔心睫眉設計 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美睫 | `eyelash-service-3` / 富岡輕感美睫 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 餐車 | `food-truck-1` / 四維路鹽酥雞餐車 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 餐車 | `food-truck-2` / 埔心甜點餐車 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 餐車 | `food-truck-3` / 富岡咖啡行動吧 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美髮 | `hair-salon-1` / 楊梅剪染研究室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美髮 | `hair-salon-2` / 埔心髮型工作室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美髮 | `hair-salon-3` / 富岡男士理髮 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美甲 | `nail-service-1` / 楊梅指尖美學 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美甲 | `nail-service-2` / 埔心日系美甲室 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 美甲 | `nail-service-3` / 富岡手足護理 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 包租代管 | `rental-management-1` / 楊梅租管顧問 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 包租代管 | `rental-management-2` / 埔心社宅包租團隊 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 包租代管 | `rental-management-3` / 富岡出租管理 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 台式按摩 | `taiwanese-massage-1` / 楊梅傳統整復舒壓 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 台式按摩 | `taiwanese-massage-2` / 埔心足體工坊 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 台式按摩 | `taiwanese-massage-3` / 富岡在地按摩 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 泰式按摩 | `thai-massage-1` / 楊梅蘭納泰式舒壓 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 泰式按摩 | `thai-massage-2` / 埔心古法按摩館 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 泰式按摩 | `thai-massage-3` / 富岡香氛舒壓 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 越式按摩 | `vietnamese-massage-1` / 楊梅越式養生館 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 越式按摩 | `vietnamese-massage-2` / 埔心足體會館 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |
| 越式按摩 | `vietnamese-massage-3` / 富岡輕鬆養生 | Exclude / audit-only | None recorded | Cleared demo fields; added `no-authoritative-source` triage | `phone`, `address`, `officialSource` | `no-approved-image` | `2026-07-27` (triage) | N/A: hold until authoritative source | Feynman exclusion Pass |

## Release Gate Evidence

Executed after the table was reconciled:

```text
node --check scripts/build-main-structure.mjs
node --check scripts/validate-vendor-data.mjs
node scripts/validate-vendor-data.mjs
node --test tests/*.test.mjs
BUILD_TIMESTAMP=2026-07-27T00:00:00.000Z node scripts/build-main-structure.mjs
node scripts/validate-vendor-data.mjs
git diff --check
```

Results: both syntax checks passed; validation passed before and after the build with 11 categories and 11 public vendors; the full test suite passed 114 tests; `git diff --check` passed.

Focused public behavior coverage proves that public cards do not render an unverified rating, normalize every visible phone action to `tel:`, use Google Maps search navigation for every visible address, never fall back to the site-wide platform LINE when a store lacks both LINE and official URL, and emit only `published` records to runtime data. Existing publication tests also cover candidate, `hold`, and `retired` runtime exclusion.

## Reviewer Verdict and Handoff

The ledger incorporates the distinct A2 reviewer outcomes already recorded for data research (Pascal, Curie, Aristotle), candidate exclusion (Feynman), and media rights (Lovelace). The automated release gate has no unresolved critical or important failure.

Remaining non-blocking work is intentionally deferred: seven published vendors need a neutral A3 image fallback; official-image provenance is not a reuse or hotlink permission; several social pages and optional fields remain due for their scheduled review. No candidate should be promoted without a new authoritative source and a separate review.
