## Why

Phase 1 建立了清晰的架構基礎（DAL、集中類型、導航系統），但核心功能仍然不完整。用戶無法編輯或刪除已添加的餐點，推薦算法也只是隨機排序。現在實現完整的編輯/刪除功能和智能推薦，能讓應用真正可用。

## What Changes

- 在 Meal Options Manager 中添加編輯和刪除功能的交互界面（支持編輯名稱、權重、標籤、描述）
- 實現經濟狀況相關的推薦優化：根據用戶的錢包狀態（empty/middle/rich）返回優先級不同的餐點
- 更新 Data Access Layer spec 以正式定義 updateMealOption 的行為

## Capabilities

### New Capabilities

- `edit-delete-ui`: 編輯/刪除餐點的用戶界面，包括交互流程、輸入驗證、確認對話
- `meal-recommendation`: 根據經濟狀況智能篩選和推薦合適的餐點

### Modified Capabilities

- `data-access-layer`: 添加 updateMealOption 的正式規格和錯誤處理定義

## Impact

- **代碼變動**：MealOptionsManager.tsx 中新增編輯/刪除 UI、database.ts 中完整實現 pickMealsByStatus() 邏輯、updateMealOption 的 spec 定義
- **架構變動**：無新增層級，基於 Phase 1 架構擴展
- **向後相容性**：完全相容，純功能擴展
- **用戶體驗**：應用變為真正可用的工具
