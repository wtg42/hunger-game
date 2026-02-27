# Centralized Types Specification

## Purpose

Establish a single source of truth for all TypeScript type definitions across the Hunger Game application, eliminating duplication and ensuring consistency.

## Requirements

### Requirement: All TypeScript types centrally defined

The system SHALL define all TypeScript types in a single centralized location (`src/types/index.ts`) to prevent duplication and ensure consistency across the codebase.

#### Scenario: Types are accessible from any module

- **WHEN** a component or service imports from `src/types/index.ts`
- **THEN** all type definitions (MealOption, InsultsKey, etc.) are available without duplication

#### Scenario: MealOption type is defined once

- **WHEN** the codebase is searched for `MealOption` type definition
- **THEN** only one definition exists in `src/types/index.ts`

#### Scenario: No circular type dependencies

- **WHEN** types are imported across the application
- **THEN** no circular import issues occur between type definitions and modules

### Requirement: Type safety for meal options

The system SHALL define a `MealOption` type that includes all required fields for meal data with proper TypeScript typing.

#### Scenario: MealOption has required fields

- **WHEN** a meal option is created
- **THEN** it MUST have: id (number), name (string), weight (1-5 number), and optional tags, description, metadata, created_at

#### Scenario: Economic status type is defined

- **WHEN** economic status is referenced
- **THEN** it uses the centralized `InsultsKey` type with values: 'empty' | 'coins' | 'savings' | 'stable' | 'rich'

### Requirement: Types exported for public use

The system SHALL export all types from `src/types/index.ts` for use throughout the application.

#### Scenario: Types are exported as named exports

- **WHEN** code imports types with `import type { MealOption, InsultsKey } from 'src/types'`
- **THEN** the import succeeds without errors
