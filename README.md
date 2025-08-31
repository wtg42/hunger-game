# Hunger Game 🎲💸

![Cover Image](./assets/images/cover.png)

## 關於 Hunger Game

**Hunger Game** 是一款有趣的命令列工具，專為那些「今天吃什麼？」決策困難的人類設計！透過簡單的互動介面，幫你從已儲存的餐點中隨機挑選，讓吃飯決策變得輕鬆愉快。

### 主要特色

- 🎯 **智慧挑選**: 根據你的喜好程度權重來推薦餐點
- 📝 **輕鬆管理**: 簡單新增、編輯餐點資料
- 🎨 **美觀介面**: 彩色命令列介面，操作直覺
- 💾 **本地儲存**: 資料安全儲存在本地，不用擔心隱私

## 🚀 安裝指南

### 系統需求

- Node.js 16 或以上版本
- npm 或 yarn

### 安裝步驟

```bash
# 全域安裝
$ npm install --global hunger-game

# 或使用 npx 直接執行（無需安裝）
$ npx hunger-game
```

## 📖 使用指南

### 啟動應用程式

安裝完成後，在終端機輸入：

```bash
$ hunger-game
```

### 主要功能

#### 1. 首頁

- 顯示歡迎畫面和操作說明
- 按 **Enter** 開始餐點挑選
- 按 **M** 進入餐點管理
- 按 **Q** 退出程式

#### 2. 餐點挑選

- 系統會根據你的經濟狀況顯示適合的餐點
- 顯示兩個隨機挑選的餐點選項
- 按 **R** 重新挑選
- 按 **Q** 退出

#### 3. 餐點管理

- **新增餐點**: 輸入餐點名稱、喜好程度（1-5 分）、標籤、描述
- **編輯餐點**: 修改現有餐點資訊
- **刪除餐點**: 移除不需要的餐點

### 輸入說明

#### 新增餐點時的格式

```
餐點名稱,喜好程度,標籤,描述
```

**範例：**

```
牛肉麵,5,中式,經典台灣小吃
Pizza,4,義式,起司超多
壽司,3,日式,新鮮海鮮
```

#### 欄位說明

- **餐點名稱**: 必填，1-50 個字元
- **喜好程度**: 必填，1-5 的整數（5 分最喜歡）
- **標籤**: 選填，描述餐點類型（如：中式、日式、素食等）
- **描述**: 選填，餐點的詳細說明

### 經濟狀況選項

應用程式會根據你的經濟狀況來篩選餐點：

- 💸 **錢包空空**: 適合便宜的餐點
- 🪙 **有一些零錢**: 中等價位的選擇
- 💵 **小有積蓄**: 稍微貴一點的餐點
- 🏦 **穩健富足**: 高品質餐點
- 🚀 **財富自由**: 頂級餐廳選擇

## ❓ 常見問題

**Q: 我的餐點資料會儲存在哪裡？**
A: 資料會安全儲存在你電腦的本機資料庫中，不會上傳到任何伺服器。

**Q: 可以修改已新增的餐點嗎？**
A: 目前版本支援新增和刪除餐點，修改功能正在開發中。

**Q: 為什麼有些餐點沒有出現？**
A: 系統會根據你選擇的經濟狀況來篩選餐點。如果沒有符合條件的餐點，請先新增更多選擇。

**Q: 如何完全移除所有資料？**
A: 刪除 `~/.hunger-game/db.sqlite` 檔案即可清除所有資料。

## 🤝 貢獻

