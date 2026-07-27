# Cursor 任務書：遊戲內容深度下一批

目標：在 `games.html` 既有新版遊戲大廳上，繼續加深單一玩法，不要回到大量低完成度小遊戲。

## 目前基準

- `data/entertainment/games.json` 是遊戲設定入口。
- `assets/js/entertainment-widgets.js` 是互動邏輯。
- `assets/js/entertainment-data.js` 由 `node scripts/build-main-structure.mjs` 產生。
- `games.html` 已有四個遊戲：
  - 路線記憶
  - 市集快手
  - 梅花合成
  - 生活快問
- 市集快手已完成 45 秒限時、8 題、連擊、快答加分、錯誤扣分與每日挑戰 bonus。
- 路線記憶已完成 4 張地圖、多關卡解鎖、干擾選項與最高關卡紀錄。
- 生活快問已完成 4 組題庫、正確率、錯題回顧與題庫最高紀錄。
- 梅花合成已完成 4 組任務、目標方塊、步數限制、完成獎勵、鍵盤方向鍵與手機方向控制。
- 成就徽章已完成 10 組條件、解鎖進度、SVG 徽章與 `achievements.unlocked` 持久化。
- 遊戲視覺美術資產已完成資料驅動 `visualConfig`、路線地圖節點、市集物件圖示、梅花合成方塊圖形與快問題庫徽章。
- 遊戲動效與節奏已完成 `motionConfig`、一次性短動效、倒數急迫狀態與 `prefers-reduced-motion` 降級。
- 遊戲平衡與難度已完成 `balanceConfig`、每日挑戰 bonus、路線倍率、市集快答、合成任務與快問獎勵調整。

## 已完成批次

「路線記憶多關卡地圖」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `routeLevels`。
- 每關包含地點池、路線長度、干擾選項數、分數倍率。
- `assets/js/entertainment-widgets.js` 的 route 狀態改為讀取 `routeLevels`。
- UI 顯示目前關卡、地圖名稱、路線長度、完成進度。
- 完成關卡後保存最高關卡與最高分。

「生活快問題庫模式」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `quizConfig` 與 4 組 `quizSets`。
- 題庫已拆成「資料治理」、「手機 UI」、「廠商核實」、「在地生活」。
- 支援選題庫、答題進度、錯題回顧與本輪正確率。
- 完成後保存最高正確率、最高分與最佳題庫到 `quizProgress`。
- 保留 `yangmei_games_v3`，並保留既有 `routeProgress`、`market`、`merge`、`quiz` 分數。

「梅花合成任務模式」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `mergeConfig` 與 4 組 `mergeMissions`。
- 每組任務包含目標方塊、步數限制、任務獎勵與描述。
- `assets/js/entertainment-widgets.js` 的 merge 狀態改為任務選擇、任務進行與結算三段。
- 支援鍵盤方向鍵與手機方向按鈕。
- 完成後保存最高方塊、最高分、最佳步數與已完成任務到 `mergeProgress`。
- 保留 `yangmei_games_v3`，並保留既有 `routeProgress`、`quizProgress`、`market`、`merge`、`quiz` 分數。

「遊戲成就與視覺徽章批次」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `badgeConfig` 與 10 組 `achievements`。
- 成就條件涵蓋完成局數、總積分、每日挑戰、路線關卡、市集最高分、梅花合成最高方塊與生活快問正確率。
- `assets/js/entertainment-widgets.js` 新增成就判定、解鎖持久化、進度條與 SVG 徽章牆。
- 成就解鎖寫入 `yangmei_games_v3.achievements.unlocked`。
- 保留 `yangmei_games_v3`，並保留既有 `routeProgress`、`quizProgress`、`mergeProgress` 與總分紀錄。

「遊戲視覺美術資產精修批次」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `visualConfig`。
- 路線記憶新增資料驅動地點圖示與路線節點卡。
- 市集快手新增任務物件 SVG 圖示，正確與干擾選項都可由資料檔維護。
- 梅花合成新增各階段方塊圖形與色票，任務卡與棋盤同步使用。
- 生活快問新增題庫主題徽章。
- `assets/js/entertainment-widgets.js` 新增共用 SVG helper，所有圖示固定 `24x24`，不使用 emoji 或外部圖片套件。

「遊戲動效與節奏精修批次」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `motionConfig`。
- `assets/js/entertainment-widgets.js` 新增一次性 `motionCue`，避免倒數或 toast 重繪時反覆播放動畫。
- 路線記憶已補路線生成、答對節點、答錯、通關結算短動效。
- 市集快手已補開始、答對、答錯、結算與 10 秒以下倒數急迫狀態。
- 梅花合成已補新方塊、移動、合併、卡住與任務結算短動效。
- 生活快問已補開始、答對、答錯、完成回顧短動效。
- 所有新增動效只使用 transform / opacity，並納入 `prefers-reduced-motion`。

「遊戲平衡與難度調整批次」已由 Codex 端直接完成：

- 在 `data/entertainment/games.json` 新增 `balanceConfig`。
- 每日挑戰 bonus 從 `150` 調為 `120`，避免高於入門局核心分數的一半。
- 市集快手全快答分數從約 `1640` 壓到約 `1136`，錯誤扣分從 `35` 提高到 `45`。
- 路線記憶第 2-4 關倍率調整為 `1.25 / 1.55 / 1.9`，最高關卡約 `1083` 分。
- 生活快問每題調為 `110` 分，全對 bonus 調為 `120`，全對約 `560` 分。
- 梅花合成入門任務步數調為 `16`，完成獎勵調為 `150`，剩餘步數加分調為 `10`。
- 保留 `yangmei_games_v3`，並保留既有 `routeProgress`、`quizProgress`、`mergeProgress`、`achievements` 與總分紀錄。

## 建議下一批

優先做「廠商資料正式化批次」：

- 盤點 11 個廠商分類的 `vendors.json` 與 `updates.json`。
- 依「已核實 / 待核實 / 缺電話 / 缺地址 / 缺來源」輸出補齊清單。
- 檢查每個廠商分類頁是否都有資訊更新檔、核實狀態與最近更新時間。
- 不要把示範廠商誤標為正式核實商家。
- 若要進入實際商家核實，需再由人工或官方來源確認電話、地址與授權。

## 驗證要求

- `node --check assets/js/entertainment-widgets.js`
- `node --check assets/js/entertainment-data.js`
- `node --check data/service-page-source.mjs`
- `node scripts/build-main-structure.mjs`
- 正式站掃描 `missingCount=0`
- Playwright 驗證：
  - 桌機 1440 x 1000 無水平溢出
  - 手機 390 x 844 無水平溢出
  - console / pageerror = 0
  - 生活快問需完整答完 1 組題庫
  - 梅花合成需完成 1 個合成任務
  - 成就徽章可依測試 localStorage 解鎖至少 5 個
  - 最高關卡、快問進度、梅花合成進度、成就解鎖與分數可寫入 `yangmei_games_v3`

## 注意

- 不要直接修改產生器輸出的 `assets/js/entertainment-data.js`；應改 `data/entertainment/games.json` 後重建。
- 保留目前每日挑戰與分數重置邏輯。
- 不要把 UI 做成單一紫色系，保持現有清爽資料工具風格。
