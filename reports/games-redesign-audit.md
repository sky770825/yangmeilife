# 遊戲大廳重做批次

執行時間：2026-07-02T18:26:53+0800

## 重做原因

原本第一階段小遊戲只完成基礎互動，玩法偏薄，較像測試元件。本批直接替換為第二階段新版遊戲組，讓 `games.html` 更接近正式可用的娛樂頁。

## 新版遊戲組

- 路線記憶：先記住楊梅生活地點路線，再照順序點回去；支援關卡、路線長度與分數結算。
- 市集快手：依任務情境快速選出正確補貨或核對項目；支援 6 題一輪、連擊加分與結算。
- 梅花合成：2048 類型合成玩法，加入花芽到生活集的階段標籤、步數、分數與結算。
- 生活快問：用網站維護與資料核實情境做快問快答，答完寫入總積分。

## 修改檔案

- `data/entertainment/games.json`：改為新版四遊戲資料，storage key 升級為 `yangmei_games_v3`。
- `assets/js/entertainment-widgets.js`：重寫 `renderGames()`，加入新版狀態機、分數、最高分、近期紀錄與手機版布局。
- `data/service-page-source.mjs`：`games` 狀態改為「已重做第二階段互動」。
- `assets/js/entertainment-data.js`、`assets/js/service-page-data.js`、`games.html`：由產生器同步更新。

## 驗證結果

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `data/entertainment/*.json`：JSON parse 通過
- `node scripts/build-main-structure.mjs`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`

## Playwright 輪詢

本機網址：`http://127.0.0.1:8028/games.html`

- 桌機 1440 x 1000：無水平溢出
- 手機 390 x 844：無水平溢出
- console / pageerror：`0`

- Runtime data：`storageKey=yangmei_games_v3`
- 四個 tab：路線記憶、市集快手、梅花合成、生活快問
- 路線記憶：可開始、預覽 3 站、進入輸入、完整通關並寫入最高分
- 市集快手：可答題、完整 6 題結算並寫入最高分
- 梅花合成：16 格盤面、方向操作、結算可寫入本機紀錄
- 生活快問：4 題完整作答、完成狀態與分數寫入本機紀錄

## 後續建議

- 已於 2026-07-02T18:45:40+0800 使用 `ui-ux-pro-max` 做第一輪 UI/UX 拋光。
- 後續若要再擴充，優先做一個完整度高的長玩法，而不是回到大量低完成度小遊戲。

## UI/UX 拋光紀錄

使用 skill：`ui-ux-pro-max`

採用重點：

- 觸控目標至少 44px。
- 不只依賴 hover，按鈕需有 active / focus-visible 狀態。
- 成功、錯誤與重置需有即時回饋。
- 動畫使用 transform / opacity，並支援 `prefers-reduced-motion`。
- 音效與震動只用於重要事件，避免每次點擊都觸發。

已完成：

- 新增每日挑戰卡片，依日期輪替指定遊戲。
- 新增每日挑戰加分規則，今天指定遊戲完成後加 `150` 分。
- 新增成功 / 錯誤 / 提示 toast，使用 `aria-live="polite"`。
- 新增音效與震動回饋，限定完成、答對、答錯與重置等事件。
- 新增分數重置流程，必須先點「重置分數」，再點「確認清除」。
- 新增 focus-visible、active scale、hover 狀態與 reduced-motion CSS。

追加驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 驗證桌機 1440 x 1000：每日挑戰卡、toast、重置流程、鍵盤 focus、無水平溢出皆正常
- Playwright 驗證手機 390 x 844：無水平溢出，最小按鈕高度 `44px`
- Playwright 驗證每日挑戰：2026-07-02 指定 `市集快手`，完成後 `bonus=150`，toast 顯示「每日挑戰 +150」
- console / pageerror：`0`

## 遊戲內容深度紀錄

執行時間：2026-07-02T18:57:33+0800

Cursor 指揮：

- 已嘗試用 `cursor agent` 請 Cursor 只產出「遊戲內容深度」規劃。
- Cursor agent 35 秒未回傳，已中止，不讓它修改檔案。
- 已新增 `docs/CURSOR_GAME_DEPTH_TASK.md`，供下一輪 Cursor 直接接續規劃「路線記憶多關卡地圖」。

