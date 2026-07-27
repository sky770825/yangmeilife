# YangmeiLife 全站重整與 M5 多角色執行計畫

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**日期：** 2026-07-26
**專案：** `/Users/caijunchang/Desktop/程式專案資料夾/yangmeilife-生活集拷貝`
**基準文件：** `docs/PRELAUNCH_FUNCTION_BACKEND_MEDIA_PLAN_2026-07-12.md`
**進度文件：** `docs/superpowers/plans/2026-07-26-yangmeilife-execution-status.md`

## 1. 目標與不可違反規則

本輪不是一次性改版，而是依「廠商優先、資料可信、介面統一、功能可用、逐批驗收」完成可上架的區域生活網站。

不可違反：

1. 飲料店只保留「功夫茶楊梅四維店」，地址為「楊梅區四維路 90 號」。
2. 不得從舊任務書恢復已刪除的 33 筆示範廠商；現況是 11 筆公開資料。
3. 不得編造店名、電話、地址、評分、營業時間、圖片授權或官方來源。
4. 客人頁面不得顯示工程狀態、測試提示、內部搜尋、資料欄位名稱或後臺說明。
5. `vendor-admin.html`、`test-image-upload.html`、`booking.html` 在完成登入與權限前不得當作公開功能。
6. 來源資料優先修改 `data/**` 與 `scripts/build-main-structure.mjs`；不得只手改會被生成器覆寫的檔案。
7. 每批都必須由不同角色實作與複查；實作者不能自行宣告驗收通過。
8. 未完成的功能要隱藏或標示即將推出，不得用說明卡冒充可用功能。
9. 施工前必須建立可回復的版本基準；此資料夾目前不是 Git repository。
10. 首頁的無來源使用人數、工具數量與 24/7 等宣稱必須移除或改接真實統計。

## 2. 多角色分工與輪詢方式

| 角色 | 責任 | 不可兼任 |
| --- | --- | --- |
| Coordinator | 拆批、控制範圍、更新進度文件、處理阻擋 | 不直接核准自己的修改 |
| Researcher | 核對廠商、政府與官方來源，記錄日期與來源網址 | 不自行把資料標成已發布 |
| Data Engineer | 調整 JSON schema、生成器、資料驗證與輸出 | 不改品牌視覺方向 |
| UI Designer | 建立 token、版型、卡片、首頁與分頁規格 | 不直接改資料真實性狀態 |
| Frontend Engineer | 依核准規格實作桌機與手機介面 | 不自行變更核實資料 |
| Game Engineer | 重做遊戲流程、狀態、持久化與玩法 | 不改廠商資料 |
| Reviewer | 對照任務、檔案差異、資料流與回歸風險 | 不審核自己寫的程式 |
| Security Reviewer | URL、輸入消毒、XSS、CSP、金鑰、Auth、RLS 與安全標頭 | 不核准自己實作的安全修改 |
| QA/Bug | 瀏覽器、視窗、連結、圖片、互動、可及性與錯誤驗證 | 不以目測取代測試紀錄 |
| Release Manager | 檢查簽核、備份、發布、健康檢查與回復 | 不跳過任何發布阻擋 |

每完成一個 Task：

1. 實作者更新進度文件中的檔案、測試與已知限制。
2. Reviewer 以唯讀方式檢查差異，列出 P0/P1/P2；資料或安全批次再由領域 Reviewer 加簽。
3. QA/Bug 依本文件的驗收命令與畫面矩陣測試，保存可重現證據。
4. 有 P0 或未處理 P1 時不可進入下一批。
5. Coordinator 每完成一批回報一次，不要等全站完成才回報。
6. 批次狀態使用：`pending → in_progress → qa → review → approved → ready_to_release → released`；失敗時回到 `blocked`。
7. 超過 30 分鐘沒有新檔案、測試或問題證據時標記為 `stalled`，由 Coordinator 重新分派。

## 2.1 Batch 0：建立可回復基準

在任何正式檔案修改前：

1. 建立不覆寫原資料夾的時間戳備份或初始化 Git 並建立基準提交。
2. 記錄 HTML 數量、內部連結、圖片來源、公開路由與資料筆數。
3. 保存首頁、功夫茶、三家店家列表、功能頁、遊戲頁的 390x844 與 1440x1000 基準截圖。
4. 將結果寫入 `reports/baseline-2026-07-26.md`，並在進度文件記錄備份位置或 commit。

## 3. Batch A：廠商資料與卡片先完成

### Task A1：鎖定廠商資料邊界與防回生驗證

