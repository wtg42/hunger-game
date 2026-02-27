## Context

Phase 1 建立了 DAL（Data Access Layer）、集中類型系統和導航系統，其中 DAL 已預留了 `updateMealOption()` 和 `deleteMealOption()` API，但這些 API 還未在 UI 層充分暴露。`pickMealsByStatus()` 函數只是隨機排序，未根據經濟狀況進行優化。

現在需要：

1. 在 MealOptionsManager 中實現完整的編輯/刪除交互
2. 在 meal-selection 流程中優化推薦邏輯
3. 正式定義 updateMealOption 的 spec

## Goals / Non-Goals

**Goals:**

- 用戶可以在 meal-manager 中選擇餐點進行編輯或刪除
- 編輯時能修改名稱、權重、標籤、描述，並驗證輸入
- 刪除時需要確認對話，防止誤操作
- `pickMealsByStatus()` 根據錢包狀態返回不同優先級的餐點
  - empty (1-2 weight): 便宜選項
  - middle (2-4 weight): 中等選項
  - rich (4-5 weight): 高級選項
- 提供完整的 updateMealOption spec

**Non-Goals:**

- 不新增路由（reuse 'meal-manager'）
- 不修改現有的 addMealOption 流程
- 不實現批量操作或高級篩選

## Decisions

### D1：編輯/刪除 UI 交互流程

**決定**：在 MealOptionsManager 中使用列表模式，每個餐點項顯示快捷鍵提示（E 編輯、D 刪除）：

```
Meal Options:
  1. [Sushi] weight:4 tags:"japanese"     (E)dit (D)elete
  2. [Pizza] weight:3 tags:"italian"      (E)dit (D)elete
```

按 E 進入編輯模式，D 進入刪除確認。

**備選方案**：

- 使用菜單模式（↑↓ 選擇，Enter 確認） - 認為快捷鍵更符合 CLI 應用風格
- 直接編輯當前項 - 不符合列表瀏覽模式

**理由**：與現有 UI 風格一致；快速鍵盤導航；清晰的狀態轉移

### D2：編輯狀態管理

**決定**：在 useNavigation hook 中添加編輯子狀態，支持 `editingId` 參數：

```typescript
navigate('meal-manager', {mode: 'edit', id: 123});
// 或在 currentRoute 中追加編輯信息
```

但考慮到當前 useNavigation 設計簡單，改為：在 MealOptionsManager 本地維護 `editingId` 狀態。

**理由**：最小化對 Phase 1 架構的擾動；編輯是 meal-manager 的內部狀態；易於回滾

### D3：推薦算法實現

**決定**：在 `src/services/database.ts` 中完整實現 `pickMealsByStatus()`：

```typescript
export function pickMealsByStatus(walletStatus: string): MealOption[] {
	const options = getMealOptions();
	let filtered: MealOption[];

	if (walletStatus === 'empty') {
		filtered = options.filter(m => m.weight <= 2);
	} else if (walletStatus === 'rich') {
		filtered = options.filter(m => m.weight >= 4);
	} else {
		filtered = options; // middle/default
	}

	return filtered.sort((a, b) => b.weight - a.weight);
}
```

**備選方案**：

- 在組件層面實現篩選邏輯 - 認為 DAL 層實現更符合關注點分離
- 用複雜的 SQL 查詢 - SQLite 基本功能足夠，過度設計

**理由**：保持 DAL 層的職責明確；易於測試；便於後續優化

### D4：updateMealOption spec 定義

**決定**：修改現有 data-access-layer spec，添加編輯場景

**理由**：updateMealOption 已實現但缺少 spec 定義；應正式納入 DAL 需求

## Risks / Trade-offs

### [Risk] 編輯狀態未保存到路由

如果用戶在編輯中按 Q 退出，編輯狀態丟失（但這也是期望行為）。

**Mitigation**：這是合理的行為（無保存按鈕），記錄在 spec 中

### [Trade-off] 推薦邏輯簡單

當前實現基於權重範圍篩選，未考慮用戶歷史、菜系偏好等複雜因素。

**權衡**：現階段足夠；未來可在 P3 中擴展為機器學習推薦

## Migration Plan

1. **實現編輯/刪除 UI**（MealOptionsManager.tsx）

   - 添加快捷鍵監聽（E、D）
   - 實現編輯表單和刪除確認
   - 本地管理 `editingId` 狀態

2. **完整實現 pickMealsByStatus()**（database.ts）

   - 根據 walletStatus 篩選
   - 按權重排序

3. **更新 data-access-layer spec**

   - 添加 updateMealOption 場景
   - 添加刪除成功後的行為描述

4. **測試和驗證**
   - 測試編輯、刪除流程
   - 驗證推薦結果正確

## Open Questions

- 編輯後是否自動刷新列表？（建議：是）
- 刪除後是否自動返回列表頂部？（建議：是）
- 推薦邏輯中，如果沒有符合條件的餐點怎麼辦？（建議：返回全部，按權重排序）
