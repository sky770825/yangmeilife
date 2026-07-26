# 廠商圖卡美觀度檢視 2026-07-03

## 檢視範圍

- 手機：375x812、390x844
- 桌機：1440x1000
- 頁面：`nail-service.html`、`kungfu-tea.html`
- 重點：欄位、文字大小、圖片比例、卡片密度、操作按鈕

## 量測結果

| 頁面 / 尺寸 | 卡片欄數 | 卡片尺寸 | 圖片尺寸 | 圖片比例 | 標題字級 | 次要文字 | 小圖示連結 | CTA |
| --- | ---: | --- | --- | ---: | --- | --- | --- | --- |
| 美甲 375 | 1 | 343x426 | 341x192 | 1.78 | 17px | 14px | 44px | 44px |
| 美甲 390 | 1 | 358x434 | 356x200 | 1.78 | 17px | 14px | 44px | 44px |
| 美甲 1440 | 2 | 552x551 | 550x309 | 1.78 | 18px | 14px | 44px | 44px |
| 功夫茶 390 | 1 | 358x434 | 356x200 | 1.78 | 17px | 14px | 44px | 44px |
| 功夫茶 1440 | 2 欄容器 / 1 張卡 | 552x551 | 550x309 | 1.78 | 18px | 14px | 44px | 44px |

所有檢查尺寸皆無水平溢出。

## 截圖

### 手機版

- `output/playwright/vendor-aesthetic-mobile-375-nail-list.png`
- `output/playwright/vendor-aesthetic-mobile-375-nail-card.png`
- `output/playwright/vendor-aesthetic-mobile-390-nail-list.png`
- `output/playwright/vendor-aesthetic-mobile-390-nail-card.png`
- `output/playwright/vendor-aesthetic-mobile-390-kungfu-list.png`
- `output/playwright/vendor-aesthetic-mobile-390-kungfu-card.png`

### 桌機版

- `output/playwright/vendor-aesthetic-desktop-1440-nail-list.png`
- `output/playwright/vendor-aesthetic-desktop-1440-nail-card.png`
- `output/playwright/vendor-aesthetic-desktop-1440-kungfu-list.png`
- `output/playwright/vendor-aesthetic-desktop-1440-kungfu-card.png`

## 判斷

### 已符合

1. 手機版一欄卡片穩定，沒有橫向捲動。
2. 桌機多店分類使用兩欄，卡片尺寸一致，掃描效率比單欄好。
3. 縮圖固定 16:9，已避免圖片高度把版面撐爆。
4. 電話、導航、官方來源已壓縮為小圖示連結，不佔大面積。
5. 主要按鈕與小圖示連結皆為 44px 高，符合手機觸控基本門檻。
6. 標題 17px / 18px、地區與價格 14px，層級清楚。

### 需要再優化

1. 單店分類的桌機版仍使用兩欄 grid，只有一張卡時右側留白過大。建議單店頁改為置中卡片，或改成寬版資訊卡。
2. 手機版的小圖示連結文字目前為 11px，雖然節省空間，但若目標使用者年齡層較廣，建議提高到 12px。
3. `精簡 / 大圖` 切換目前視覺像純文字，操作感偏弱。建議改成真正的 segmented control，並加上目前啟用狀態。
4. 功夫茶品牌圖在單張卡近景中可用，但桌機單店頁若改成寬版，需要重新確認 logo 裁切位置。

## 建議下一步

先處理單店分類桌機版與檢視模式切換：

1. 只有 1 張廠商卡時，桌機改成置中或寬版。
2. `精簡 / 大圖` 改成明確按鈕狀態。
3. 手機版小連結字級由 11px 提升為 12px，圖示維持 16px。
