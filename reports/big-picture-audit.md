# 高層架構審查與下一批工作

審查時間：2026-07-02T17:13:04+0800

## 目前基準線

- 主分類：11
- 功能總數：65
- 已正式化功能頁：47
- 已正式化廠商頁：11
- 廠商資料筆數：33
- 尚未現代化的本地頁：0

已正式化區域：

- `daily-info`：7/7
- `home-services`：11/11
- `personal-tools`：8/8
- `community-content`：6/6
- `site-core`：5/5
- `real-estate`：本地頁 5/5，純外部入口 3
- `leisure`：4/4
- `vendors-admin`：本地頁 3/3，純外部入口 1
- `health-care`：本地頁 1/1，純外部入口 1
- 廠商分類頁：11/11

尚未現代化的本地頁：

- 無。

## 方向性問題

### 1. High - 已處理第一階段：正式功能頁內容已從產生器抽出

- 影響範圍：`scripts/build-main-structure.mjs`、`data/service-pages.json`、`assets/js/service-page-data.js`
- 觀察：原本 `servicePageEnhancements` 位於產生器內；本輪已抽成 `data/service-page-source.mjs`，產生器只 import 來源並輸出 `data/service-pages.json`。
- 風險：第一階段已降低產生器修改風險；後續若要給非工程人員維護，仍可再拆成 JSON 或分分類資料檔。
- 已處理：已補 `dataStatus`、`dataReadiness`、`verificationStatus`、`sourceNote`、`updatedAt` 等資料可信度欄位，並在正式功能頁顯示展示資料提示。
- 是否適合 Cursor Auto：下一步不需重複補欄位，可改審查欄位命名一致性與哪些頁面可升級為「人工維護」或「已接資料源」。

### 2. High - 本地頁已全部套入新版資料流

- 影響範圍：網站核心、房產、娛樂、廠商後台、醫療照護。
- 觀察：`daily-info`、`home-services`、`personal-tools`、`community-content`、`site-core`、`real-estate`、`leisure`、`vendors-admin`、`health-care` 的本地頁已全部改走新版正式功能頁資料流。
- 風險：新版 UI 和舊版頁面之間的跳轉風險已降低；互動深化第一階段已完成，但完整舊版遊戲引擎、占卜資料拆檔、MBTI 結果資料庫與金句來源核實仍需後續深化。
- 已處理：跨入口 UI 輪詢已完成，83 頁在桌機與手機共 166 次載入檢查後 `issueCount=0`；娛樂頁互動第一階段也已完成，詳見 `reports/interaction-depth-audit.md`。
- 建議：下一批依使用價值排序，把已接互動的內嵌資料拆成正式資料檔，並挑選舊版遊戲引擎分批移植。
- 是否適合 Cursor Auto：適合先做跨頁問題盤點；完整互動模組重建需分頁審查。

### 3. High - `external-active` 與本地 `page` 的狀態語意混在一起

- 影響範圍：`data/site-functions.json`、搜尋頁、分類頁、房產功能。
- 觀察：例如 `loan-calc.html` 同時有本地頁與外部入口，狀態為 `external-active`。這會讓「是否需要現代化」與「點擊時去哪裡」兩件事混在一起。
- 風險：搜尋結果、分類頁、首頁卡片容易出現錯誤狀態或錯誤連結。
- 已處理第一階段：`data/site-functions.json` 已新增 `implementationStatus`、`targetType`、`externalUrl`、雙入口欄位。
- 已處理第二階段：產生器已改用 `targetType` 與 `primaryTarget` 決定搜尋頁、分類頁與更新檔主連結；`kungfu-tea-live`、`food-truck-live` 改為站內正式廠商頁優先，外部部署為次入口；`loan-calc-external` 保持外部工具優先，站內橋接頁為次入口。
- 是否適合 Cursor Auto：雙入口路由已完成，下一步可改審查跨頁 UI 流程、搜尋結果與雙入口標籤一致性。

### 4. Medium - 產生器會覆寫 `reports/main-structure.md`

