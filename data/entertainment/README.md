# 娛樂互動資料

此資料夾是 `games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 的互動內容來源。

- `games.json`：遊戲大廳分頁、路線記憶地點、市集快手題庫、梅花合成階段、生活快問題庫
- `fortune.json`：星座、今日運勢、塔羅、幸運色與水晶資料
- `mbti.json`：20 題測驗題庫、16 型結果描述與提示文字
- `daily-quotes.json`：金句分類、金句內容、作者與來源狀態

更新流程：

1. 修改此資料夾內的 JSON。
2. 執行 `node scripts/build-main-structure.mjs`。
3. 前端會同步更新 `assets/js/entertainment-data.js`。
4. 若有新增欄位，需同步檢查 `assets/js/entertainment-widgets.js` 是否有讀取。

注意事項：

- 小遊戲、金句、塔羅、運勢與 MBTI 內容目前仍屬展示 / 娛樂用途。
- 若改用外部引用文字，需先補齊授權與來源狀態。
- MBTI 頁不是專業心理評量，不應改成診斷式敘述。
