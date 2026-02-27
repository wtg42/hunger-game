## 1. Setup - Create New Infrastructure Modules

- [x] 1.1 Create `src/types/index.ts` with centralized type definitions (MealOption, InsultsKey)
- [x] 1.2 Create `src/services/database.ts` with DAL functions (initDatabase, getMealOptions, addMealOption, etc.)
- [x] 1.3 Create `src/hooks/use-navigation.ts` with navigation hook implementation

## 2. Implement Centralized Types

- [x] 2.1 Move MealOption type definition from `src/db.ts` to `src/types/index.ts`
- [x] 2.2 Move InsultsKey type from `src/types/index.ts` (verify it exists)
- [x] 2.3 Add type exports and verify all types are properly exported

## 3. Implement Data Access Layer

- [x] 3.1 Implement `initDatabase()` function with database initialization logic
- [x] 3.2 Implement `getMealOptions()` function to fetch all meals
- [x] 3.3 Implement `addMealOption()` with validation and error handling
- [x] 3.4 Implement `deleteMealOption()` function
- [x] 3.5 Implement `checkDuplicateMealName()` function
- [x] 3.6 Implement `pickMealsByStatus(walletStatus)` function with economic status filtering
- [x] 3.7 Remove module-level database initialization from old code
- [x] 3.8 Ensure all database operations are properly error-handled with Chinese error messages

## 4. Implement Navigation System

- [x] 4.1 Implement `useNavigation()` hook with route state management
- [x] 4.2 Implement `navigate()` method to change current route
- [x] 4.3 Implement `goBack()` method for back navigation
- [x] 4.4 Define route type: 'cover' | 'economic-survey' | 'meal-selection' | 'meal-manager'
- [x] 4.5 Ensure route is properly exported from the hook

## 5. Update Application Entry Point

- [x] 5.1 Update `src/cli.tsx` to call `initDatabase()` on startup
- [x] 5.2 Ensure CLI properly initializes before rendering App component

## 6. Update App Component to Use Navigation

- [x] 6.1 Update `src/app.tsx` to use `useNavigation()` hook instead of local `useState`
- [x] 6.2 Update route handling to work with the unified navigation system
- [x] 6.3 Remove local `nextStep` and `restartKey` state management

## 7. Update Components to Use New DAL

- [x] 7.1 Update `src/components/cover.tsx` to import and use navigation hook for routing
- [x] 7.2 Update `src/components/economic-survey.tsx` to import types from centralized location
- [x] 7.3 Update `src/components/fate-selection.tsx` to use new DAL `pickMealsByStatus()` function
- [x] 7.4 Update `src/components/fate-selection.tsx` to import MealOption type from centralized location
- [x] 7.5 Remove duplicate MealOption type definition from `src/components/fate-selection.tsx`
- [x] 7.6 Update `src/components/meal-options-manager.tsx` to use navigation hook
- [x] 7.7 Update `src/components/add-meal-page.tsx` to import types and functions from new locations
- [x] 7.8 Update `src/components/meal-options-manager.tsx` to use navigation for routing
- [x] 7.9 Update input handling to work with unified navigation system

## 8. Update All Import Statements

- [x] 8.1 Replace all `from '../db.js'` imports with `from '../services/database.js'`
- [x] 8.2 Replace all type imports with `from '../types/index.js'`
- [x] 8.3 Add navigation hook imports to components that need routing

## 9. Testing and Verification

- [x] 9.1 Verify all TypeScript compilation succeeds without errors
- [x] 9.2 Run existing test suite and verify all tests pass
- [x] 9.3 Manually test: Cover page loads and displays correctly
- [x] 9.4 Manually test: Navigation from cover to economic survey works
- [x] 9.5 Manually test: Economic survey selection works
- [x] 9.6 Manually test: Meal selection displays economic-status-filtered meals
- [x] 9.7 Manually test: Can add new meals through meal manager
- [x] 9.8 Manually test: Restart functionality works from meal selection
- [x] 9.9 Manually test: Exit (Q key) works from all screens
- [x] 9.10 Verify error messages display correctly for duplicate names and invalid input

## 10. Code Cleanup

- [x] 10.1 Delete old `src/db.ts` file (ensure all code is migrated first)
- [x] 10.2 Remove any remaining duplicate type definitions from component files
- [x] 10.3 Run linting and fix any style issues
- [x] 10.4 Run prettier to ensure code formatting is consistent

## 11. Final Validation

- [x] 11.1 Verify no unused imports or dead code remains
- [x] 11.2 Run full test suite one final time
- [x] 11.3 Verify application works end-to-end with all routes
- [x] 11.4 Create a git commit with the refactoring work