本批實作：市集快手限時模式。

資料更新：

- `data/entertainment/games.json` 新增 `marketConfig`。
- 市集任務題庫從 6 題擴充到 10 題。
- `marketConfig` 包含：
  - `rounds=8`
  - `timeLimitSeconds=45`
  - `correctBase=90`
  - `streakBonus=20`
  - `fastBonusThresholdMs=3200`
  - `fastBonus=25`
  - `wrongPenalty=35`

互動更新：

- 市集快手新增開始頁與規則說明。
- 開始後顯示倒數秒數、目前題數、連擊與進度條。
- 3.2 秒內答對會顯示「快答」並額外加分。
- 答錯會扣分且中斷連擊。
- 8 題完成後結算到 `yangmei_games_v3`。
- 若市集快手是每日挑戰，完成後仍會套用每日 bonus。

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 桌機驗證：
  - 市集快手開始按鈕存在
  - 規則文案顯示 45 秒、8 題、答錯扣分
  - 開始後顯示秒數與 `第 1/8 題`
  - 答對顯示快答加分
  - 答錯顯示扣分
  - 8 題完成後結算並寫入 `highs.market`
  - 2026-07-02 今日挑戰 bonus `150` 正常套用
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 最小觸控高度 `44px`
- console / pageerror：`0`

## 路線記憶多關卡輪詢紀錄

執行時間：2026-07-02T19:15:05+0800

Cursor 指揮：

- 已嘗試用 `cursor agent` 請 Cursor 只產出「路線記憶多關卡地圖」規劃。
- Cursor agent 35 秒未回傳，已中止；本批未由 Cursor 修改檔案。
- `docs/CURSOR_GAME_DEPTH_TASK.md` 已標記路線記憶批次完成，下一批建議改做生活快問題庫模式。

本批實作：路線記憶多關卡地圖。

資料更新：

- `data/entertainment/games.json` 新增 4 組 `routeLevels`。
- 地點池從 6 筆擴充到 10 筆。
- 每關包含：
  - `pool`
  - `routeLength`
  - `decoyCount`
  - `scoreMultiplier`

互動更新：

- 路線記憶新增地圖關卡卡片。
- 關卡支援已完成、可挑戰、未解鎖狀態。
- 預覽階段只顯示正式路線順序；輸入階段顯示正式路線加干擾選項。
- 通關後會自動解鎖下一張地圖。
- `yangmei_games_v3` 新增 `routeProgress`，保存：
  - `highestLevel`
  - `highestScore`
  - `highestMap`

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 桌機驗證：
  - `routeLevels=4`
  - 初始關卡卡片 4 張
  - 完成第 1 關：`highestLevel=1`、`highestScore=315`
  - 完成第 2 關：`highestLevel=2`、`highestScore=480`
  - 完成後第 3 關顯示可挑戰，第 4 關仍未解鎖
  - 1440 x 1000 無水平溢出
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 關卡地圖轉為 1 欄
  - 最小互動高度 `44px`
- console / pageerror：`0`

## 生活快問題庫模式紀錄

執行時間：2026-07-02T19:32:24+0800

本批實作：生活快問題庫模式。

資料更新：

- `data/entertainment/games.json` 新增 `quizConfig`。
- `data/entertainment/games.json` 新增 4 組 `quizSets`：
  - 資料治理
  - 手機 UI
  - 廠商核實
  - 在地生活
- 題庫總數：16 題。
- 保留原 `quizQuestions` 作為 fallback。

互動更新：

