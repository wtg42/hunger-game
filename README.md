# Hunger Game 🎲💸

![Cover Image](./assets/images/cover.png)

歡迎來到 **Hunger Game**！這是一款互動式的命令列介面 (CLI) 工具，讓適合像你這種吃飯決策困難型人類，可以減少消耗一些腦細胞。

## 🚀 安裝指南

```bash
$ npm install --global hunger-game
```

## CLI

```
$ hunger-game --help

  Usage
    $ hunger-game
```

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
