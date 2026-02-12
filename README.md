# 帳號管理系統

水星工程前端面試實作專案 — 帳號管理系統

## 技術堆疊

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** — 建置工具
- **TypeScript** — 型別安全
- **Tailwind CSS** — 樣式框架
- **Pinia** — 狀態管理
- **Vue Router** — 路由管理
- **Axios** — HTTP 請求

## 專案結構

```
src/
├── api/
│   ├── http.ts          # Axios 實例 + 攔截器
│   ├── auth.ts          # 登入/登出邏輯
│   └── accounts.ts      # 帳號 CRUD API
├── composables/
│   └── useDebounce.ts   # 防抖 Composable
├── components/
│   ├── AppHeader.vue    # 頂部導覽列
│   ├── StatCard.vue     # 統計數字卡片
│   ├── AccountCard.vue  # 帳號資訊卡片
│   └── AccountModal.vue # 新增/編輯 Modal
├── router/
│   └── index.ts         # 路由設定 + auth guard
├── stores/
│   ├── authStore.ts     # 登入狀態管理
│   └── accountStore.ts  # 帳號資料管理
├── types/
│   └── index.ts         # TypeScript 型別定義
└── views/
    ├── LoginView.vue    # 登入頁面
    └── DashboardView.vue # 主頁面
```

## 快速啟動

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並重命名為 `.env`，填入你的英文姓名：

```bash
cp .env.example .env
```

編輯 `.env`：

```env
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw
VITE_INTERVIEWER_NAME=YourEnglishName
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器至 `http://localhost:5173`

### 4. 建置專案

```bash
npm run build
```

## 功能說明

- **登入頁面** — Email + 密碼驗證，「記住我」功能
- **帳號列表** — 卡片式 RWD 佈局（手機 1 欄 → 桌面 3 欄）
- **統計數字** — 總帳號數、啟用中、已停用即時計算
- **搜尋** — 400ms 防抖，即時過濾帳號
- **新增/編輯** — Modal 表單，含前端驗證
- **刪除** — 確認提示，防止誤操作
- **Loading 狀態** — Skeleton 載入動畫，按鈕 loading 狀態

## 加分特性

- `defineModel` (Vue 3.4+) 用於 Modal 雙向綁定
- Axios 攔截器統一附加 `interviewerName` Header
- Pinia setup store 寫法（非 Options API）
- `useDebounce` 防抖搜尋
- Router guard 防止未登入訪問
- 完整 TypeScript 型別定義（Interface、Enum）
