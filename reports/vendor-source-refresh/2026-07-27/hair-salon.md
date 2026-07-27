# Hair Salon Source Refresh - 2026-07-27

Checked at: `2026-07-27T10:07:33+08:00`

Scope: the three existing public records in `hair-salon/vendors.json` only. No candidate was promoted, no generated asset was changed, and no full generator was run.

## hair-salon-real-1 - Fashion Hair Salon

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Facebook page](https://www.facebook.com/p/Fashion-Hair-Salon-100065096546791/) | HTTP 200, but the live page was a Facebook temporary-block/login shell | No business identity or field was readable. Existing official-source URL retained without a date refresh. |
| [Instagram post](https://www.instagram.com/p/DWQm1L0FK0j/) | Research fetch throttled | No business field was readable. |
| [LINE short URL](https://lin.ee/SJ15p7G) | Redirect destination could not be safely opened | The generic destination could not identify this salon and was not used for name, phone, address, or hours. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | Fashion Hair Salon | No readable first-party identity | None | Retained existing value and prior official-source associations. |
| phone | 03-420-1685 | No readable first-party field | None | Retained; not freshly claimed. |
| address | 桃園市楊梅區新榮路99號 | No readable first-party field | None | Retained; not freshly claimed. |
| businessHours | 每週一、二公休 | No readable first-party field | None | Retained; not freshly claimed. |
| officialUrl | Facebook page URL | URL responds but no public business identity is readable | None | Retained without date refresh. |
| lineUrl | LINE short URL | Generic destination did not identify a salon | None | Retained as a contact destination only; removed from unrelated field evidence. |
| rating / placeId / coordinates | null / null / null | No accepted traceable map record | None | Retained null values. |

### Publication and rights decision

- Publication: `published` retained. No identity, address, phone, relocation, or closure conflict was observed; unavailable sources are not evidence of a change.
- Missing fields: freshly readable first-party confirmation for consumer facts, explicit image-reuse permission, place ID, coordinates, and merchant consent.
- Media rights remain `permission-pending`; merchant consent remains `not-recorded`.
- Overall verification and media dates were retained because the record was not fully reverified.
- No candidate was promoted.

## hair-salon-real-2 - Lin美髮沙龍楊梅旗艦店

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Facebook page](https://www.facebook.com/lin4856968/) | Research fetch throttled | Existing claimed official source could not be freshly read. |
| [1111 company page](https://www.1111.com.tw/corp/69623666/) | HTTP 200 | Lists `LIN美髮沙龍(楊梅旗艦店)`, `桃園市楊梅區大成路57號`, and also distinguishes a separate 楊梅一店. It is an employment-platform page, not accepted as independent current consumer-field proof. |
| [Gomaji store page](https://www.gomaji.com/store/15289/pid/279869) | HTTP 200 | Lists the same flagship branch, phone, address, and 10:00-20:00 schedule, but the promotion period ended in 2022. It is a third-party historic listing, not current proof. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | Lin美髮沙龍楊梅旗艦店 | 1111/Gomaji use matching branch identity | None for fresh official verification | Retained existing value and previous Facebook association. |
| phone | 03-488-0733 | 1111/Gomaji display the same phone | None for fresh official verification | Retained; not freshly claimed. |
| address | 楊梅區大成路57號 | 1111/Gomaji display the same flagship address; 1111 separately lists 楊梅一店 on 新成路159號 | None for fresh official verification | Retained; no branch conflict in this record. |
| businessHours | 10:00-20:00 | Gomaji displays this schedule in an expired 2021-2022 offer | None | Retained; not freshly claimed. |
| officialUrl | Facebook page URL | Existing URL was unreadable in research | None | Retained without date refresh. |
| lineUrl / image source | null / no image source URL | No accepted source | None | Retained. |
| rating / placeId / coordinates | null / null / null | Third-party rating and listings are not accepted map evidence | None | Retained null values. |

### Publication and rights decision

- Publication: `published` retained. The supplemental pages align on the exact flagship branch; their distinct 楊梅一店 listing is not a conflict. No official-source conflict or closure notice was observed.
- Field evidence was narrowed to the claimed official Facebook URL. The employment and marketplace pages remain in `sourceUrls` for traceability, not as independent consumer-field proof.
- Missing fields: freshly readable official consumer source, confirmed current hours, LINE URL, explicit image-reuse permission, place ID, coordinates, and merchant consent.
- Media rights remain `permission-pending`; merchant consent remains `not-recorded`.
- Overall verification and media dates were retained because the record was not fully reverified.
- No candidate was promoted.

## hair-salon-real-3 - YL Hair Salon 意翎髮藝

### Checked URLs

| URL | Access result | Page identity and use |
| --- | --- | --- |
| [Facebook page](https://www.facebook.com/yiling688/) | HTTP 200, but the live page was a Facebook temporary-block/login shell | No business field was readable. |
| [Instagram profile](https://www.instagram.com/ylhairsalon/) | Research fetch did not yield readable public content | No field was accepted from the profile. |
| [YL electronic business card](https://www.iringo.com.tw/myecard/ecard1.php?id=BS0000875&openExternalBrowser=1) | HTTP 200 | Store-controlled electronic card identifies `YL Hair Salon`, lists 03-4789059, 0981-317-219, and 桃園市楊梅區環南路61號, and labels its booking LINE. |
| [Saved LINE short URL](https://lin.ee/hxk7s94) | Redirect destination could not be safely opened | It did not provide a readable store identity. |
| [Current booking LINE from electronic card](https://lin.ee/jriwMC6) | Redirects to `line.me/R/ti/p/@396zqkal`; the generic destination could not be safely opened | The electronic card, rather than the generic LINE landing page, is the evidence for the updated booking URL. |

### Field decision record

| Field | Old value | Observed value | Accepted source | Decision |
| --- | --- | --- | --- | --- |
| name | YL Hair Salon 意翎髮藝 | Electronic card labels YL Hair Salon | Electronic business card | Retained name; evidence narrowed to the readable store-controlled card. |
| phone | 03-478-9059 | Card lists 03-4789059 and an additional mobile number | Electronic business card | Retained listed primary phone; no unsupported preference change. |
| address | 楊梅區環南路61號 | Card lists 桃園市楊梅區環南路61號 | Electronic business card | Retained. |
| businessHours | 星期二至星期日，星期一公休 | No schedule on readable electronic card; social pages unreadable | None | Retained; not freshly claimed. |
| officialUrl | Facebook page URL | Facebook page unreadable; electronic card links a Facebook destination but it was also throttled | None | Retained without changing the official URL. |
| lineUrl | https://lin.ee/hxk7s94 | Electronic card labels `https://lin.ee/jriwMC6` as the store booking LINE | Electronic business card | Updated to the currently linked booking URL. |
| image / rating / placeId / coordinates | Unsplash image / null / null / null | No explicit reuse grant or accepted map record | None | Retained; no inferred values. |

### Publication and rights decision

- Publication: `published` retained. The readable store-controlled card matches the existing primary phone and address; it provides a current booking LINE. No identity, phone, address, relocation, or closure conflict was observed.
- Missing fields: freshly confirmed current hours, explicit image-reuse permission, place ID, coordinates, and merchant consent.
- Media rights remain `permission-pending`; merchant consent remains `not-recorded`.
- Overall verification and media dates were retained because business hours and the saved social URLs were not fully reverified.
- No candidate was promoted.

## Source constraints

- Search result excerpts were used only to look for moved official sources; none was treated as evidence.
- The Facebook and Instagram access limitations above are environment constraints, not evidence that a business changed or closed.
- The 1111 and Gomaji pages were opened because they are existing `sourceUrls`; they were not used as independent current consumer fact proof.
