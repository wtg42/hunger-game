## Why

Hunger Game 的代碼基礎正在增長，但缺乏清晰的架構層次。類型定義重複、數據庫邏輯混亂、路由散落在組件間，這些問題會隨著功能增加而惡化。現在立即重構基礎設施可以為後續的功能擴展（編輯/刪除、推薦算法優化）奠定堅實基礎。

## What Changes

- 將 `MealOption` 等類型集中定義在 `src/types/` 中，消除重複
- 建立獨立的數據訪問層（DAL），將 `db.ts` 重構為更清晰的模塊化設計
- 移除數據庫模塊級初始化，改為延遲初始化
- 建立統一的路由系統，替代散落的 `useState` 路由邏輯
- 為新路由邏輯建立清晰的導航介面

## Capabilities

### New Capabilities

- `centralized-types`: 集中管理所有 TypeScript 類型定義，避免重複和不同步
- `data-access-layer`: 獨立的數據訪問層，隔離數據庫邏輯和初始化
- `navigation-system`: 統一的路由和導航系統，替代分散的 useState 路由邏輯

### Modified Capabilities

<!-- 此階段無現有能力修改 -->

## Impact

- **代碼變動**：`db.ts`, `src/types/index.ts`, `src/app.tsx`, 各個 component 中的導入
- **架構變動**：引入 DAL 層和導航層，更清晰的分層
- **向後相容性**：所有現有功能行為保持不變，純粹的內部重構
- **測試影響**：可以獨立測試數據層和導航層，改進可測試性