- 影響範圍：`reports/main-structure.md`、`scripts/build-main-structure.mjs`
- 觀察：主結構報告是產生器輸出。若把人工審查、Cursor 狀態或驗證結果直接寫入此檔，下一次重建可能被覆蓋。
- 風險：工作紀錄遺失，Cursor Auto 可能誤以為更新已保留。
- 建議：`reports/main-structure.md` 只保留生成摘要；人工審查放在 `reports/big-picture-audit.md`；Cursor 審查放在 `reports/cursor-big-picture-findings.md`。
- 是否適合 Cursor Auto：適合按文件邊界執行。

### 5. Medium - 已處理第一階段：廠商資料已補核實與更新欄位

- 影響範圍：`data/vendors/categories/*/vendors.json`、`data/vendors/categories/*/updates.json`、11 個廠商頁。
- 觀察：每個廠商分類與廠商紀錄已輸出 `verified`、`needsVerification`、`verificationStatus`、`dataReadiness`、`dataSource`、`sourceNote`、`lastVerifiedAt` 等欄位。
- 風險：第一階段已避免把示範商家當成核實商家；後續實際商家電話、地址、照片、授權仍需人工核實。
- 建議：下一批先檢查廠商分類命名、排序與資料欄位一致性，再開始補真實商家。
- 是否適合 Cursor Auto：適合做欄位一致性審查；實際商家核實需要人工。

### 6. Medium - 已處理第一階段：正式功能頁互動深度開始補齊

- 影響範圍：`receipt.html`、`expense-tracker.html`、`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 等 47 個正式功能頁。
- 觀察：目前頁面已經有新版 UI、卡片、更新清單與部分互動模組；本輪已先補齊娛樂頁第一階段互動。
- 風險：使用者仍可能期待完整舊版遊戲、真實查詢、資料儲存、送出表單或官方 API 連線。
- 已處理：正式功能頁已新增 `dataStatus`，目前預設標示為「展示資料 / 待核實」；`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 已接入基礎互動模組並通過桌機 / 手機輪詢。
- 是否適合 Cursor Auto：下一步適合審查哪些互動資料應拆到 `data/`，以及哪些舊版功能值得完整移植。

### 7. Medium - UI 輪詢應該聚焦跨入口體驗，而不是只看單頁

- 影響範圍：`index.html`、`search.html`、`pages/index.html`、`pages/<category>/index.html`、正式功能頁。
- 觀察：目前已抽查幾個功能頁，但還沒有完整檢查「首頁到分類到功能頁再回搜尋」的跨頁流程。
- 風險：即使單頁可用，整站導覽仍可能有重複入口、狀態標籤不一致或手機版掃描困難。
- 建議：下一輪用桌機與手機兩種尺寸巡檢首頁、搜尋、分類總覽、4 個正式功能頁與 2 個廠商頁。
- 是否適合 Cursor Auto：適合先列問題；實際視覺判斷仍需要人工審查。

## 建議修改批次

