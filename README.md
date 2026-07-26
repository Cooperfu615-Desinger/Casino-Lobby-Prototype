# 🎰 巨亨ONLINE APP Prototype

> A high-fidelity React + TypeScript prototype for **巨亨ONLINE**, designed as a **Living Specification** for development and design teams.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

---

## 📖 專案簡介

這是 **巨亨ONLINE** 的高階互動 APP 原型，使用 React 18 + Vite + TypeScript 構建。本專案不僅是一個視覺展示，更是一份 **Living Specification（活規格書）**，作為開發與美術團隊的 **單一事實來源 (Single Source of Truth)**。

### 🎯 設計目標

- **開發端**：可直接參考組件結構與狀態管理模式
- **設計端**：提供真實互動體驗，而非靜態 Mockup
- **產品端**：快速驗證 UX 流程與功能邏輯

---

## 🏗️ 核心設計哲學

### Living Specification

傳統開發流程中，PRD → 設計稿 → 開發 三者經常脫節。本專案將規格、設計與實作合而為一：

```
┌─────────────────────────────────────────────────────┐
│                 Living Specification                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │  Design   │──│   Code    │──│ Documentation │   │
│  │  (視覺)   │  │  (實作)   │  │    (規格)     │   │
│  └───────────┘  └───────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Modular Architecture

採用職責分離原則，每個模組專注單一功能：

- **Context 層**：全域狀態管理
- **Components 層**：UI 組件（按 layout/features/modals/common 分類）
- **Hooks 層**：可重用邏輯封裝
- **Types 層**：TypeScript 型別定義

---

## 🧠 五大核心系統 (The 5 Contexts)

本專案採用 React Context 管理全域狀態，共有五個核心 Context：

| Context | 職責 | 持久化 |
|---------|------|--------|
| **AuthContext** | 用戶身份驗證、登入/登出、用戶資料 | ❌ |
| **UIContext** | 彈窗堆疊管理、Toast 通知、Loading 狀態 | ❌ |
| **NavigationContext** | 底部導航管理、路由補償邏輯 | ❌ |
| **AudioContext** | 背景音樂/音效控制、自動播放策略 | ⬆️ |
| **UserPreferencesContext** | 語言設定、音效偏好、localStorage 持久化 | ✅ |

> 💡 **設計亮點**：`UserPreferencesContext` 獨立於 `AuthContext`，因為偏好設定的生命週期與帳號無關——登出後語言和音效設定仍應保留。

---

## ✨ 特色功能

### 🪟 全域彈窗堆疊管理

支援多層彈窗疊加，按 ESC 順序關閉：

```tsx
const { openModal, closeModal } = useUI();
openModal('transfer');  // 開啟轉帳彈窗
openModal('bank');      // 疊加銀行選擇彈窗
closeModal();           // 關閉最上層
```

### ⏳ 模擬 API 延遲與 UX 反饋

內建 Loading Overlay 與 Toast Notification：

```tsx
const { setLoading, showToast } = useUI();

const handleSubmit = async () => {
    setLoading(true);
    await mockApiCall();
    setLoading(false);
    showToast('操作成功！', 'success');
};
```

### 💾 自動持久化偏好設定

使用 localStorage 自動保存用戶偏好：

```tsx
const { language, setLanguage, toggleSound } = useUserPreferences();
// 設定會自動寫入 localStorage，刷新頁面後恢復
```

### 📱 底部導航位移補償

自動偵測底部導航高度，動態調整內容區域避免遮擋：

```tsx
const { navHeight, contentStyle } = useNavigation();
// contentStyle 包含正確的 padding-bottom 補償
```

---

## 🛠️ 技術棧

| 類別 | 技術 |
|------|------|
| **Framework** | React 18 (Hooks + Context) |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3 |
| **Icons** | Lucide React |
| **Animation** | CSS Keyframes + Tailwind Animate |

---

## 📂 專案結構

```
src/
├── context/                    # 全域狀態管理
│   ├── AuthContext.tsx         # 身份驗證
│   ├── UIContext.tsx           # UI 控制 (Toast/Loading/Modal)
│   ├── NavigationContext.tsx   # 導航狀態
│   ├── AudioContext.tsx        # 音訊控制
│   └── UserPreferencesContext.tsx  # 用戶偏好 (localStorage)
├── components/
│   ├── layout/                 # 佈局組件 (Header, Nav, etc.)
│   ├── features/               # 功能組件 (LoginScreen, GameRoom)
│   ├── modals/                 # 彈窗組件
│   └── common/                 # 共用組件 (Toast, Loading)
├── hooks/                      # 自訂 Hooks
├── types/                      # TypeScript 型別定義
└── data/                       # 靜態資料
```

---

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 📋 開發優化歷程

| Phase | 內容 | 狀態 |
|-------|------|------|
| Phase 1 | 建立 NavigationContext，統一底部導航管理 | ✅ |
| Phase 2 | 重構 ModalContainer 為無狀態組件 | ✅ |
| Phase 3 | 遊戲種類分類頁面與內容配置化 | ✅ |
| Phase 4 | 擴展 UIContext (Toast/Loading) | ✅ |
| Phase 5 | 實作 UserPreferencesContext 與 localStorage 持久化 | ✅ |

---

## 📄 License

MIT © 2024
