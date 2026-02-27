# Data Access Layer Specification

## Purpose

Provide a clean, well-designed API for all database operations with deferred initialization and error handling, decoupling the application from direct database interactions.

## Requirements

### Requirement: Database initialization is deferred

The system SHALL NOT initialize the database at module load time. Instead, initialization SHALL occur explicitly when the application starts.

#### Scenario: Database initializes on application startup

- **WHEN** the CLI application starts
- **THEN** `initDatabase()` is called from `cli.tsx`

#### Scenario: Database state is ready before queries

- **WHEN** a query function is called
- **THEN** the database is guaranteed to be initialized

### Requirement: Clean data access API

The system SHALL provide a set of well-named, pure functions in `src/services/database.ts` that encapsulate all database operations.

#### Scenario: Functions have clear, intention-revealing names

- **WHEN** a component needs to retrieve meal options
- **THEN** it uses `getMealOptions()` rather than raw SQL

#### Scenario: Add meal option through DAL

- **WHEN** a component calls `addMealOption({ name, weight, tags, description })`
- **THEN** the meal is inserted into the database with proper validation and error handling

#### Scenario: Update meal option through DAL

- **WHEN** a component calls `updateMealOption(id, { name?, weight?, tags?, description? })`
- **THEN** the specified fields of the meal are updated in the database
- **AND** validation is performed on updated fields (weight 1-5, name uniqueness, text length limits)
- **AND** errors are thrown with user-friendly messages on validation failure

#### Scenario: Delete meal option through DAL

- **WHEN** a component calls `deleteMealOption(id)`
- **THEN** the meal with the given ID is removed from the database

#### Scenario: Check for duplicate meal names

- **WHEN** a component calls `checkDuplicateMealName(name)`
- **THEN** it returns true if a meal with that name already exists, false otherwise

### Requirement: Economic status-aware meal selection

The system SHALL provide a function that picks meal options filtered by the user's economic status.

#### Scenario: Pick meals for empty wallet

- **WHEN** `pickMealsByStatus('empty')` is called
- **THEN** meals with weight 1-2 are prioritized (budget-friendly options)

#### Scenario: Pick meals for wealthy status

- **WHEN** `pickMealsByStatus('rich')` is called
- **THEN** meals with weight 4-5 are prioritized (premium options)

#### Scenario: Returns correct meal structure

- **WHEN** any pick function is called
- **THEN** it returns an array of `MealOption` objects with all required fields

### Requirement: Error handling in data operations

The system SHALL handle database errors gracefully and provide meaningful error messages.

#### Scenario: Duplicate meal name error

- **WHEN** `addMealOption()` is called with a name that already exists
- **THEN** an error is thrown with a user-friendly Chinese message: "此餐點名稱已存在"

#### Scenario: Invalid weight error

- **WHEN** `addMealOption()` is called with weight outside 1-5
- **THEN** an error is thrown with a user-friendly Chinese message: "權重必須在 1-5 之間"

#### Scenario: Field length error

- **WHEN** `addMealOption()` is called with excessively long text fields
- **THEN** an error is thrown with a user-friendly Chinese message: "輸入資料過長，請檢查長度限制"

### Requirement: Database schema and initialization

The system SHALL initialize the meal_options table with proper schema constraints on application startup.

#### Scenario: Table exists after initialization

- **WHEN** the application starts
- **THEN** the `meal_options` table is created if it doesn't exist

#### Scenario: Constraints are enforced

- **WHEN** a meal is added
- **THEN** the database constraints enforce: name length (1-50), weight (1-5), tags length (max 100), description length (max 200)
