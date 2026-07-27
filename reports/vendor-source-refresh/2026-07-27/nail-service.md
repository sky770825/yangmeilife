# Nail Service Source Refresh - 2026-07-27

Checked at: `2026-07-27T10:24:18+08:00`

Scope: exactly the four existing public records in `data/vendors/categories/nail-service/vendors.json`. No candidate was promoted, no UI/shared code/generated asset was changed, and no full generator was run.

## nail-service-real-1 - 嶼你YN美甲美學殿

### Checked URLs

| URL | Access result | Use |
| --- | --- | --- |
| [Facebook](https://www.facebook.com/YNnewnails/) | HTTP 400 / Facebook temporary-block shell | No readable business identity or field. |
| [Instagram](https://www.instagram.com/yn_newnails/) | HTTP 200 generic login shell; research fetch throttled | No readable business identity or field. |
| [Current image](https://images.unsplash.com/photo-1604654894610-df63bc536371?w=640&h=440&fit=crop&crop=center&auto=format&q=80) | Browser safety gate prevented rendering the parameterized asset | External stock image only; no rights evidence. |

Search for a moved official source found only a directory listing, which was not accepted as consumer-field evidence.

| Field | Old value | Observed / accepted source | Decision |
| --- | --- | --- | --- |
| name | 嶼你YN美甲美學殿 | No readable first-party identity | Retained historical value. |
| phone | 03-485-5701 | No readable first-party field | Retained historical value. |
| address | 桃園市楊梅區環東路447號1樓 | No readable first-party field | Retained historical value. |
| businessHours | 10:00-19:00 | No readable first-party field | Retained historical value. |
| officialUrl / LINE / image | Facebook URL / null / Unsplash stock URL | Facebook unreadable; no LINE source; image is not rights-cleared | Retained without freshness claim. |

Branch decision: no conflicting branch, relocation, identity, phone, or closure evidence was observed. `publicationStatus: "published"` remains appropriate; overall verification and media dates remain historical because the record was not fully reverified. Missing: newly readable first-party consumer facts, explicit image permission, place ID, coordinates, and merchant consent. Media rights remain `permission-pending`; consent remains `not-recorded`. No candidate was promoted.

## nail-service-real-2 - 八四時髦指感空間

### Checked URLs

| URL | Access result | Use |
| --- | --- | --- |
| [Facebook](https://www.facebook.com/84NailSalon/) | Research fetch throttled | No readable business field. |
| [Instagram](https://www.instagram.com/84_nail_salon/) | HTTP 200 generic login shell; research fetch failed | No readable business field. |
| [Saved LINE URL](https://line.me/R/ti/p/@396fiuuu) | HTTP 200 generic `Add LINE friend` page; account identifier visible only in asset URL | Does not display a store identity, phone, address, or hours. |
| [Current image](https://images.unsplash.com/photo-1604654894611-6973b376cbde?w=640&h=440&fit=crop&crop=center&auto=format&q=80) | Browser safety gate prevented rendering the parameterized asset | External stock image only; no rights evidence. |

A current directory mirror was found while searching for moved first-party sources. It names the exact Yangmei branch and repeats the prior phone/address/LINE association, but it is a directory rather than store-controlled page and was not accepted as independent current consumer-field proof.

| Field | Old value | Observed / accepted source | Decision |
| --- | --- | --- | --- |
| name | 八四時髦指感空間 | No readable first-party identity | Retained historical value. |
| phone | 0925-296-677 | No readable first-party field | Retained historical value. |
| address | 桃園市楊梅區中山北路二段23巷27號 | No readable first-party field | Retained historical value. |
| businessHours | null | No accepted first-party field | Retained null; no schedule inferred from the directory. |
| officialUrl | Facebook URL | Existing URL currently unreadable | Retained without freshness claim. |
| lineUrl | `https://line.me/R/ti/p/@396fiuuu` | Generic LINE page does not establish store identity | Retained as a historical destination, but removed from name/phone/address evidence and left without fresh LINE field evidence. |
| image | Unsplash stock URL | No permission source | Retained; rights remain pending. |

Branch decision: the supplemental directory distinguishes the Yangmei and Zhongli branches and agrees with the stored Yangmei address, but is not accepted as primary evidence. No conflicting first-party identity, relocation, phone, or closure evidence was observed. `publicationStatus: "published"` remains appropriate; overall verification and media dates remain historical. Missing: readable store-controlled confirmation, current hours, explicit image permission, place ID, coordinates, and merchant consent. Media rights remain `permission-pending`; consent remains `not-recorded`. No candidate was promoted.

## nail-service-real-3 - 妮莉莎美學

### Checked URLs

| URL | Access result | Accepted field use |
| --- | --- | --- |
| [Official service page](https://www.nelissa.com.tw/meijia.html) | HTTP 200 | Displays 妮莉莎美學, the Yangmei nail service, address `326桃園市楊梅區四維路196號`, phone `03-4312061`, the official `og:image`, and a store-controlled booking link to `https://lin.ee/HAYqMVL`. |
| [Official products page](https://www.nelissa.com.tw/products.html) | HTTP 200 | Repeats the address and phone. |
| [Official image](https://www.nelissa.com.tw/uploads/use/20260303165637d275.jpg) | HTTP 200 image/jpeg | Confirms the current external official image URL, not image-reuse permission. |
| [Booking LINE](https://lin.ee/HAYqMVL) | Generic `Add LINE friend` destination | The official service page, not the generic LINE screen, is the accepted proof that this is the store booking link. |

| Field | Old value | Observed / accepted source | Decision |
| --- | --- | --- | --- |
| name | 妮莉莎美學 Nelissa Aesthetic | Official pages consistently identify 妮莉莎美學 at the exact stored address | Updated to the visible first-party name; unsupported English suffix removed. |
| phone | 03-431-2061 | Official service/products pages show 03-4312061 | Retained; `tel:034312061` is valid. |
| address | 326桃園市楊梅區四維路196號 | Official service/products pages show the same address | Retained; existing Google Maps navigation URL is non-empty and address-derived. |
| businessHours | null | No hours displayed on the checked official pages | Retained null. |
| officialUrl | Official service page | HTTP 200 and first-party | Retained. |
| lineUrl | null | Official service page controls the booking link to `https://lin.ee/HAYqMVL` | Added with the official service page as field evidence. |
| image | Official `og:image` URL | Exact image returns HTTP 200 | Retained; rights are still pending. |

Branch decision: the official service page names the business and exact 四維路 196 號 location, so the stored Yangmei record is the same branch. `publicationStatus: "published"` remains appropriate. This record was fully rechecked with `lastVerifiedAt: 2026-07-27`, `nextReviewAt: 2026-10-25`, reviewer `A2.3 researcher`, and actual source/media check timestamps. Missing: business hours, explicit image-reuse permission, place ID, coordinates, and merchant consent. Media rights remain `permission-pending`; consent remains `not-recorded`. No candidate was promoted.

## nail-service-real-4 - Relax蕾娜絲美甲美睫概念館

### Checked URLs

| URL | Access result | Accepted field use |
| --- | --- | --- |
| [Official site](https://shop4968.noon360.com/mainssl/uploads/shop4968/html/home.html) | HTTP 200 | Displays Relax蕾娜絲美甲美睫概念館, address `326桃園市楊梅區四維路133號`, phone `03-4820127` and `0922919356`, and every-week `10:30 ~ 19:30` hours. |
| [Official hero image](https://shop4968.noon360.com/mainssl/uploads/shop4968/html/assets/images/hero/hero-right.jpg) | HTTP 200 image/jpeg | Confirms the current external official image URL, not image-reuse permission. |
| [Facebook](https://www.facebook.com/relax4820127/) | Research fetch throttled | Not used as fresh field evidence. |

| Field | Old value | Observed / accepted source | Decision |
| --- | --- | --- | --- |
| name | Relax蕾娜絲美甲美睫概念館（四維店） | Official site names Relax蕾娜絲美甲美睫概念館 at 四維路 133 號 | Updated to the exact official-source name; the address remains the branch discriminator. |
| phone | 03-482-0127 | Official site shows 03-4820127 plus 0922919356 | Stored display contact remains the first-listed landline; no priority is asserted. `tel:034820127` is valid. |
| address | 326桃園市楊梅區四維路133號 | Official site shows the same address | Retained; existing Google Maps navigation URL is non-empty and address-derived. |
| businessHours | 每週 10:30-19:30 | Official site shows 每週 10:30 ~ 19:30 | Retained normalized formatting. |
| officialUrl | Official site | HTTP 200 and first-party | Retained. |
| lineUrl | null | No store-controlled LINE link on the checked official site | Retained null. |
| image | Official hero image URL | Exact image returns HTTP 200 | Retained; rights are still pending. |

Branch decision: the first-party site directly ties the Relax identity to the exact 四維路 133 號 address, which distinguishes this record from other locations without asserting that the source uses a branch name. `publicationStatus: "published"` remains appropriate. This record was fully rechecked with `lastVerifiedAt: 2026-07-27`, `nextReviewAt: 2026-10-25`, reviewer `A2.3 researcher`, and actual source/media check timestamps. Missing: store-controlled LINE, explicit image-reuse permission, place ID, coordinates, and merchant consent. Media rights remain `permission-pending`; consent remains `not-recorded`. No candidate was promoted.

## Self-Review

- Exactly `nail-service-real-1` through `nail-service-real-4` remain in `vendors`; `candidateVendors` was not modified or promoted.
- All four public ratings remain `null`; map identity and coordinates remain `null`; no unsupported image rights or merchant consent was recorded.
- Only field-specific supported data changed: Nelissa's official booking LINE, source attribution/evidence narrowing, and timestamps for fully rechecked records. No UI, shared script, runtime output, or generated asset changed.
- The required validator, tests, JSON parse check, `git diff --check`, and focused invariant checks are recorded after execution in the local SDD task report.
