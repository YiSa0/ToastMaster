# Toast Master 吐司大師

**The ultimate destination for toast lovers, combining delicious creations with AI-powered recommendations.**
**為吐司愛好者打造的終極殿堂，將美味創作與 AI 驅動的智慧推薦完美結合。**

---

## 核心功能 (Core Features)

### 🍞 點餐與客製化 (Ordering & Customization)
*   **多樣化菜單 (Diverse Menu):** 瀏覽我們精心設計的招牌吐司、炸物點心及飲品。
*   **客製化吐司產生器 (Custom Toast Builder):** 從麵包、肉類、醬料到配料，自由搭配，創造您專屬的吐司傑作。
*   **即時價格計算 (Real-time Price Calculation):** 在您客製化吐司的過程中，價格會即時更新。
*   **動態購物車 (Dynamic Shopping Cart):** 輕鬆新增、移除或調整購物車中的品項數量。

### ✨ AI 智慧助手 (AI-Powered Assistant)
*   **AI 吐司搭配助手 (AI Pairing Assistant):** 根據您當下的心情和天氣狀況，由 AI 為您推薦獨一無二的吐司組合。
*   **智慧回饋機制 (Intelligent Feedback Loop):** 不喜歡 AI 的推薦嗎？告訴它您不喜歡哪些食材，AI 會根據您的回饋產生新的建議。
*   **隨機吐司產生器 (Random Toast Generator):** 想來點驚喜嗎？讓命運決定您的下一份美味！
*   **安全提示工程 (Secure Prompt Engineering):** 內建提示詞注入與惡意指令防禦機制，確保 AI 互動的安全性。

### 👤 使用者中心 (User Center)
*   **多重登入方式 (Multiple Authentication Methods):** 支援傳統的電子郵件/密碼註冊，以及方便的 Google 第三方登入。
*   **個人資料管理 (Profile Management):** 使用者登入後可以編輯自己的顯示名稱與聯絡資訊。
*   **閒置自動登出 (Idle Auto-Logout):** 為了保護帳戶安全，系統會在使用者閒置 15 分鐘後自動登出。
*   **忘記密碼 (Password Reset):** 提供安全的密碼重設流程。
*   **訂單紀錄 (Order History):** 輕鬆查看所有歷史訂單的詳細資訊。

### 🛡️ 安全性與驗證 (Security & Validation)
*   **全面的 Zod 驗證 (Comprehensive Zod Validation):** 從前端到後端，所有使用者輸入（包括訂單、個人資料）都經過嚴格的 Zod schema 驗證，確保資料的完整性與格式正確性。
*   **防範跨網站指令碼 (XSS Prevention):** 透過 React 的自動內容逸出 (auto-escaping) 機制，有效防禦 XSS 注入攻擊。
*   **安全的後端互動 (Secure Backend Interaction):** 所有與 Firebase 的通訊皆透過官方 SDK 進行，其參數化查詢機制能有效防止資料庫注入攻擊 (如 SQL/NoSQL Injection)。
*   **強化的 API 日誌 (Enhanced API Logging):** 後端 API 具備清晰且一致的日誌記錄格式，便於追蹤與除錯。

### 🚀 特色頁面 (Special Pages)
*   **獵奇吐司圖鑑 (Adventurous Toasts Gallery):** 一個展示本店最狂野、最奇特吐司創作的頁面，包含使用者（或店家）的趣味試吃心得與評分。
*   **排行榜 (Leaderboards):** 探索最受歡迎、評價最高，以及最具挑戰性的傳奇吐司。
*   **關於我們 (About Us):** 了解 Toast Master 的品牌故事與理念。

---

## 技術棧 (Tech Stack)

*   **前端 (Frontend):**
    *   **框架 (Framework):** [Next.js](https://nextjs.org/) (App Router)
    *   **語言 (Language):** [TypeScript](https://www.typescriptlang.org/)
    *   **UI 函式庫 (UI Library):** [React](https://react.dev/)
    *   **元件 (Components):** [ShadCN/UI](https://ui.shadcn.com/)
    *   **樣式 (Styling):** [Tailwind CSS](https://tailwindcss.com/)
    *   **圖示 (Icons):** [Lucide React](https://lucide.dev/)
*   **後端與 AI (Backend & AI):**
    *   **平台 (Platform):** [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
    *   **AI 框架 (AI Framework):** [Genkit](https://firebase.google.com/docs/genkit) (for AI flows)
    *   **語言模型 (LLM):** [Google Gemini](https://deepmind.google/technologies/gemini/)
*   **工具 (Tooling):**
    *   **表單驗證 (Form Validation):** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
    *   **狀態管理 (State Management):** React Context & `useState`

---

## 如何開始 (Getting Started)

### 1. 前置需求 (Prerequisites)
*   [Node.js](https://nodejs.org/) (v18 或更新版本)
*   [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)
*   一個 Firebase 專案

### 2. 設定環境變數 (Setup Environment Variables)

將根目錄下的 `.env.example` 檔案複製一份並重新命名為 `.env`，然後填入您的 Firebase 專案設定。

```bash
# .env
# Firebase public configuration for the client-side
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# OpenWeatherMap API Key for weather feature (optional)
OPENWEATHERMAP_API_KEY="YOUR_OPENWEATHERMAP_KEY"

# Gemini API Key for Genkit AI features
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. 安裝依賴套件 (Install Dependencies)
```bash
npm install
```

### 4. 執行開發伺服器 (Run Development Server)
您需要開啟兩個終端機視窗：

*   **終端機 1 (Next.js 前端):**
    ```bash
    npm run dev
    ```
    應用程式將會在 `http://localhost:9002` 上執行。

*   **終端機 2 (Genkit AI 服務):**
    ```bash
    npm run genkit:watch
    ```
    這會啟動 Genkit 開發伺服器，並在您修改 AI 相關檔案時自動重新載入。

現在，您可以開始探索 Toast Master 的所有功能了！
