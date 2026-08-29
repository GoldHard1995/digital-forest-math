# 數字森林

「數字森林」是供香港中一學生鞏固有向數加法和減法的數學小遊戲平台原型。此儲存庫目前包含可點擊的低擬真前端，用來評審學生與教師的主要流程；尚未連接正式登入、資料庫或真實學生資料。

Cloudflare Pages 建置：npm run build；輸出目錄：dist/client。

## 已包含的原型流程

- 學生森林地圖及最新指派
- 有向數答題及內置數學鍵盤
- 分層錯誤提示
- 教師班級總覽
- 建立指派流程
- 學生進度及錯誤報告
- Excel 匯出入口

## 系統需求

- Node.js 22.13.0 或以上
- npm

## 本機啟動

    npm install
    npm run dev

## 建立正式版本

    npm run build

## 技術組成

- React 19
- TypeScript
- Vinext
- Tailwind CSS
- shadcn 元件
- Lucide 圖示

## 目前限制

- 所有學生、班級、題目及報告資料均為示例資料。
- 尚未實作 Supabase 登入、資料庫、檔案上載及權限規則。
- 「匯出 Excel」按鈕只呈現預定位置，尚未產生檔案。
- 尚未進行 70 人同時在線的壓力測試。

## 專案結構

app/：網站頁面及樣式；components/ui/：共用介面元件；public/：網站圖示。

## 資料安全

不要把真實學生資料或金鑰提交至 GitHub。