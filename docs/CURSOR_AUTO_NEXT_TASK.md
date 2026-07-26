# Cursor Auto 下一步任務

專案根目錄：

`/Users/caijunchang/Desktop/程式專案資料夾/yangmeilife-生活集拷貝`

## 目前狀態

- 主架構生成器：`scripts/build-main-structure.mjs`
- 中央功能資料：`data/site-functions.json`
- 正式功能頁資料：`data/service-pages.json`
- 正式功能頁前端資料：`assets/js/service-page-data.js`
- 正式功能頁渲染器：`assets/js/service-page.js`
- 廠商資料：`data/vendors/categories/*`
- 已正式化：
  - `daily-info`：7/7
  - `home-services`：11/11
  - `personal-tools`：8/8
  - `community-content`：6/6
  - 廠商頁：11/11

## 請 Cursor 做的事

1. 不要重構主架構生成器的整體邏輯。
2. 逐頁檢查 `personal-tools` 與 `community-content` 的正式功能頁內容是否有文字不清、按鈕狀態不明、版面溢出或手機不易讀問題。
3. 優先檢查這些頁：
   - `receipt.html`
   - `expense-tracker.html`
   - `second-hand.html`
   - `subsidy.html`
   - `community-board.html`
4. 如果要修改頁面內容，請優先修改 `scripts/build-main-structure.mjs` 裡的 `servicePageEnhancements`，再執行：

```bash
node scripts/build-main-structure.mjs
```

5. 修改後必須驗證：

```bash
node --check scripts/build-main-structure.mjs
node --check assets/js/service-page.js
node --check assets/js/service-page-data.js
```

6. 最後更新 `reports/main-structure.md`，寫清楚改了哪些頁與驗證結果。

## 不要做

- 不要改 `archive/cursor-history/latest/*`。
- 不要直接把舊版整頁複製回主目錄。
- 不要新增大型框架或建置系統。
- 不要把示範資料宣稱成已核實官方資料。
