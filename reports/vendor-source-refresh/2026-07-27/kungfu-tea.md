# Kung Fu Tea Source Refresh - 2026-07-27

Checked at: `2026-07-27T09:51:41+08:00`
Scope: existing public record only. No candidate was promoted.

## kungfu-tea-1 - 功夫茶楊梅四維店

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [功夫茶官方全球據點](https://www.kungfutea.com.tw/location/?page=11) | HTTP 200 | Official brand location page. It lists `楊梅四維`, `03-488-2975`, and `桃園市楊梅區四維路90號`. It also remains the image source page. |
| [功夫茶楊梅四維店](https://shop5877.noon360.com/mainssl/uploads/shop5877/html/home.html) | HTTP 200 | Store-controlled page titled `功夫茶 楊梅四維店 - 首頁`; its contact section lists the same address, phone, and `Line：@359subhu`. An embedded panel reports an internal error, but the page's own identity and contact section loaded. |
| [LINE @359subhu](https://line.me/R/ti/p/@359subhu) | HTTP 200 | LINE friend-add destination remained reachable. Its generic page does not independently expose store identity; the store-controlled page above supplies that identity. |

`imageSourceUrl` is the official global-location page already listed above; it was checked as part of the same access.

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | 功夫茶楊梅四維店 | 功夫茶 official location calls the branch `楊梅四維`; store page names `功夫茶 楊梅四維店` | Official location and store page | Retained; same branch identity. |
| phone | 03-488-2975 | 03-488-2975 | Official location and store page | Retained. |
| address | 楊梅區四維路 90 號 | Official page gives 桃園市楊梅區四維路90號; store page gives 326桃園市楊梅區四維路90號 | Official location and store page | Retained exactly as required public value. |
| businessHours | null | Not listed on either checked source | None | Retained `null`; no inference. |
| officialUrl | official location URL | Same URL returns current branch entry | Official location | Retained. |
| lineUrl | LINE @359subhu URL | Store page lists `@359subhu`; LINE destination remains reachable | Store page and LINE destination | Retained. |
| image / imageSourceUrl | Official location page image | Official location page remains reachable | Official location | Retained; no reuse permission found. |
| rating / placeId / coordinates | null / null / null | No traceable official map record was accepted | None | Retained null values. |

### Publication and rights decision

- Publication: `published`. Official brand and same-branch store pages agree on branch identity, phone, and address.
- Missing fields: current business hours, place ID, coordinates, explicit image-reuse permission, and merchant consent.
- Media rights: `permission-pending`; the source page is official, but it provides no explicit reuse grant.
- Merchant consent: `not-recorded`; no consent evidence was found.
- Source-change search: the existing official location and branch pages remain live; no moved replacement was adopted.
- No candidate was promoted.