歡迎回報問題或建議新功能！請在 [GitHub Issues](https://github.com/your-username/hunger-game/issues) 提出。

---

# 🔧 開發者資訊

## 📋 餐點輸入驗證規格 (Meal Input Validation Specification)

### 概述

Hunger Game 實作了完整的餐點輸入驗證系統，確保資料品質和安全性。驗證分為前端驗證和資料庫約束兩個層級。

### 欄位規格

#### 1. 餐點名稱 (Meal Name)

- **必填性**: 必填
- **資料型別**: 字串
- **長度限制**: 1-50 個字元
- **驗證規則**:
  - 不能為空或只包含空白字元
  - 長度必須在 1-50 字元之間
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `餐點名稱不能為空`
  - `餐點名稱不能超過50個字元`
  - `餐點名稱包含無效字元`

#### 2. 喜愛程度權重 (Weight)

- **必填性**: 必填
- **資料型別**: 整數
- **數值範圍**: 1-5
- **驗證規則**:
  - 必須是有效的數字
  - 必須是整數（不接受小數）
  - 必須在 1-5 的範圍內
- **錯誤訊息**:
  - `權重必須是有效的數字`
  - `權重必須是整數`
  - `權重必須在 1-5 之間`

#### 3. 標籤 (Tags)

- **必填性**: 可選
- **資料型別**: 字串
- **長度限制**: ≤100 個字元
- **驗證規則**:
  - 可為空（選填欄位）
  - 如果有值，長度不能超過 100 字元
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `Tags 不能超過100個字元`
  - `Tags 包含無效字元`

#### 4. 額外說明 (Description)

- **必填性**: 可選
- **資料型別**: 字串
- **長度限制**: ≤200 個字元
- **驗證規則**:
  - 可為空（選填欄位）
  - 如果有值，長度不能超過 200 字元
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `描述不能超過200個字元`
  - `描述包含無效字元`

### 資料庫約束

```sql
CREATE TABLE IF NOT EXISTS meal_options (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL CHECK(length(name) > 0 AND length(name) <= 50),
  weight       INTEGER NOT NULL CHECK(weight >= 1 AND weight <= 5),
  tags         TEXT    DEFAULT NULL CHECK(length(tags) <= 100),
  description  TEXT    DEFAULT NULL CHECK(length(description) <= 200),
  metadata     TEXT    DEFAULT NULL,
  created_at   TEXT    NOT NULL DEFAULT (datetime()),
  UNIQUE(name)  -- 防止重複餐點名稱
);
```

#### 資料庫層級驗證

- **主鍵**: `id` (自動遞增)
- **唯一約束**: `name` (防止重複餐點名稱)
- **檢查約束**:
  - `name`: 長度 > 0 且 ≤ 50
  - `weight`: 值在 1-5 之間
  - `tags`: 長度 ≤ 100
  - `description`: 長度 ≤ 200
- **預設值**: `created_at` 使用當前時間戳

### 安全性考量

#### 防範威脅

1. **SQL 注入**: 使用參數化查詢
2. **XSS 攻擊**: 過濾有害字元 `< > " ' &`
3. **資料完整性**: 多層驗證（前端 + 資料庫）
4. **重複資料**: 唯一約束防止重複項目

#### 輸入清理

- **字串清理**: 移除前後空白
- **字元過濾**: 移除潛在有害字元
- **長度限制**: 防止過長輸入影響效能

### 使用者體驗

#### 即時驗證

- **視覺回饋**: 輸入框邊框顏色變化
  - 綠色：驗證通過
  - 紅色：驗證失敗
- **錯誤提示**: 即時顯示具體錯誤訊息
- **防呆設計**: 防止無效資料提交

#### 錯誤處理

- **用戶友好**: 將技術錯誤轉換為易懂訊息
- **精確定位**: 指出具體哪個欄位有問題
- **引導修正**: 提供修正建議

### 測試覆蓋

#### 單元測試

- ✅ 各欄位驗證函數測試
- ✅ 邊界值測試
- ✅ 錯誤情況測試
- ✅ 安全性測試

#### 整合測試

- ✅ 完整新增餐點流程
- ✅ 資料庫約束測試
- ✅ 錯誤處理測試
- ✅ 用戶介面測試

### API 介面

#### 驗證函數

```typescript
// 單欄位驗證
validateMealName(name: string): ValidationResult
validateMealWeight(weight: string | number): ValidationResult
validateMealTags(tags: string): ValidationResult
validateMealDescription(description: string): ValidationResult

// 綜合驗證
validateMealInput(logs: string[]): ValidationResult

// 字串清理
sanitizeString(input: string): string
```

#### 回傳格式

```typescript
interface ValidationResult {
	isValid: boolean;
	error?: string;
	value?: number; // 僅 weight 驗證回傳
}

interface MealInput {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
}
```

## 🛠️ 開發與測試

### 技術架構

- **前端框架**: React + Ink (命令列介面)
- **語言**: TypeScript
- **資料庫**: SQLite (better-sqlite3)
- **測試框架**: Vitest
- **程式碼品質**: XO (ESLint + Prettier)
- **建置工具**: TypeScript Compiler

### 專案結構

```
hunger-game/
├── source/
│   ├── components/     # React 元件
│   ├── utils/         # 工具函數
│   ├── types/         # TypeScript 型別定義
│   ├── db.ts          # 資料庫操作
│   └── app.tsx        # 主應用程式
├── assets/            # 靜態資源
├── test.tsx          # 測試入口
├── vitest.config.ts   # Vitest 設定
├── tsconfig.json     # TypeScript 設定
└── package.json      # 專案設定
```

### 本地開發

```bash
# 安裝依賴
$ npm install

# 開發模式（監視檔案變更）
$ npm run dev

# 建置生產版本
$ npm run build

# 執行測試
$ npm test

# 程式碼檢查
$ npm run lint
```

### 發佈流程

```bash
# 版本更新
$ npm version patch|minor|major

# 建置
$ npm run build

# 發佈到 npm
$ npm publish
```

### 相容性

- **Node.js**: ≥16
- **作業系統**: macOS, Linux, Windows
- **終端機**: 支援 ANSI 色彩的終端機

## 📋 餐點輸入驗證規格 (Meal Input Validation Specification)

### 概述

Hunger Game 實作了完整的餐點輸入驗證系統，確保資料品質和安全性。驗證分為前端驗證和資料庫約束兩個層級。

### 欄位規格

#### 1. 餐點名稱 (Meal Name)

- **必填性**: 必填
- **資料型別**: 字串
- **長度限制**: 1-50 個字元
- **驗證規則**:
  - 不能為空或只包含空白字元
  - 長度必須在 1-50 字元之間
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `餐點名稱不能為空`
  - `餐點名稱不能超過50個字元`
  - `餐點名稱包含無效字元`

#### 2. 喜愛程度權重 (Weight)

- **必填性**: 必填
- **資料型別**: 整數
- **數值範圍**: 1-5
- **驗證規則**:
  - 必須是有效的數字
  - 必須是整數（不接受小數）
  - 必須在 1-5 的範圍內
- **錯誤訊息**:
  - `權重必須是有效的數字`
  - `權重必須是整數`
  - `權重必須在 1-5 之間`

#### 3. 標籤 (Tags)

- **必填性**: 可選
- **資料型別**: 字串
- **長度限制**: ≤100 個字元
- **驗證規則**:
  - 可為空（選填欄位）
  - 如果有值，長度不能超過 100 字元
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `Tags 不能超過100個字元`
  - `Tags 包含無效字元`

#### 4. 額外說明 (Description)

- **必填性**: 可選
- **資料型別**: 字串
- **長度限制**: ≤200 個字元
- **驗證規則**:
  - 可為空（選填欄位）
  - 如果有值，長度不能超過 200 字元
  - 不能包含有害字元：`< > " ' &`
- **錯誤訊息**:
  - `描述不能超過200個字元`
  - `描述包含無效字元`

### 資料庫約束

```sql
CREATE TABLE IF NOT EXISTS meal_options (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL CHECK(length(name) > 0 AND length(name) <= 50),
  weight       INTEGER NOT NULL CHECK(weight >= 1 AND weight <= 5),
  tags         TEXT    DEFAULT NULL CHECK(length(tags) <= 100),
  description  TEXT    DEFAULT NULL CHECK(length(description) <= 200),
  metadata     TEXT    DEFAULT NULL,
  created_at   TEXT    NOT NULL DEFAULT (datetime()),
  UNIQUE(name)  -- 防止重複餐點名稱
);
```

#### 資料庫層級驗證

- **主鍵**: `id` (自動遞增)
- **唯一約束**: `name` (防止重複餐點名稱)
- **檢查約束**:
  - `name`: 長度 > 0 且 ≤ 50
  - `weight`: 值在 1-5 之間
  - `tags`: 長度 ≤ 100
  - `description`: 長度 ≤ 200
- **預設值**: `created_at` 使用當前時間戳

### 安全性考量

#### 防範威脅

1. **SQL 注入**: 使用參數化查詢
2. **XSS 攻擊**: 過濾有害字元 `< > " ' &`
3. **資料完整性**: 多層驗證（前端 + 資料庫）
4. **重複資料**: 唯一約束防止重複項目

#### 輸入清理

- **字串清理**: 移除前後空白
- **字元過濾**: 移除潛在有害字元
- **長度限制**: 防止過長輸入影響效能

### 使用者體驗

#### 即時驗證

- **視覺回饋**: 輸入框邊框顏色變化
  - 綠色：驗證通過
  - 紅色：驗證失敗
- **錯誤提示**: 即時顯示具體錯誤訊息
- **防呆設計**: 防止無效資料提交

#### 錯誤處理

- **用戶友好**: 將技術錯誤轉換為易懂訊息
- **精確定位**: 指出具體哪個欄位有問題
- **引導修正**: 提供修正建議

### 測試覆蓋

#### 單元測試

- ✅ 各欄位驗證函數測試
- ✅ 邊界值測試
- ✅ 錯誤情況測試
- ✅ 安全性測試

#### 整合測試

- ✅ 完整新增餐點流程
- ✅ 資料庫約束測試
- ✅ 錯誤處理測試
- ✅ 用戶介面測試

### API 介面

#### 驗證函數

```typescript
// 單欄位驗證
validateMealName(name: string): ValidationResult
validateMealWeight(weight: string | number): ValidationResult
validateMealTags(tags: string): ValidationResult
validateMealDescription(description: string): ValidationResult

// 綜合驗證
validateMealInput(logs: string[]): ValidationResult

// 字串清理
sanitizeString(input: string): string
```

#### 回傳格式

```typescript
interface ValidationResult {
	isValid: boolean;
	error?: string;
	value?: number; // 僅 weight 驗證回傳
}

interface MealInput {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
}
```

### 相容性

- **Node.js**: ≥16
- **資料庫**: SQLite (better-sqlite3)
- **前端框架**: React + Ink
- **測試框架**: AVA + ink-testing-library