- 生活快問改為先選題庫再開始。
- 每組題庫顯示難度、題數與用途描述。
- 答題中顯示題目進度與本輪分數。
- 完成後顯示正確率、分數、錯題回顧。
- 全對可套用 `perfectBonus=80`。
- `yangmei_games_v3` 新增 `quizProgress`，保存：
  - `attempts`
  - `bestAccuracy`
  - `bestScore`
  - `bestSet`

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 桌機驗證：
  - `quizSets=4`
  - 題庫卡片 4 張
  - 完成「資料治理」題庫，故意答錯 1 題
  - 正確率 `75%`
  - 錯題回顧顯示 1 筆
  - `quizProgress.bestAccuracy=75`
  - `quizProgress.bestScore=300`
  - 1440 x 1000 無水平溢出
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 完成「手機 UI」題庫，4/4 全對
  - 正確率 `100%`
  - 分數 `480`，含全對 bonus
  - `quizProgress.bestAccuracy=100`
  - `quizProgress.bestScore=480`
  - 390 x 844 無水平溢出
  - 題庫卡片轉為 1 欄
  - 最小互動高度 `44px`
- console / pageerror：`0`

## 梅花合成任務模式紀錄

執行時間：2026-07-02T19:58:07+0800

本批實作：梅花合成任務模式。

資料更新：

- `data/entertainment/games.json` 新增 `mergeConfig`。
- `data/entertainment/games.json` 新增 4 組 `mergeMissions`：
  - 花束暖身
  - 市集攤位
  - 生活圈串接
  - 大楊梅品牌
- 每組任務包含目標方塊、步數限制、任務獎勵與描述。
- 保留原 `mergeTiles` 作為方塊階段標籤。

互動更新：

- 梅花合成改為先選任務再開始。
- 任務中顯示目標方塊、剩餘步數、目前最高方塊、本輪分數與任務進度。
- 完成目標方塊後自動結算任務獎勵、完成獎勵與剩餘步數加分。
- 步數用完或盤面無可移動方塊時會進入未通過狀態，不灌總積分。
- 支援鍵盤方向鍵與手機方向按鈕。
- `yangmei_games_v3` 新增 `mergeProgress`，保存：
  - `completed`
  - `highestTile`
  - `bestScore`
  - `bestMoves`
  - `bestMission`
  - `completedMissions`

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 桌機驗證：
  - `mergeMissions=4`
  - `mergeConfig.modeLabel=任務模式`
  - 完成「花束暖身」任務
  - 完成步數 `9`
  - 任務結算 `344` 分
  - `mergeProgress.completed=1`
  - `mergeProgress.highestTile=16`
  - `mergeProgress.bestMoves=9`
  - `mergeProgress.bestScore=344`
  - 鍵盤方向鍵可推動棋盤，剩餘步數從 14 變為 11
  - 1440 x 1000 無水平溢出
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 任務卡片轉為 1 欄
  - 合成區轉為 1 欄
  - 棋盤寬度 `324px`
  - 方向按鈕 4 個
  - 手機方向按鈕可推動棋盤，剩餘步數從 14 變為 12
  - 最小互動高度 `44px`
- console / pageerror：`0`

## 遊戲成就徽章批次紀錄

執行時間：2026-07-02T20:20:21+0800

本批實作：遊戲成就與視覺徽章。

資料更新：

- `data/entertainment/games.json` 新增 `badgeConfig`。
- `data/entertainment/games.json` 新增 10 組 `achievements`：
  - 生活起步
  - 每日出勤
  - 在地積分
  - 路線開拓
  - 全城熟路
  - 市集快手
  - 花束成形
  - 品牌合成
  - 快問通過
  - 全對達人
- 成就條件涵蓋完成局數、總積分、每日挑戰、路線關卡、市集最高分、梅花合成最高方塊與生活快問正確率。

互動更新：

- 遊戲大廳新增成就徽章牆。
- 成就牆顯示已解鎖數、總進度、10 張徽章卡片與每張徽章的進度狀態。
- 徽章使用內嵌 SVG 圖形，不使用 emoji。
- 解鎖狀態會寫入 `yangmei_games_v3.achievements.unlocked`。
- 重置分數會同步清除成就解鎖紀錄。

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Playwright 桌機初始驗證：
  - 成就狀態 `0/10`
  - 徽章卡片 10 張
  - SVG 圖形 10 個
  - 桌機徽章牆為 3 欄
  - 1440 x 1000 無水平溢出
  - 最小互動高度 `44px`