**修改：**

- `scripts/build-main-structure.mjs`
- `data/vendors/vendor-categories.json`
- `data/vendors/vendor-summary.json`
- 新增 `scripts/validate-vendor-data.mjs`

**要求：**

1. `data/vendors/categories/<slug>/vendors.json` 是各分類店家唯一人工維護來源。
2. `vendor-categories.json`、`vendor-summary.json`、`assets/js/vendor-data.js` 是生成結果。
3. 驗證器必須檢查：
   - `kungfu-tea` 恰好 1 家。
   - 名稱恰好是「功夫茶楊梅四維店」。
   - 地址恰好是「楊梅區四維路 90 號」。
   - 所有公開廠商都有唯一 id、分類、核實狀態、更新日期。
   - `verified=true` 時必須有官方來源、電話、地址和 `lastVerifiedAt`。
   - 逾 90 天未複查時不得繼續顯示為完整核實。
   - 不得出現仍被刪除的舊示範名稱。
4. 修正產生器內寫死的 `generatedAt`；生成時間與資料核實時間必須分開。
5. 未核實候選店家不得部署成可直接公開讀取的正式 JSON 資產。

**驗收：**

```bash
node --check scripts/build-main-structure.mjs
node --check scripts/validate-vendor-data.mjs
node scripts/validate-vendor-data.mjs
node scripts/build-main-structure.mjs
node scripts/validate-vendor-data.mjs
```

### Task A2：最新廠商資訊核對

**修改：**

- `data/vendors/categories/*/vendors.json`
- `data/vendors/categories/*/updates.json`
- `data/vendors/categories/*/README.md`
- `reports/vendor-source-refresh-2026-07-26.md`

**要求：**

1. 逐筆使用店家官網、官方社群、Google 商家或政府公開資料核對。
2. 每筆保存 `sourceUrls`、`lastVerifiedAt`、`updatedAt`、圖片來源與授權狀態。
3. 無法確認的欄位保持 `null`，並列入 `missingFields`。
4. 搜尋到同名、搬遷、停業或來源互相衝突時，不直接改為已核實，交 Reviewer 處理。
5. 圖片優先使用店家授權照片；外部熱連結列入待本機化清單。
6. 增加 `publicationStatus`、`fieldSources`、`sourceCheckedAt`、`nextReviewAt`、`reviewedBy`、`placeId`、經緯度、媒體授權與店家同意公開紀錄。

**驗收：**

- 報告逐筆列出來源、核對日期、差異與決策。
- 公開頁不顯示未核實評分。
- 電話使用 `tel:`，地址使用 Google Maps 導航連結。
- 缺少店家 LINE/官網時不得把「聯絡店家」默默導向網站共用 LINE；應明確標示平台協助或隱藏按鈕。

### Task A3：緊湊且一致的廠商卡片

**修改：**

- `scripts/build-main-structure.mjs`
- `assets/js/vendor-page.js`（由生成器輸出）
- `assets/js/vendor-data.js`（由生成器輸出）
- 11 個根目錄廠商頁（由生成器輸出）

**介面規格：**

1. 圖片為真實店家照片，穩定 `3:2` 或 `2:1` 比例，不拉伸、不裁掉主要招牌。
2. 卡片只顯示消費者需要的店名、短分類、必要標籤、電話、導航、官方/LINE 入口。
3. 電話、地址、官方資訊以小圖示和 tooltip 呈現，觸控範圍至少 44px。
4. 長地址可換行或省略，不產生水平溢位。
5. 手機單欄；平板雙欄；寬桌機最多三欄。單店分類保持適中寬度，不放大成整頁空卡。
6. 空分類不重複顯示空狀態，也不放假卡片。
7. 遠端圖片必須有本機 fallback 與載入失敗處理。

**驗收畫面：**

- `kungfu-tea.html`：390x844、768x1024、1440x1000。
- `beauty-skin.html`：390x844、1440x1000。
- `nail-service.html`：390x844、1440x1000。
- 每頁 console/pageerror 為 0、無水平溢位、圖片載入成功、電話與導航可用。

## 4. Batch B：全站資料來源與公開範圍

### Task B1：公開功能清單

**修改：**

- `data/site-functions.json`
- `data/site-categories.json`
- `scripts/build-main-structure.mjs`
- 新增 `reports/public-function-matrix-2026-07-26.md`

**要求：**

