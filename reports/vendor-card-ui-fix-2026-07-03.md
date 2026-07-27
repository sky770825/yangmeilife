# 廠商圖卡 UI 修復 2026-07-03

## 修復範圍

- 來源模板：`scripts/build-main-structure.mjs`
- 產出檔案：`assets/js/vendor-page.js`
- 影響頁面：所有廠商分類頁
- 主要驗證頁：`nail-service.html`、`beauty-skin.html`、`hair-salon.html`、`kungfu-tea.html`

## 已修復

1. 新增廠商卡片專用 CSS，不再依賴缺失的 Tailwind utility。
2. 縮圖固定為 16:9 比例。
3. 手機版固定單欄。
4. 桌面精簡模式恢復 2 欄。
5. 桌面大圖模式恢復 3 欄。
6. CTA 與收藏按鈕高度固定為 44px。
7. 長店名限制最多 2 行。
8. 聯絡資料改成 3 個小圖示連結，不再使用大面積文字資料框。
9. Tags 最多顯示 3 個，降低卡片噪音。
10. 電話改為 `tel:` 連結，可直接點擊撥打。
11. 地址改為 Google Maps 導航連結，可直接點擊導航。
12. 官方來源改成短標籤，例如 `官網`、`FB`、`LINE`、`登記`，並保留外部連結。
13. 洽詢與收藏按鈕補上自製 inline SVG 小圖示，減少純文字佔版。

## 修復後量測

### 手機 390x844

| 頁面 | 欄數 | 圖片尺寸 | 圖片比例 | 按鈕高度 | 水平溢出 |
| --- | ---: | --- | ---: | ---: | ---: |
| `nail-service.html` | 1 | 約 356x200 | 1.78 | 44px | 0 |
| `beauty-skin.html` | 1 | 約 356x200 | 1.78 | 44px | 0 |
| `hair-salon.html` | 1 | 約 356x200 | 1.78 | 44px | 0 |
| `kungfu-tea.html` | 1 | 約 356x200 | 1.78 | 44px | 0 |

### 小手機 375x812

| 頁面 | 欄數 | 圖片尺寸 | 圖片比例 | 按鈕高度 | 水平溢出 |
| --- | ---: | --- | ---: | ---: | ---: |
| `nail-service.html` | 1 | 約 341x192 | 1.78 | 44px | 0 |
| `beauty-skin.html` | 1 | 約 341x192 | 1.78 | 44px | 0 |
| `hair-salon.html` | 1 | 約 341x192 | 1.78 | 44px | 0 |
| `kungfu-tea.html` | 1 | 約 341x192 | 1.78 | 44px | 0 |

### 桌面 1440x1000

| 模式 | 欄數 | 圖片尺寸 | 圖片比例 | 按鈕高度 | 水平溢出 |
| --- | ---: | --- | ---: | ---: | ---: |
| 精簡 | 2 | 約 550x309 | 1.78 | 44px | 0 |
| 大圖 | 3 | 約 361x203 | 1.78 | 44px | 0 |

### 圖示連結

| 項目 | 結果 |
| --- | --- |
| 電話 | 每張卡片輸出 `tel:` 連結 |
| 地址 | 每張卡片輸出 Google Maps 導航連結 |
| 官方來源 | 每張卡片輸出官方來源外連或 disabled 狀態 |
| 小圖示 | 聯絡連結與 CTA 均含 SVG icon |
| 觸控高度 | 聯絡連結與 CTA 均為 44px |

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，前台 vendor 11 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：83 個 HTML、534 個本地引用、`missingCount=0`
- Playwright console：0 errors、0 warnings
- Playwright 手機 390x844：通過
- Playwright 小手機 375x812：通過
- Playwright 桌面 1440x1000：通過
- Playwright 大圖模式切換：手機仍 1 欄、桌面 3 欄，通過
- Playwright vendor quick links：電話、導航、官方來源 href 均通過

## 截圖

- `output/playwright/vendor-card-fix-nail-mobile.png`
- `output/playwright/vendor-card-fix-nail-mobile-card.png`
- `output/playwright/vendor-card-fix-nail-desktop.png`
- `output/playwright/vendor-card-icon-mobile-detail.png`
- `output/playwright/vendor-card-icon-desktop-detail.png`

## 後續可做

- 逐步替換 Unsplash 情境圖為店家實拍或品牌圖。
- 如果店家資料變多，新增卡片詳細頁或底部抽屜，避免主卡片塞太多資料。