- Playwright 桌機解鎖驗證：
  - 測試 localStorage 進度可解鎖 `10/10`
  - `achievements.unlocked` 寫回 10 個 id
  - 10 張徽章皆顯示已解鎖
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 徽章牆轉為 1 欄
  - 徽章卡寬度 `290px`
  - SVG 圖形 10 個
  - 最小互動高度 `44px`
- Playwright 重置驗證：
  - 連點重置確認後成就回到 `0/10`
  - `achievements.unlocked` 清空
  - `total=0`
  - `played=0`
- console / pageerror：`0`

## 遊戲視覺美術資產精修批次紀錄

執行時間：2026-07-02T20:54:27+0800

本批實作：四個核心遊戲的資料驅動 SVG 視覺資產。

資料更新：

- `data/entertainment/games.json` 新增 `visualConfig`。
- 路線記憶新增 10 個地點的圖示與色票設定。
- 市集快手新增 40 個任務選項物件的圖示與色票設定。
- 梅花合成新增 11 個方塊階段的圖示與色票設定。
- 生活快問新增 4 組題庫徽章設定。

互動更新：

- 路線記憶預覽與輸入階段改為路線節點卡，已輸入節點會顯示完成狀態。
- 市集快手任務與選項改為帶 SVG 物件圖示的選擇卡。
- 梅花合成任務卡與棋盤方塊改為帶 SVG 階段圖形。
- 生活快問題庫卡改為主題徽章版面。
- SVG helper 集中在 `assets/js/entertainment-widgets.js`，所有遊戲內圖示固定 `24x24`，不使用 emoji 或外部套件。

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- `node scripts/build-main-structure.mjs`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Runtime data：
  - `visualConfig.route.locations=10`
  - `visualConfig.market.items=40`
  - `visualConfig.merge.tiles=11`
  - `visualConfig.quiz.sets=4`
- Playwright 桌機驗證：
  - 1440 x 1000 無水平溢出
  - 路線預覽節點 3 張，SVG 圖示 3 個
  - 路線輸入選項 5 個，選項 SVG 圖示 5 個
  - 市集選項 4 個，選項 SVG 圖示 4 個
  - 梅花合成任務 4 張，棋盤 16 格，開局非空方塊 2 格且都有 SVG 圖示
  - 生活快問題庫 4 張，題庫 SVG 圖示 4 個
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 路線節點最右側 `357px`，未超出 `390px` viewport
  - 梅花合成棋盤寬度 `324px`
  - 題庫卡片轉為 1 欄，grid columns `324px`
  - 最小互動高度 `44px`
- console / pageerror：`0`

## 遊戲動效與節奏精修批次紀錄

執行時間：2026-07-03T02:45:10+0800

本批實作：四個核心遊戲的一次性短動效與操作回饋節奏。

資料更新：

- `data/entertainment/games.json` 新增 `motionConfig`。
- `motionConfig.durationMs` 記錄 screen、feedback、tile、shake 等節奏基準。
- `motionConfig.rules` 明確要求 transform / opacity、避免 layout shift、支援 reduced-motion。

互動更新：

- `assets/js/entertainment-widgets.js` 新增一次性 `motionCue`，render 完成後立即清除，避免倒數或 toast 自動重繪時反覆播放動畫。
- 路線記憶新增路線生成、答對節點、答錯與通關結算短動效。
- 市集快手新增開始、答對、答錯、結算短動效，並在倒數 10 秒以下啟用急迫狀態。
- 梅花合成新增新方塊、移動、合併、卡住與任務結算短動效。
- 生活快問新增開始、答對、答錯與完成回顧短動效。
- 所有新增動畫使用 transform / opacity；`prefers-reduced-motion: reduce` 會停用 animation 與 transition。

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- `node scripts/build-main-structure.mjs`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Runtime data：
  - `motionConfig.modeLabel=動效節奏`
  - `motionConfig.durationMs.feedback=240`
  - `motionConfig.rules=3`