1. 資料治理批次：已完成 `servicePageEnhancements` 抽出、資料可信度欄位與 `external-active` / 本地頁狀態拆分；剩餘重點是資料檔拆分與欄位命名一致性。
2. 核心與房產批次：已完成 `dashboard.html`、`share.html`、`notifications.html`、`loan-calc.html`、`investor.html`、`tax-calc.html`、`rental-mgmt.html`。
3. 廠商與後台批次：已完成 `vendor-admin.html`、`booking.html`、`test-image-upload.html`，並確認圖片上傳與合作資料責任邊界。
4. 醫療與娛樂批次：已完成 `hospital-clinic.html`、`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html`，本地橋接頁已歸零。
5. 輪詢驗證批次：已完成桌機與手機尺寸檢查首頁、搜尋、分類頁、正式功能頁與廠商頁，詳見 `reports/cross-page-ui-audit.md`。
6. 互動深化批次：已完成第一階段，`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 已有可操作互動。
7. 互動資料治理批次：已完成 `data/entertainment/*.json` 拆檔與 `assets/js/entertainment-data.js` runtime 輸出。
8. 遊戲重做批次：已完成 `games.html` 第二階段重做，改為路線記憶、市集快手、梅花合成與生活快問。
9. 遊戲 UI/UX 拋光批次：已用 `ui-ux-pro-max` 補上每日挑戰、toast、音效震動、focus/active/reduced-motion、重置分數流程與手機觸控尺寸。
10. 遊戲內容深度批次：已完成市集快手限時模式、路線記憶多關卡地圖、生活快問題庫模式、梅花合成任務模式、遊戲成就徽章批次、遊戲視覺美術資產精修批次、遊戲動效節奏精修批次與遊戲平衡難度調整批次；下一步建議做廠商資料正式化批次。

## Cursor 狀態

- 已建立 `docs/CURSOR_BIG_PICTURE_AUDIT.md`，可交給 Cursor Auto 做高層審查。
- Terminal 端 `cursor agent --help` 可執行。
- 前一輪 `cursor agent` 執行任務書時 20 秒內未回傳，已超時中止，未修改檔案。
- 已完成遊戲平衡與難度調整批次，並更新 `docs/CURSOR_GAME_DEPTH_TASK.md` 指向下一批廠商資料正式化批次。

## 下一步建議

本地橋接頁已歸零，跨頁 UI 輪詢已完成，娛樂頁互動第一階段、互動資料治理、遊戲重做、UI/UX 拋光、市集快手限時模式、路線記憶多關卡地圖、生活快問題庫模式、梅花合成任務模式、遊戲成就徽章批次、遊戲視覺美術資產精修批次、遊戲動效節奏精修批次與遊戲平衡難度調整批次也已完成。下一步建議做「廠商資料正式化批次」：盤點 11 個廠商分類的資料檔、更新檔、核實狀態、缺電話、缺地址與缺來源清單，避免示範商家被誤標為正式核實資料。

## 執行紀錄

- 2026-07-02：已先處理資料治理批次的第一步，將 `servicePageEnhancements` 從 `scripts/build-main-structure.mjs` 抽出為 `data/service-page-source.mjs`。產生器仍輸出 `data/service-pages.json` 與 `assets/js/service-page-data.js`，但正式功能頁內容的維護入口已移到獨立資料檔。
- 2026-07-02：完成資料可信度第一階段，正式功能頁輸出 `dataStatus`，廠商分類與廠商資料輸出 `verified`、`needsVerification`、`verificationStatus`、`sourceNote` 等欄位；正式功能頁與廠商頁會顯示展示資料 / 待核實提示。
- 2026-07-02：已用 Playwright 驗證 `receipt.html` 與 `beauty-skin.html`。`receipt.html` 顯示「展示資料 · 待核實」與 `data/service-page-source.mjs`；`beauty-skin.html` 顯示廠商資料提示，3 張商家卡片皆顯示「待核實」，console 無錯誤。
- 2026-07-02：完成狀態與路由語意拆分第一階段。`data/site-functions.json` 新增 `implementationStatus`、`targetType`、`externalUrl`、`primaryTarget`、`secondaryTargetType`、`secondaryTargetUrl`；`booking` 描述改為已有新版橋接頁。
- 2026-07-02：完成雙入口路由第二階段。搜尋頁、分類頁與 `updates.json` 已改由 `targetType` / `primaryTarget` 決定主入口；`kungfu-tea-live`、`food-truck-live` 主入口改為站內頁，外部部署保留為次入口；`loan-calc-external` 保持外部主入口並保留 `loan-calc.html` 次入口。已重建主架構並通過 JS 語法檢查與全站 HTML 連結掃描。
- 2026-07-02：完成核心與房產批次。`dashboard`、`share`、`notifications`、`loan-calc-external`、`investor`、`tax-calc`、`rental-mgmt` 已加入 `data/service-page-source.mjs`，正式功能頁總數提升為 39；分類頁與搜尋頁均顯示「正式功能頁」。已用 Playwright 驗證 `dashboard.html`、`tax-calc.html`、`loan-calc.html`、`rental-mgmt.html` 與 `search.html`，console 無錯誤，手機寬度 `tax-calc.html` 無水平溢出。
- 2026-07-02：完成廠商後台與醫療批次。`vendor-admin`、`test-image-upload`、`booking`、`hospital-clinic` 已加入 `data/service-page-source.mjs`，正式功能頁總數提升為 43；`hospital-clinic` 保留 13 筆舊版醫療資源卡並標示「醫療資料待核實」。已用 Playwright 驗證 `vendor-admin.html`、`test-image-upload.html`、`booking.html`、`hospital-clinic.html` 與 `search.html`，console 無錯誤，手機寬度 `hospital-clinic.html` 無水平溢出。
- 2026-07-02：完成娛樂批次。`games`、`fortune`、`mbti`、`daily-quote` 已加入 `data/service-page-source.mjs`，正式功能頁總數提升為 47，本地橋接頁歸零；舊版互動引擎與資料來源已寫入各頁處理清單。已用 Playwright 驗證 `games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 與 `search.html`，console 無錯誤，手機寬度 `fortune.html` 無水平溢出。
- 2026-07-02：完成全站跨頁 UI 輪詢。用 Playwright 對 83 頁進行桌機 1440 x 1000 與手機 390 x 844 共 166 次載入檢查；初次發現 13 個手機水平溢出與 1 個內容偏薄分類頁，已修正更新表格、廠商頁長路徑與分類頁維護區塊。最終 `issueCount=0`，並完成首頁到分類、分類到功能頁、搜尋到功能頁、分類到廠商頁等跨頁流程驗證。詳見 `reports/cross-page-ui-audit.md`。
- 2026-07-02：完成互動深化第一階段。新增 `assets/js/entertainment-widgets.js`，並由產生器掛入正式功能頁；`games.html` 已有 4 個基礎遊戲互動，`fortune.html` 已有今日運勢、三張塔羅、保存紀錄，`mbti.html` 已可完整作答 20 題並保存結果，`daily-quote.html` 已有分類搜尋、隨機、收藏與分享文字。已用 Playwright 驗證四頁桌機與手機均無水平溢出，console / pageerror 為 0；正式站 83 個 HTML、487 個本地引用掃描 `missingCount=0`。詳見 `reports/interaction-depth-audit.md`。
- 2026-07-02：完成互動資料治理批次。新增 `data/entertainment/README.md`、`games.json`、`fortune.json`、`mbti.json`、`daily-quotes.json` 與 `manifest.json`；產生器會輸出 `assets/js/entertainment-data.js`，四個娛樂頁先載入資料再載入互動腳本。`assets/js/entertainment-widgets.js` 已改為讀取 `window.YANGMEI_ENTERTAINMENT_DATA`。已用 Playwright 驗證四頁 runtime data 存在、互動正常、桌機與手機均無水平溢出，console / pageerror 為 0；正式站 83 個 HTML、534 個本地引用掃描 `missingCount=0`。詳見 `reports/entertainment-data-governance.md`。
- 2026-07-02：完成遊戲重做批次。`games.html` 從第一階段基礎小遊戲改成路線記憶、市集快手、梅花合成與生活快問；`data/entertainment/games.json` 升級為 `yangmei_games_v3`，`assets/js/entertainment-widgets.js` 重寫遊戲狀態機、分數、最高分與近期紀錄。已用 Playwright 驗證四個遊戲可操作，路線記憶與市集快手可完整通關結算，梅花合成與生活快問可寫入本機紀錄；桌機與手機均無水平溢出，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md`。
- 2026-07-02：完成遊戲 UI/UX 拋光批次。已使用 `ui-ux-pro-max` 產生設計系統與 UX 檢查，並在 `games.html` 補上每日挑戰、每日加分、toast、音效震動、雙擊確認重置分數、focus-visible、active 狀態與 `prefers-reduced-motion`。Playwright 驗證桌機與手機無水平溢出，手機最小按鈕高度 `44px`，今日挑戰指定 `市集快手` 完成後成功套用 `bonus=150`；console / pageerror 為 0。詳見 `reports/games-redesign-audit.md`。
- 2026-07-02：完成遊戲內容深度批次。已嘗試指揮 Cursor agent 規劃，35 秒未回傳後中止，改由本端直接實作市集快手限時模式。`data/entertainment/games.json` 新增 `marketConfig` 並把市集題庫擴充到 10 題；`assets/js/entertainment-widgets.js` 新增 45 秒倒數、8 題目標、連擊、快答加分、錯誤扣分與限時結算。Playwright 驗證市集快手可完整 8 題結算，今日挑戰 bonus `150` 正常套用；桌機與手機無水平溢出，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-02：完成路線記憶多關卡輪詢批次。已再次指揮 Cursor agent 規劃，35 秒未回傳後中止，改由本端直接實作。`data/entertainment/games.json` 新增 4 組 `routeLevels` 並把地點池擴充到 10 筆；`assets/js/entertainment-widgets.js` 新增關卡地圖、解鎖狀態、干擾選項、完成進度與 `routeProgress` 持久化。Playwright 驗證路線記憶可連續完成前 2 關，`highestLevel=2`、`highestScore=480`；桌機與手機無水平溢出，手機關卡地圖為 1 欄，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-02：完成生活快問題庫模式批次。`data/entertainment/games.json` 新增 `quizConfig` 與 4 組 `quizSets`，題庫含資料治理、手機 UI、廠商核實與在地生活共 16 題；`assets/js/entertainment-widgets.js` 新增題庫選擇、答題進度、正確率、錯題回顧與 `quizProgress` 持久化。Playwright 驗證資料治理題庫 75% 正確率與錯題回顧、手機 UI 題庫 100% 正確率與全對 bonus `480` 分；桌機與手機無水平溢出，最小互動高度 `44px`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-02：完成梅花合成任務模式批次。`data/entertainment/games.json` 新增 `mergeConfig` 與 4 組 `mergeMissions`，任務包含花束暖身、市集攤位、生活圈串接與大楊梅品牌；`assets/js/entertainment-widgets.js` 新增任務選擇、目標方塊、步數限制、完成獎勵、失敗判定、鍵盤方向鍵、手機方向控制與 `mergeProgress` 持久化。Playwright 驗證桌機完成「花束暖身」任務，9 步、344 分、`mergeProgress.completed=1`；手機 390 x 844 任務卡與合成區皆為 1 欄，無水平溢出，最小觸控高度 `44px`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-02：完成遊戲成就徽章批次。`data/entertainment/games.json` 新增 `badgeConfig` 與 10 組 `achievements`；`assets/js/entertainment-widgets.js` 新增成就判定、`achievements.unlocked` 持久化、進度條、SVG 徽章牆與重置清除。Playwright 驗證乾淨狀態為 `0/10`、10 張 SVG 徽章，測試進度可解鎖 `10/10` 並寫回 localStorage；手機 390 x 844 為 1 欄、無水平溢出、最小觸控高度 `44px`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-02：完成遊戲視覺美術資產精修批次。`data/entertainment/games.json` 新增 `visualConfig`，集中維護路線地點、市集物件、合成方塊與題庫徽章的 SVG 圖示與色票；`assets/js/entertainment-widgets.js` 新增共用 SVG helper，並把路線預覽/輸入、市集選項、梅花合成任務與棋盤、生活快問題庫卡都換成資料驅動 SVG 視覺。Playwright 驗證桌機 1440 x 1000 與手機 390 x 844 無水平溢出，手機題庫卡 1 欄，梅花棋盤寬度 `324px`，最小互動高度 `44px`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-03：完成遊戲動效與節奏精修批次。`data/entertainment/games.json` 新增 `motionConfig`；`assets/js/entertainment-widgets.js` 新增一次性 `motionCue`，讓路線生成/答對/通關、市集答題/倒數、梅花合成新方塊/移動/合併/結算、生活快問答題/回顧都有短動效。所有新增動畫只使用 transform / opacity，並在 `prefers-reduced-motion: reduce` 下停用 animation 與 transition。Playwright 驗證桌機 1440 x 1000 與手機 390 x 844 無水平溢出，reduced-motion 下 `animationName=none`、`transitionDuration=0s`，梅花合成可 5 步完成「花束暖身」並寫入 `mergeProgress.completed=1`，生活快問可完成一組題庫並寫入 `bestAccuracy=100`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
- 2026-07-03：完成遊戲平衡與難度調整批次。`data/entertainment/games.json` 新增 `balanceConfig`，每日挑戰 bonus 調為 `120`，市集快手全對快答從過高分數壓到 `1136`，路線記憶四關分數為 `315/500/752/1083`，生活快問全對為 `560`，梅花合成「花束暖身」放寬到 `16` 步並可用測試路徑 5 步完成。`assets/js/entertainment-widgets.js` 另修正每日重置日期，改用本機日期避免台灣時間 00:00 到 08:00 沿用前一天。Playwright 驗證桌機 1440 x 1000 與手機 390 x 844 無水平溢出，最小互動高度 `44px`，今日「生活快問」全對可得到原始 `560` 加每日 bonus `120`，最終 `680`，console / pageerror 為 0。詳見 `reports/games-redesign-audit.md` 與 `docs/CURSOR_GAME_DEPTH_TASK.md`。