1. 每個功能標記 `implementationStatus`、`publishStatus`、`dataReadiness`、`lastVerifiedAt`、`owner`。
2. 33 個只有說明卡的功能不得標示為可用。
3. `vendor-admin`、`test-image-upload`、`booking` 從公開導覽與搜尋移除。
4. 解決功夫茶本地頁與外部站的 canonical 衝突：本地廠商頁為主入口，外部站只做次要菜單/品牌入口。
5. 清除 `currentUrl` 空值與不一致的入口狀態。

### Task B2：最新在地資訊收集

**優先順序：**

1. 天氣。
2. 垃圾車。
3. 公車。
4. 停車。
5. 醫療院所。
6. 補助與公告。
7. 稅務、房貸與匯率。

**資料規則：**

- 高風險資訊只用政府或官方來源。
- 顯示資料來源、最後更新時間與非即時警示。
- API 失敗時不可把快取資料偽裝成最新資料。
- 來源、擷取方式、更新頻率與負責人寫入各分類 `updates` 檔與總報告。

**輸出：**

- `reports/local-information-source-register-2026-07-26.md`
- 對應 `data/**/updates.json`

## 5. Batch C：全站 UI 與分頁重設計

### Task C1：設計基礎與共用版型

**修改：**

- 新增 `assets/css/site-tokens.css`
- 新增 `assets/css/site-components.css`
- 新增或整理 `assets/css/site-shell.css`
- 新增 `assets/js/site-shell.js`
- 新增 `assets/js/homepage.js`
- 新增 `data/homepage.json`
- `scripts/build-main-structure.mjs`
- `index.html`
- `pages/index.html`
- `pages/*/index.html`

**要求：**

1. 統一字級、間距、容器寬度、卡片半徑、陰影、按鈕高度、焦點狀態與圖片比例。
2. 使用 Lucide 或既有一致 SVG 小圖示，移除結構用途 emoji。
3. 首頁卡片改成真正的 `<a href>`，保留鍵盤、開新分頁與 SEO。
4. 首頁縮圖不得過小或留下大量空白；標題和圖片在 390px 仍清楚。
5. 搜尋若是內部管理用途，從公開畫面移除；若是客用搜尋，必須以完整、簡潔的結果介面重新設計。
6. 頁面不顯示工程師欄位、測試狀態、資料 schema 或內部維護說明。
7. 先以 `pages/leisure/index.html`、`weather.html`、`expense-tracker.html` 三種代表頁驗證共用 UI，再批量套用。

### Task C2：分頁模板與逐頁重設計

依序完成：

1. 首頁、分類總覽、廠商頁。
2. 天氣、垃圾車、公車、停車等高使用率生活頁。
3. 個人工具與估算器。
4. 社群內容與公告。
5. 醫療與高風險資訊。
6. 低優先、尚未完成的說明頁。

每頁必須有：

- 明確主目的與主要操作。
- 一致返回、導覽、錯誤、空白、載入與離線狀態。
- 正確 canonical、Open Graph、alt、更新日期與來源。
- 375/390/768/1024/1440 無重疊和溢位。

## 6. Batch D：遊戲重新規劃與重做

### Task D1：玩法與產品範圍重審

**檢查：**

- `data/entertainment/games.json`
- `assets/js/entertainment-widgets.js`
- `games.html`
- `fortune.html`
- `mbti.html`
- `daily-quote.html`

**先輸出：**

- `reports/games-product-redesign-2026-07-26.md`

**決策原則：**

1. 不追求小遊戲數量；只保留 2 至 4 個可重玩、手機好操作、有在地題材的完整玩法。
2. 「資料治理、手機 UI、廠商核實」等工程題目不得作為消費者遊戲題庫。
3. 每個玩法要有 30 秒內可理解的規則、明確回饋、重新開始、暫停/重置與可關閉音效。
4. 優先設計在地探索、店家互動、親子或每日挑戰，不做廉價抽籤式互動。
5. 不收集不必要個資；localStorage 版本必須有清除紀錄入口。

### Task D2：遊戲實作與回歸

**修改：**

- `data/entertainment/games.json`
- `assets/js/entertainment-widgets.js`
- `scripts/build-main-structure.mjs`
- 相關娛樂頁輸出

先拆出以下模組，再逐款切換，未完成的遊戲繼續使用舊版：

- `assets/js/entertainment/core.js`
- `assets/js/entertainment/games/`
- `assets/js/entertainment/fortune.js`
- `assets/js/entertainment/mbti.js`
- `assets/js/entertainment/quotes.js`

**驗收：**