- Playwright 桌機驗證：
  - 1440 x 1000 無水平溢出
  - 路線生成觸發 `yw-rise`
  - 路線答對節點 1 個，觸發 `yw-confirm`
  - 市集答對觸發 `yw-confirm`，連擊顯示 `連擊 1`
  - 梅花合成開局新方塊 2 格，5 步完成「花束暖身」，`mergeProgress.completed=1`、`highestTile=16`、`bestMoves=5`
  - 生活快問完成一組題庫，`quizProgress.attempts=1`、`bestAccuracy=100`、`bestScore=480`
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 路線、市集、合成、快問動效 cue 均可觸發
  - 梅花合成棋盤寬度 `327px`
  - 5 步完成「花束暖身」，`mergeProgress.completed=1`
  - 生活快問完成一組題庫，`bestAccuracy=100`
  - 最小互動高度 `44px`
- Playwright reduced-motion 驗證：
  - `prefers-reduced-motion: reduce` match 為 `true`
  - 動效 cue 仍保留狀態文字與 data attribute
  - `animationName=none`
  - `transitionDuration=0s`
  - 無水平溢出
- console / pageerror：`0`

## 遊戲平衡與難度調整批次紀錄

執行時間：2026-07-03T03:22:45+0800

本批實作：調整四個核心遊戲的分數區間、每日挑戰 bonus、任務步數與日期重置邏輯，避免單一玩法爆分並讓不同遊戲投入時間更接近。

資料更新：

- `data/entertainment/games.json` 新增 `balanceConfig`，記錄 `平衡版本 2026-07-03`、目標分數區間與長期維護規則。
- 每日挑戰 bonus 由 `150` 調為 `120`，避免每日加分高於入門局核心分數的一半。
- 市集快手調整為 `correctBase=70`、`streakBonus=12`、`fastBonusThresholdMs=3000`、`fastBonus=18`、`wrongPenalty=45`。
- 生活快問調整為 `correctScore=110`、`perfectBonus=120`，全對分數更有感但不取代長玩法。
- 梅花合成任務步數與獎勵調整為：花束暖身 `16/140`、市集攤位 `34/260`、生活圈串接 `58/470`、大楊梅品牌 `78/740`。
- 路線記憶後段關卡倍率調整為：親子生活線 `1.25`、公共服務線 `1.55`、大楊梅生活圈 `1.9`。

互動更新：

- `assets/js/entertainment-widgets.js` 的 `todayKey()` 從 UTC 日期改為本機日期，修正台灣時間 00:00 到 08:00 仍可能沿用前一天每日挑戰的問題。
- `data/service-page-source.mjs` 已同步更新遊戲頁摘要、重點、檢查清單與資料狀態，將下一批維護重點指向廠商資料正式化。
- `docs/CURSOR_GAME_DEPTH_TASK.md` 已補上平衡批次完成狀態與下一批 Cursor 任務：廠商資料正式化。

驗證：

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- `node scripts/build-main-structure.mjs`：通過
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`
- Runtime data：
  - `dailyChallenge.bonus=120`
  - `balanceConfig.modeLabel=平衡版本 2026-07-03`
  - 路線分數：`315`、`500`、`752`、`1083`
  - 市集快手全對快答：`1136`
  - 生活快問全對：`560`
- Playwright 桌機驗證：
  - 1440 x 1000 無水平溢出
  - `todayKey=2026-07-03`
  - `dailyLabel=生活快問`
  - `balanceBands.route=315-1083`
  - `balanceBands.market=560-1136`
  - `balanceBands.merge=400-1400+`
  - `balanceBands.quiz=330-560`
  - 完成第一個路線關卡後 `highestLevel=1`、`highestScore=315`
  - 市集快手全對快答後 `marketHigh=1136`
  - 梅花合成 5 步完成「花束暖身」，`mergeProgress.completed=1`、`highestTile=16`、`bestScore=440`
  - 生活快問全對完成，`quizProgress.bestAccuracy=100`、`quizHigh=560`
  - 最小互動高度 `44px`
- Playwright 手機驗證：
  - 390 x 844 無水平溢出
  - 同一組平衡參數與分數結果可重現
  - 最小互動高度 `44px`
- Playwright 每日挑戰 bonus 驗證：
  - 手機 390 x 844 完成今日「生活快問」全對
  - 原始快問分數 `560`
  - 今日挑戰 bonus `120`
  - 最終總分與快問最高分 `680`
  - `daily.date=2026-07-03`
- console / pageerror：`0`
