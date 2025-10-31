# Supabase 設定指南

## 步驟 1：建立資料表

1. 進入你的 Supabase 專案：https://supabase.com/dashboard/project/cggvyvklkotcnglkqlzt
2. 點擊左側選單的 **"Table Editor"**（表格編輯器）
3. 點擊 **"New Table"**（新建表格）
4. 設定如下：
   - **Table name（表格名稱）**：`second_hand_listings`
   - **Description（描述）**：`二手交易刊登資料`
5. 點擊 **"Save"**（儲存）

## 步驟 2：新增欄位

建立表格後，點擊 **"Add Column"**（新增欄位），依序建立：

### 必填欄位
1. **id**（自動建立，主鍵）
2. **title** - Text（物品名稱）
   - Type: `text`
   - Nullable: ❌ 不允許為空
3. **contact_name** - Text（聯絡人）
   - Type: `text`
   - Nullable: ❌ 不允許為空
4. **contact_phone** - Text（聯絡電話）
   - Type: `text`
   - Nullable: ❌ 不允許為空
5. **image_url** - Text（照片連結）
   - Type: `text`
   - Nullable: ✅ 允許為空（因為可選）
6. **description** - Text（物品描述）
   - Type: `text`
   - Nullable: ✅ 允許為空
7. **created_at** - Timestamp（建立時間）
   - Type: `timestamptz`
   - Default value: `now()`
   - Nullable: ❌ 不允許為空

完成後點擊 **"Save"** 儲存表格。

## 步驟 3：啟用 Row Level Security (RLS)

1. 在表格頁面，點擊 **"Policies"**（政策）
2. 點擊 **"Enable RLS"**（啟用行級安全）
3. 新增政策：
   - 點擊 **"New Policy"**
   - 選擇 **"Create a policy from scratch"**
   - **Policy name**: `Allow public read`
   - **Allowed operation**: ✅ SELECT（查詢）
   - **USING expression**: `true`（允許所有人讀取）
   - 點擊 **"Save"**
4. 再新增一個政策：
   - **Policy name**: `Allow public insert`
   - **Allowed operation**: ✅ INSERT（新增）
   - **WITH CHECK expression**: `true`（允許所有人新增）
   - 點擊 **"Save"**
5. 再新增一個政策：
   - **Policy name**: `Allow public delete`
   - **Allowed operation**: ✅ DELETE（刪除）
   - **USING expression**: `true`（允許所有人刪除）
   - 點擊 **"Save"**

## 步驟 4：取得 API 金鑰

1. 點擊左側選單的 **"Settings"**（設定）
2. 點擊 **"API"**
3. 找到 **"Project URL"** 和 **"anon public"** key
4. 複製這兩個值，稍後會用到

## 步驟 5：設定 Storage（上傳圖片用）

1. 點擊左側選單的 **"Storage"**
2. 點擊 **"Create a new bucket"**
3. 設定：
   - **Name**: `second-hand-images`
   - **Public bucket**: ✅ 勾選（公開存取）
   - 點擊 **"Create bucket"**
4. 點擊 **"Policies"** → **"New Policy"**
   - **Policy name**: `Allow public upload`
   - **Allowed operation**: ✅ INSERT（上傳）、✅ SELECT（讀取）
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`
   - 點擊 **"Save"**

## 完成！

設定完成後，將以下資訊填入 `second-hand.html`：
- `SUPABASE_URL`: 你的 Project URL
- `SUPABASE_ANON_KEY`: 你的 anon public key
