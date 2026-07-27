# Beauty Skin Source Refresh - 2026-07-27

Checked at: `2026-07-27T09:51:41+08:00`
Scope: the three existing public records only. No candidate was promoted.

## beauty-skin-real-1 - Queenie漾美學館

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Queenie official site](https://www.queenie-spa.com/) | HTTP 200 | Official page identifies `Queenie漾美學館`, lists 0976866869 and 0981279832, `桃園市楊梅區環東路493號2樓`, and displays `@queenie0730`. It remains the image source page. |
| [Queenie Freetime booking page](https://myfreetime.io/shop/QueenieYang) | HTTP 200 | Store-controlled booking page identifies Queenie, lists the same address and 0976866869, `@queenie0730`, and Monday-Saturday 09:00-21:00 with Sunday closed. |
| [LINE @queenie0730](https://line.me/R/ti/p/@queenie0730) | HTTP 200 | The saved URL resolved to a generic friend-add page whose public asset path used a different account identifier (`@517gtrpc`). The page did not disclose a store name, so the destination identity could not be confirmed. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | Queenie漾美學館 | Same name on official site and booking page | Official site and booking page | Retained. |
| phone | 0976-866-869 | 0976866869; official site also lists 0981279832 | Official site and booking page | Retained primary phone; no unsupported preference change. |
| address | 桃園市楊梅區環東路493號2樓 | Same address | Official site and booking page | Retained. |
| businessHours | 星期一至星期六 09:00-21:00；星期日休息 | Same weekly schedule | Booking page | Retained. |
| officialUrl / imageSourceUrl | Official site URL | Same URL live | Official site | Retained. |
| lineUrl | LINE @queenie0730 URL | Text ID remains on official and booking pages, but saved URL's public destination identifier differs | Official site, booking page, LINE destination | Retained pending direct store confirmation; not fully re-verified. |
| rating / placeId / coordinates | null / null / null | No accepted official map record | None | Retained null values. |

### Publication and rights decision

- Publication: `published`; current official and booking sources agree on name, address, phone, and hours. The LINE destination identity is a follow-up concern, not evidence of a branch, phone, address, or closure conflict.
- Missing fields: price, place ID, coordinates, explicit image-reuse permission, and merchant consent.
- Media rights: `permission-pending`; no explicit reuse grant was found.
- Merchant consent: `not-recorded`; no consent evidence was found.
- Overall verification dates were retained because the LINE destination could not be fully identified.
- No candidate was promoted.

## beauty-skin-real-2 - 一一美容美體

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Facebook a220701](https://www.facebook.com/a220701/) | HTTP 200 by direct access, but the live research fetch was throttled and no page identity or field was readable | Existing claimed official source could not be freshly verified. |
| [Instagram reel](https://www.instagram.com/reel/DSIEEBGkvBt/) | HTTP 200 by direct access, but the live research fetch was throttled and no page identity or field was readable | Existing claimed official source could not be freshly verified. |
| [twincn entry](https://twincn.com/item.aspx?no=60094673) | Direct URL returned no readable payload; research fetch rejected it as unsafe | Directory/repost category; recorded only, never accepted as independent field evidence. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | 一一美容美體 | No newly readable first-party page | None | Retained existing value and prior evidence. |
| phone | 0931-050-370 | No newly readable first-party page | None | Retained; not freshly claimed. |
| address | 桃園市楊梅區三民路51號 | No newly readable first-party page | None | Retained; not freshly claimed. |
| businessHours | 10:00-12:00 / 14:00-20:00 | No newly readable first-party page | None | Retained; not freshly claimed. |
| officialUrl | Facebook URL | Existing URL responded but did not yield readable business identity | None | Retained without date refresh. |
| lineUrl / image source | null / no image source URL | No accepted new source | None | Retained. |

### Publication and rights decision

- Publication: `published` retained. No name, phone, address, or closure conflict was observed; unavailable first-party sources are not evidence of a change.
- Missing fields: current first-party confirmation for phone, business hours, LINE URL, image source/permission, place ID, coordinates, and merchant consent.
- Media rights: `permission-pending`; no explicit reuse grant was found.
- Merchant consent: `not-recorded`; no consent evidence was found.
- Overall verification dates were retained because no field was fully re-verified.
- No candidate was promoted.

## beauty-skin-real-3 - Arya愛麗雅皮膚管理體雕中心

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Facebook Aryabeautyfly](https://www.facebook.com/Aryabeautyfly/) | HTTP 200 direct access; research fetch showed only Facebook login shell, with no readable business fields | Existing claimed official source could not be freshly verified. |
| [1111 company page](https://www.1111.com.tw/corp/73585448/) | HTTP 200 | Employment-platform page names `愛麗雅有限公司` / `愛麗雅皮膚管理體雕中心`, shows 大成路147號 and links the saved LINE short URL. It is supplemental only, not a store-controlled consumer source. |
| [FindCompany entry](https://www.findcompany.com.tw/%E6%84%9B%E9%BA%97%E9%9B%85%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8) | HTTP 200 | Directory page lists the legal entity and address. It was not accepted as independent current consumer-facing evidence. |
| [LINE short URL](https://lin.ee/4G3SKJf) | HTTP 200 | Resolves to a generic friend-add page with public asset path `@830wclei`; no store name is exposed. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | Arya愛麗雅皮膚管理體雕中心 | 1111 repeats the consumer name alongside legal entity | None for fresh official verification | Retained existing value and prior evidence. |
| phone | 03-475-0475 | 1111 masks its displayed phone; Facebook did not yield readable fields | None | Retained; not freshly claimed. |
| address | 桃園市楊梅區大成路147號 | 1111 and directory pages show the same address | None for fresh official verification | Retained existing value and prior evidence. |
| businessHours | null | No accepted source | None | Retained `null`. |
| officialUrl | Facebook URL | Existing URL yielded only login shell | None | Retained without date refresh. |
| lineUrl | LINE short URL | URL resolves but its generic page has no store identity; 1111 links the same URL | None for fresh official verification | Retained without date refresh. |
| image / rating / placeId / coordinates | Unsplash image / null / null / null | No accepted official image or map record | None | Retained; no inferred values. |

### Publication and rights decision

- Publication: `published` retained. Supplemental pages align on legal entity/address, but are not used to newly verify current consumer facts; no address, phone, identity, or closure conflict was observed.
- Missing fields: freshly readable official consumer source, confirmed public phone, current hours, official image source/permission, place ID, coordinates, and merchant consent.
- Media rights: `permission-pending`; no explicit reuse grant was found.
- Merchant consent: `not-recorded`; no consent evidence was found.
- Overall verification dates were retained because no record was fully re-verified.
- No candidate was promoted.

## Source constraints

- Search result excerpts and the directory/employment pages above were not used as independent field-update evidence.
- The official government registration and tax lookup endpoints were accessed through their public entry points but did not return an individual usable record in this research environment. They were therefore not used to update consumer-facing facts.