- 390x844 可以單手完成主要流程。
- 鍵盤與觸控都可操作。
- `prefers-reduced-motion` 有效。
- 連續玩 3 局沒有狀態錯亂、重複計分或倒數殘留。
- localStorage schema 有版本與舊資料遷移/重置策略。
- 題庫與畫面文字由非實作者複查。
- 運勢使用日期種子，確保同一天結果一致。
- MBTI 平手不固定偏向 E/S/T/J，並提供分數或中性解釋。
- 金句搜尋不因每次輸入而重建整個元件或丟失焦點。

## 7. Batch E：後臺、素材與上架控制

### Task E1：後臺規格先行

依 `PRELAUNCH_FUNCTION_BACKEND_MEDIA_PLAN_2026-07-12.md` 的角色、發布狀態、資料表與 RLS 規劃，先新增：

- `docs/backend/ADMIN_PRODUCT_SPEC.md`
- `docs/backend/DATA_SCHEMA.md`
- `docs/backend/PERMISSION_MATRIX.md`
- `docs/backend/PUBLISHING_WORKFLOW.md`

未完成 Auth、RLS、審核與 audit log 前，不建立可公開的假後臺。

### Task E2：圖片與橫幅治理

使用 `docs/MEDIA_ASSET_CHECKLIST_2026-07-12.csv`，補齊：

- 品牌 Logo、OG 圖、首頁桌機/手機主圖。
- 9 組分類封面。
- 公開功能縮圖。
- 店家 Logo、封面、實景圖庫。
- fallback、alt、尺寸、焦點、來源與授權。

正式頁不可使用 Unsplash 圖片代表特定店家，也不可長期依賴 Postimg 或外部網站熱連結。

## 8. 每批統一驗收門檻

### 自動檢查

```bash
node --check scripts/build-main-structure.mjs
node scripts/build-main-structure.mjs
node --check assets/js/vendor-page.js
node --check assets/js/vendor-data.js
node --check assets/js/entertainment-widgets.js
node --check assets/js/entertainment-data.js
```

另需加入並執行：

- 廠商資料驗證。
- HTML 本機引用與內部連結掃描。
- 公開頁不得包含管理/測試路由的掃描。
- 圖片載入與外部熱連結清單。
- 44 個 JSON 解析、全部 JavaScript/MJS 語法與 83 個 HTML HTTP 回應基準。
- URL protocol allowlist、資料輸入消毒與 stored-XSS 回歸。
- CSP 與安全標頭檢查；移除 inline event handler 後再啟用嚴格 CSP。

### 瀏覽器矩陣

| 類型 | 尺寸 |
| --- | --- |
| 小手機 | 375x812 |
| 標準手機 | 390x844 |
| 平板直向 | 768x1024 |
| 小桌機 | 1024x768 |
| 寬桌機 | 1440x1000 |

另抽查 360x800 與 1280x800，涵蓋更窄手機與常見筆電。
全站發布回歸再抽查 320、430、820、1920 寬度，以及 WebKit、200% 縮放、橫向與 safe-area。

每個代表頁檢查：

- console error = 0，pageerror = 0。
- 無水平溢位、文字遮擋、圖片拉伸、空白異常或固定導覽遮內容。
- 互動區至少 44px，焦點可見，鍵盤順序正確。
- 所有電話、導航、外連與返回連結可用。
- 客人頁面沒有內部工程資訊。

### 阻擋條件

以下任一成立即不得標示完成：

- 資料來源不明、店家未核實卻標成已核實。
- 功夫茶分類出現第二家飲料店。
- 生成後人工修改被覆蓋。
- P0/P1 reviewer finding 未處理。
- 手機溢位、圖片壞掉、管理頁公開、console error。
- 沒有 Reviewer 與 QA/Bug 的獨立紀錄。
- 沒有備份/回復證據、發布後健康檢查，或 P0/P1 Bug 尚未關閉。
- 管理路由未驗證、前端包含 service-role key/密碼/個資，或 stored-XSS 測試失敗。

## 9. 施工順序

嚴格依序：

1. Batch 0 可回復基準。
2. A1 資料邊界與防回生。
3. A2 最新廠商資料。
4. A3 廠商卡片與手機版。
5. B1 公開功能清單。
6. C1 全站設計基礎。
7. C2 分頁逐批重設計，同時進行 B2 官方資訊收集。
8. D1 遊戲產品重審。
9. D2 遊戲實作。
10. E1 後臺規格與安全基礎。
11. E2 素材治理、全站 QA、上架演練。

M5 每次只開一個主要實作批次；Researcher 可平行收集下一批資料，Reviewer 與 QA/Bug 必須在該批結束前介入。
