# Cursor 高層架構審查任務

專案根目錄：

`/Users/caijunchang/Desktop/程式專案資料夾/yangmeilife-生活集拷貝`

## 任務模式

這一輪請只做高層審查與問題歸納，不要修改正式網站檔案。

允許新增或覆寫的唯一檔案：

- `reports/cursor-big-picture-findings.md`

## 目前基準線

- 主分類：11
- 功能總數：65
- 已正式化功能頁：32
- 已正式化廠商頁：11
- 廠商資料筆數：33
- 尚未現代化的本地頁：15

尚未現代化的本地頁集中在：

- `site-core`：`dashboard.html`、`share.html`、`notifications.html`
- `real-estate`：`loan-calc.html`、`investor.html`、`tax-calc.html`、`rental-mgmt.html`
- `leisure`：`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html`
- `vendors-admin`：`vendor-admin.html`、`test-image-upload.html`、`booking.html`
- `health-care`：`hospital-clinic.html`

## 請審查的方向

請找 5 到 10 個方向性問題，不要列小錯字。每個問題要包含：

1. 嚴重度：High / Medium / Low
2. 問題摘要
3. 影響範圍與關聯檔案
4. 為什麼會影響後續維護或使用者體驗
5. 建議下一批修改順序
6. 是否適合交給 Cursor Auto 修改

## 審查重點

- 主架構與資料流是否清楚：`scripts/build-main-structure.mjs`、`data/site-functions.json`、`data/service-pages.json`
- 正式功能頁是否真的方便維護，或仍然太依賴產生器內的硬編碼內容
- 15 個尚未現代化本地頁應該如何排序
- 廠商資料是否已經分層清楚，是否還缺驗證欄位、更新欄位或實際商家來源
- 首頁、搜尋頁、分類頁、功能頁之間的入口是否會讓使用者迷路
- `external-active` 但同時存在本地 `page` 的頁面，是否會造成導覽與搜尋狀態混淆
- 行動版 UI 是否有需要優先輪詢的頁面
- 目前示範資料是否有被誤認為已核實資料的風險

## 可以執行的檢查

```bash
node --check scripts/build-main-structure.mjs
node --check assets/js/service-page.js
node --check assets/js/site-search.js
node -e "const n=require('./data/site-navigation.json'); console.log(n.totals)"
node -e "const p=require('./data/service-pages.json'); console.log(p.pages.length)"
node -e "const v=require('./data/vendors/vendor-categories.json'); console.log(v.categories.length)"
```

也可以閱讀：

- `reports/main-structure.md`
- `reports/folder-classification.md`
- `reports/function-classification.md`
- `reports/page-review.md`
- `docs/CONTENT_UPDATE_GUIDE.md`

## 不要做

- 不要改 `archive/cursor-history/latest/*`
- 不要直接把舊版整頁複製回主目錄
- 不要新增大型框架、套件或建置系統
- 不要把示範資料寫成已核實官方資料
- 不要在這一輪直接改 `index.html` 或任何功能頁
- 不要把審查結果寫進 `reports/main-structure.md`，這個檔案會被產生器覆寫

## 輸出格式

請將結果寫到：

`reports/cursor-big-picture-findings.md`

建議格式：

```markdown
# Cursor 高層架構審查結果

## 摘要

## 方向性問題

### 1. High - 問題標題

- 影響範圍：
- 觀察：
- 風險：
- 建議：
- 是否適合 Cursor Auto：

## 建議修改批次

## 需要人工確認的事項
```
