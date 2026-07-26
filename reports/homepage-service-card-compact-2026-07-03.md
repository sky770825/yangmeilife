# 首頁服務卡片緊湊化 2026-07-03

## 範圍

- `index.html`
- `assets/js/homepage-thumbnails.js`

## 調整內容

1. 首頁服務區 section 內距與區塊間距下修，減少大面積空白。
2. `.app-card` 共用高度與 padding 下修，改為更接近功能入口的密度。
3. 手機版 `.col-span-2` 卡片改回單欄寬度，避免補助優惠、二手交易在手機整列佔滿。
4. 手機版標題與副標限制單行省略，避免長文字把卡片撐高。
5. 服務卡縮圖由展示型大圖調整為入口型小圖，保留照片辨識但降低高度。
6. 輕鬆時光四張卡仍保留較大的圖像比例，維持首頁第一段視覺重點。

## 量測摘要

| 尺寸 | 熱門服務區 | 生活服務推薦 | 服務卡高度 | 服務縮圖 | 水平溢出 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 手機 375 | 668px | 543px | 105-107px | 48-49px | 0 |
| 手機 390 | 約 684px | 約 543px | 105-106px | 48-49px | 0 |
| 桌機 1440 | 484px | 342px | 113-124px | 48-57px | 0 |

## 對照

- 手機熱門服務區：原本約 898px，調整後 375px 約 668px。
- 手機後段服務卡：原本約 127-130px，調整後約 105-106px。
- 桌機後段服務卡：原本約 134-135px，調整後約 122-124px。

## 截圖

- `output/playwright/home-services-compact-final-desktop1440.png`
- `output/playwright/home-services-compact-final-mobile390.png`
- `output/playwright/home-services-compact-final-mobile375.png`
- `output/playwright/home-services-compact-final-mobile375-life-section.png`

## 驗證

- 375px、390px、1440px 首屏截圖已確認為本機首頁。
- 375px 中段服務區已確認無水平溢出。
- `homepage-thumbnails.js` 語法檢查通過。
- Playwright console 無 error。
