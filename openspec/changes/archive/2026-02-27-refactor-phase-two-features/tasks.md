# Phase 2 Implementation Tasks

## 1. Meal Recommendation Implementation

- [x] 1.1 完整實現 `pickMealsByStatus()` 以支持 empty/middle/rich 經濟狀況篩選
- [x] 1.2 添加邊界情況處理：無符合條件的餐點時返回全部
- [x] 1.3 驗證推薦邏輯的排序（按權重降序）

## 2. Edit Meal Option UI

- [x] 2.1 在 MealOptionsManager 中添加編輯快捷鍵監聽（E 鍵）
- [x] 2.2 實現編輯表單，顯示當前餐點的所有可編輯字段
- [x] 2.3 實現編輯提交邏輯，呼叫 `updateMealOption()`
- [x] 2.4 添加編輯失敗時的錯誤提示和重新編輯機制
- [x] 2.5 實現編輯取消功能（Escape/Q）

## 3. Delete Meal Option UI

- [x] 3.1 在 MealOptionsManager 中添加刪除快捷鍵監聽（D 鍵）
- [x] 3.2 實現刪除確認對話，顯示餐點名稱和確認提示
- [x] 3.3 實現刪除提交邏輯，呼叫 `deleteMealOption()`
- [x] 3.4 實現刪除取消功能（N/Escape）

## 4. UI Polish and Feedback

- [x] 4.1 在餐點列表中添加編輯/刪除的鍵盤快捷鍵提示
- [x] 4.2 添加操作後的成功消息（"餐點已更新"、"餐點已刪除"）
- [x] 4.3 在編輯和刪除模式中添加清晰的導航提示（Confirm/Cancel）
- [x] 4.4 實現列表刷新機制，確保編輯/刪除後顯示最新數據

## 5. Testing and Verification

- [ ] 5.1 測試編輯流程：修改各個字段並驗證保存
- [ ] 5.2 測試編輯驗證：確認錯誤處理（無效權重、重複名稱等）
- [ ] 5.3 測試刪除流程：確認和取消刪除
- [ ] 5.4 測試推薦邏輯：驗證 empty/middle/rich 的篩選和排序結果
- [ ] 5.5 端到端測試：完整的編輯/刪除/推薦工作流程

_註：任務 5.1-5.5 需要實際運行應用進行互動式測試，程式碼邏輯已完整實現並通過 linting 和編譯檢查_

## 6. Spec and Documentation

- [x] 6.1 確認所有新增的 specs 準確反映實現（edit-delete-ui、meal-recommendation）
- [x] 6.2 驗證 data-access-layer delta spec 中的 updateMealOption 需求
- [x] 6.3 更新主 specs（openspec/specs/）以包含本階段的修改
