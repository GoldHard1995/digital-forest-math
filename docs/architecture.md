# 數字森林：系統架構

最後更新：2026-08-31

## 架構概覽

```text
學生／教師瀏覽器
        │
        ├── HTTPS ──> Cloudflare Pages 靜態 React 前端
        │                    │
        │                    └── Supabase JavaScript client
        │                                  │
        └──────────────────────────────────┼── Supabase Auth
                                           └── Postgres ＋ Row Level Security

GitHub main ── 自動建置 ──> Cloudflare Pages
```

`Cloudflare Pages` 提供網站檔案；`Supabase` 負責登入及正式資料。前端的畫面守衛只改善操作，真正的資料權限必須由 `Supabase RLS` 執行。

## Repository 結構

### 應用程式

- `app/page.tsx`：單頁低擬真原型，包含登入、角色分流、學生地圖、第一至第三關答題及教師原型。功能增加後應按領域逐步拆分，不應一次重寫整個檔案。
- `app/globals.css`：全域樣式及主題。
- `main.tsx`、`index.html`：靜態 `Vite` 入口。
- `components/ui/`：`shadcn` 風格的基礎 UI 元件。

### 教學內容及資源

- `lib/first-stage-content.ts`：第一關已核准的本機內容。目前它是審核中的來源，不是正式資料庫題庫。
- `lib/second-stage-content.ts`：第二關「比較大小」已核准的本機內容，包含符號選擇及拖拉排列互動。目前它是審核中的來源，不是正式資料庫題庫。
- `lib/third-stage-content.ts`：第三關「同號加法」已核准的本機內容；A、B 部分使用整數，H 部分使用最多 1 位小數。目前它是審核中的來源，不是正式資料庫題庫。
- `public/number-line-8.svg`：網站使用的 `−8` 至 `＋8` 數線。
- `public/number-line-8.png`、`public/number-line-8.pdf`：審閱用輸出。
- `scripts/draw_number_line.py`：重建數線資源。

### 後端連接

- `lib/supabase.ts`：從 `VITE_SUPABASE_URL` 及 `VITE_SUPABASE_ANON_KEY` 建立瀏覽器 client；缺少設定時回傳 `null`，畫面進入示範模式。
- repository 暫時沒有 `supabase/migrations/`、seed 或政策測試；這是目前架構的主要缺口。

## 建置及部署

### 正式靜態建置

```bash
npm install
npm run build
```

- 設定：`vite.static.config.ts`
- 輸出：`dist/client`
- `Cloudflare Pages` 應使用 `npm run build` 及 `dist/client`。

### 其他設定的角色

- `vite.config.ts` 是 `Vinext`／OpenAI Sites／Cloudflare plugin 設定，曾因依賴未提交的 `.openai/hosting.json` 令外部建置失敗。
- `npm run build:vinext` 不是現時 `Cloudflare Pages` 的正式路徑。
- `.openai/hosting.json` 屬另一個託管整合的設定，不應取代正式靜態建置設定。

### 本機開發注意

- `npm run dev` 使用 `Vinext`。在受限制的執行環境中，debug inspector port 可能出現權限錯誤。
- 若只需檢查靜態版本，可先執行 `npm run build`，再使用 `Vite` 預覽 `dist/client`。

## 登入及角色

### 學生

1. 學生輸入非電郵登入名稱及密碼。
2. 前端把登入名稱轉成 `登入名稱@digitalforestmath.example`。
3. `Supabase Auth` 使用內部電郵別名驗證。
4. 前端讀取 `profiles.role`，`student` 只進入學生地圖。

### 教師及管理員

- 以真實電郵及密碼登入。
- `teacher` 及 `admin` 可進入教師畫面。
- 正式資料查詢仍必須由 `RLS` 限制至獲授權班級。

### 安全邊界

- `VITE_SUPABASE_ANON_KEY` 可存在前端，但只能配合完整 `RLS`。
- `service_role`、資料庫密碼及管理員密鑰不可進入前端、Git 或可下載檔案。
- 畫面隱藏或 redirect 不是資料權限控制。
- 測試應同時證明「獲准可讀」及「未獲准不可讀」。

## 目前資料模型狀態

人工建立的 `Supabase` 項目曾使用或準備使用下列概念：

- `profiles`
- `classes` 及班級成員／教師授權
- `questions`
- `activities`
- `activity_questions`
- `attempts`
- `student_rewards`

但 repository 沒有對應 migration，所以實際欄位、政策、資料量及環境現況不應由文件推測。下一次後端工作必須先匯出並審核 schema，再建立去識別化 migration 及測試。

## 目標資料流

### 內容發布

```text
草擬題目 → 教師核實 → 驗證答案／範圍／顯示 → 發布版本 → 加入活動
```

### 學生作答

```text
開始活動 → 建立工作階段 → 取得固定題目版本
→ 提交作答事件 → 判定及錯誤分類 → 提示／解法／補救
→ 更新星級及掌握 → 教師報告
```

每次提交需要不可重複的 client event id，讓斷線重試不會重複計分。

## 環境變數

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

本機值放在未追蹤的環境檔；`Cloudflare Pages` 值放在平台環境變數。文件及 commit 只保留空白範本。

## 目標演進方向

1. 先保留現有可運作原型，新增 repository 內可審核的後端 migration。
2. 把題目、活動及作答持久化，再把教師硬編碼報表換成正式查詢。
3. 逐步從 `app/page.tsx` 抽出 auth、student、teacher、content 及 data access 模組。
4. 以測試保護角色隔離、答案判定、重複提交及歷史版本。
5. 核心流程穩定後才擴充插圖、收藏及動畫。
