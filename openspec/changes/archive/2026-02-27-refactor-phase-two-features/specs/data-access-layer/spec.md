# Data Access Layer Specification - Delta

## Purpose

This delta spec adds the `updateMealOption()` requirement to the existing Data Access Layer, formalizing the update operation for meal options.

## ADDED Requirements

### Requirement: Update meal option

The system SHALL provide a function to update meal option properties in the database with proper validation and error handling.

#### Scenario: Update meal name

- **WHEN** `updateMealOption(id, { name: 'New Name' })` is called
- **THEN** the meal's name is updated in the database
- **AND** the change is persisted immediately

#### Scenario: Update meal weight

- **WHEN** `updateMealOption(id, { weight: 3 })` is called
- **THEN** the meal's weight is updated to the new value
- **AND** the new weight must be valid (1-5)

#### Scenario: Update multiple fields

- **WHEN** `updateMealOption(id, { name: 'New', weight: 4, tags: 'updated' })` is called
- **THEN** all specified fields are updated in a single operation
- **AND** unchanged fields retain their original values

#### Scenario: Partial update with optional fields

- **WHEN** `updateMealOption(id, { description: 'New description' })` is called
- **THEN** only the description field is updated
- **AND** name, weight, and tags remain unchanged

#### Scenario: Update fails with invalid weight

- **WHEN** `updateMealOption(id, { weight: 6 })` is called (weight outside 1-5)
- **THEN** an error is thrown with message: "權重必須在 1-5 之間"
- **AND** the meal is not modified

#### Scenario: Update fails with duplicate name

- **WHEN** `updateMealOption(id, { name: 'Existing Meal Name' })` is called
- **THEN** an error is thrown with message: "此餐點名稱已存在"
- **AND** the meal name is not modified

#### Scenario: Update fails with oversized text

- **WHEN** `updateMealOption(id, { tags: '<very long string>' })` is called (exceeds length limit)
- **THEN** an error is thrown with message: "輸入資料過長，請檢查長度限制"
- **AND** the meal is not modified

#### Scenario: Update is idempotent with no changes

- **WHEN** `updateMealOption(id, {})` is called with no fields specified
- **THEN** no database operation occurs
- **AND** no error is thrown
