# 廠商圖卡緊湊化與官方圖更新 2026-07-03

## 修復範圍

- `scripts/build-main-structure.mjs`
- `assets/js/vendor-page.js`
- `data/vendors/categories/beauty-skin/vendors.json`
- `data/vendors/categories/nail-service/vendors.json`
- `data/vendors/categories/kungfu-tea/vendors.json`

## 官方圖更新

已替換為穩定官方來源圖片：

| 店家 | 圖片來源 |
| --- | --- |
| Queenie漾美學館 | 官方網站 `og:image` |
| 妮莉莎美學 Nelissa Aesthetic | 官方網站 `og:image` |
| Relax蕾娜絲美甲美睫概念館（四維店） | 官方網站 hero 圖 |
| 功夫茶楊梅四維店 | 功夫茶官方網站 `og:image` |

Facebook-only 店家的 `og:image` 可抓到，但 URL 帶有期限參數，容易失效，這批先不寫進正式資料。

## 緊湊化調整

1. 卡片圖片比例由 16:9 改為 2:1，保留照片但降低高度。
2. 卡片內距由 16px / 14px 降到 12px。
3. 卡片間距由 16px 降到 12px。
4. 標題字級改為桌機 17px、手機 16px。
5. meta、tags、actions 的上下間距壓縮。
6. 小圖示連結文字維持 12px，不再低於 12px。
7. 電話、導航、官方來源、洽詢、收藏仍維持 44px 高，保留手機可點性。
8. 單店分類桌機版改成置中單欄，避免右側大空白。

## 量測

| 頁面 / 尺寸 | 卡片欄數 | 卡片尺寸 | 圖片尺寸 | 圖片比例 | 標題 | 小連結 | CTA | 水平溢出 |
| --- | ---: | --- | --- | ---: | --- | --- | --- | ---: |
| 美甲 375x812 | 1 | 343x373 | 341x171 | 2.00 | 16px | 44px | 44px | 0 |
| 美甲 390x844 | 1 | 358x381 | 356x178 | 2.00 | 16px | 44px | 44px | 0 |
| 美甲 1440x1000 | 2 | 554x480 | 552x276 | 2.00 | 17px | 44px | 44px | 0 |
| 功夫茶 1440x1000 | 1 置中 | 560x483 | 558x279 | 2.00 | 17px | 44px | 44px | 0 |

## 截圖

- `output/playwright/vendor-compact-mobile-375-nail-list.png`
- `output/playwright/vendor-compact-mobile-375-nail-card.png`
- `output/playwright/vendor-compact-mobile-390-nail-list.png`
- `output/playwright/vendor-compact-mobile-390-nail-card.png`
- `output/playwright/vendor-compact-desktop-1440-nail-list.png`
- `output/playwright/vendor-compact-desktop-1440-nelissa-official-card.png`
- `output/playwright/vendor-compact-desktop-1440-kungfu-single.png`
- `output/playwright/vendor-compact-desktop-1440-kungfu-card.png`
- `output/playwright/vendor-compact-mobile-390-queenie-official-card.png`

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- 全站本地連結掃描：83 個 HTML、534 個本地引用、`missingCount=0`
- Playwright console：0 errors、0 warnings
