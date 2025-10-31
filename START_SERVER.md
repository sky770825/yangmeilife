# 如何啟動本地 HTTP 伺服器

## ⚠️ 重要說明

**不要直接用檔案開啟 `second-hand.html`**（`file://` 協議會導致 CORS 錯誤）

必須使用 HTTP 伺服器開啟！

## 🚀 方法 1：VS Code Live Server（最簡單）

1. 在 VS Code 安裝擴充功能：**"Live Server"**
2. 右鍵點擊 `second-hand.html`
3. 選擇 **"Open with Live Server"**
4. 瀏覽器會自動開啟（通常是 `http://127.0.0.1:5500/second-hand.html`）

## 🐍 方法 2：Python（如果已安裝 Python）

1. 在專案資料夾開啟終端機/命令提示字元
2. 執行：
   ```bash
   python -m http.server 8000
   ```
3. 瀏覽器開啟：`http://localhost:8000/second-hand.html`

## 📦 方法 3：Node.js http-server

1. 確保已安裝 Node.js
2. 在專案資料夾執行：
   ```bash
   npx http-server
   ```
3. 瀏覽器開啟終端機顯示的網址（通常是 `http://localhost:8080`）

## 🌐 方法 4：部署到網頁空間

- GitHub Pages
- Netlify
- Vercel
- 或任何網頁主機

## ✅ 確認

開啟後，檢查瀏覽器網址列：
- ❌ 錯誤：`file:///D:/我的CURSOR專案/.../second-hand.html`
- ✅ 正確：`http://localhost:8000/second-hand.html` 或 `http://127.0.0.1:5500/...`

如果網址是 `http://` 或 `https://` 開頭，就可以正常使用了！

