## Context

Hunger Game 目前的架構存在三個主要問題：

1. **類型重複**：`MealOption` 在 `db.ts` 和 `fate-selection.tsx` 中重複定義，修改一處時容易忘記另一處
2. **數據庫層混亂**：`db.ts` 在模塊加載時立即初始化，SQL 查詢函數命名不清（如 `pickRestaurant()` 沒有清晰的參數）
3. **路由邏輯散亂**：`App.tsx` 和 `MealOptionsManager.tsx` 都有路由邏輯，用 `useState` 手動管理路由狀態

這些問題會在添加編輯/刪除功能、優化推薦算法時變得更加明顯。

## Goals / Non-Goals

**Goals:**

- 集中管理所有類型定義，消除重複
- 建立清晰的 DAL 層，隔離數據庫初始化和查詢邏輯
- 實現統一的路由系統，使路由流程可追蹤和可測試
- 為後續功能擴展（編輯、刪除、推薦優化）奠定基礎
- 保持所有現有功能行為完全一致（純粹內部重構）

**Non-Goals:**

- 不改變用戶界面或功能行為
- 不添加新的 npm 依賴（如路由庫）
- 不進行大規模結構重組（如改變文件夾組織），這留待 P3.1
- 不實現編輯/刪除功能（P2.1 的工作）

## Decisions

### D1：集中類型定義位置

**決定**：在 `src/types/index.ts` 中定義所有類型（`MealOption`、`InsultsKey` 等）

**備選方案**：

- 創建 `src/types/database.ts`, `src/types/ui.ts` 等分類文件 - 認為過度設計
- 在 `src/db.ts` 中定義數據類型，其他文件導入 - 仍然中心化，但不如單一 types 文件清晰

**理由**：集中在一個文件中易於維護；當新人加入時能快速了解所有類型；避免 circular imports

### D2：DAL 架構（延遲初始化 + 函數式接口）

**決定**：

```
src/services/database.ts
├─ export function initDatabase() - 延遲初始化
├─ export function getMealOptions()
├─ export function getMealById(id)
├─ export function addMealOption(data)
├─ export function deleteMealOption(id)
├─ export function pickMealsByStatus(walletStatus) - 新增，支持經濟狀況篩選
└─ export function updateMealOption(id, data) - 預留給 P2.1
```

**備選方案**：

- 使用類包裝 Database 實例（OOP 風格）- 認為 CLI 應用不需要這種複雜度
- 保持 `db.ts` 不動，只提取新的查詢函數 - 無法解決模塊級初始化問題

**理由**：函數式 API 更容易測試（單純 I/O）；延遲初始化解決初始化順序脆弱問題；清晰的函數名表達意圖

### D3：路由系統實現

**決定**：建立 `src/hooks/useNavigation.ts`（React Hook），提供：

```typescript
type NavState = 'cover' | 'economic-survey' | 'meal-selection' | 'meal-manager'
useNavigation() → {
  currentRoute: NavState
  navigate: (route: NavState) => void
  goBack: () => void
}
```

**備選方案**：

- 使用第三方路由庫（react-router） - 對 CLI 應用過度工程
- 保持 `useState` 但改進命名 - 無法建立可測試、獨立的路由邏輯

**理由**：Hook 形式符合 React 習慣；易於測試（可 mock）；足夠簡單但足夠清晰

### D4：應用啟動順序

**決定**：在 `cli.tsx` 中調用 `initDatabase()`，而非模塊級執行

**理由**：清晰的啟動順序；錯誤時能更好地報告；便於未來添加其他初始化邏輯（如配置文件讀取）

## Risks / Trade-offs

### [Risk] 遷移過程中的導入路徑錯誤

**Mitigation**：在編譯之前使用 TypeScript 檢查；逐步遷移組件（先遷移葉子組件再遷移根組件）

### [Risk] DAL 和路由系統的初始設計可能不完美

**Mitigation**：P2.1 和 P2.2 會在實施編輯/刪除和推薦優化時驗證設計；如需調整可快速修改（仍在基礎架構層級）

### [Trade-off] 額外的抽象層

**權衡**：增加了代碼行數，但換來清晰性和可測試性。對於 CLI 應用這是合理的權衡。

## Migration Plan

1. **Phase A：創建新的基礎設施模塊**（無中斷）

   - 創建 `src/types/index.ts`，移動所有類型定義
   - 創建 `src/services/database.ts`，重寫 db 邏輯
   - 創建 `src/hooks/useNavigation.ts`

2. **Phase B：切換導入**（逐文件進行）

   - 更新所有組件的導入：`from '../db.js'` → `from '../services/database.js'`
   - 更新所有組件的類型導入：`from '../types'`
   - 更新 `app.tsx` 改用 `useNavigation()`
   - 測試現有功能（應無差異）

3. **Phase C：清理舊代碼**

   - 刪除舊 `db.ts`
   - 刪除組件中的類型重複定義

4. **Rollback**：只需 git revert（純粹內部重構，無行為改變）

## Open Questions

- 對於複雜的查詢（未來的推薦算法），是否在 DAL 中直接實現或在上層組件中組合 DAL 調用？
  - **建議**：優先在 DAL 中實現（如 P2.2 中的 `pickMealsByStatus()`），保持組件簡潔
