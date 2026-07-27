# 手機版固定顯示稽核

執行時間：2026-07-02T19:23:57+0800

## 處理目標

- 手機版頁面固定在 viewport 內，不產生左右滑動。
- 固定底部導覽不超出螢幕寬度。
- 固定底部導覽不遮住頁尾內容。
- 產生器輸出的正式功能頁與廠商頁都帶同一套手機寬度保護規則。

## 本批修正

- `index.html`
  - `html` / `body` 加上 `width:100%`、`max-width:100%`、`overflow-x:hidden`。
  - `body` 加上 `overscroll-behavior-x:none`。
  - `main`、`section`、`article`、`header`、`footer`、`nav` 加上 `max-width:100%`。
  - `#particles` 加上 `overflow:hidden` 與 `contain:paint`。
  - 首頁粒子隨機位置從全寬範圍收窄為 `4% - 94%`，避免裝飾點貼到右邊界外。
  - `.bottom-nav` 加上 `left:0`、`right:0`、`width:100%`、`max-width:100vw` 與 safe-area 底部 padding。
- `scripts/build-main-structure.mjs`
  - `pageHead()` 模板加入全站產生頁的手機固定規則。
  - 正式功能頁、廠商頁、分類頁、更新頁重建後都會輸出 `html,body{width:100%;max-width:100%;overflow-x:hidden}`。

## 驗證結果

- 重建：`node scripts/build-main-structure.mjs` 成功。
- 靜態引用掃描：
  - HTML：83
  - 本地引用：534
  - `missingCount=0`
- Playwright 手機全站輪詢：
  - 寬度：390、375、360
  - 載入：83 頁 x 3 = 249 次
  - `issueCount=0`
  - `consoleErrorCount=0`
- 首頁底部固定導覽專項：
  - 390px：導覽 left=0、right=390、bottom=844，無水平溢出，未遮住內容。
  - 375px：導覽 left=0、right=375、bottom=844，無水平溢出，未遮住內容。
  - 360px：導覽 left=0、right=360、bottom=844，無水平溢出，未遮住內容。
