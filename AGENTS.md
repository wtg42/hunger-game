# Agent Guidelines for Hunger Game

## Build/Lint/Test Commands

- **Build**: `npm run build` (TypeScript compilation)
- **Dev**: `npm run dev` (TypeScript watch mode)
- **Test**: `npm test` (prettier + xo linting + ava tests)
- **Single test**: `npx ava source/components/AddMealPage.test.tsx`

## Code Style Guidelines

### Imports

- React imports first
- Third-party libraries second
- Local imports last
- Use `.js` extensions in imports (even for `.tsx` files)

### Formatting

- **Indentation**: Tabs (configured in .editorconfig)
- **Line endings**: LF
- **Trailing whitespace**: Trimmed
- **Final newlines**: Required
- **Prettier config**: `@vdemedes/prettier-config`

### Naming Conventions

- **Components**: PascalCase (e.g., `AddMealPage`)
- **Variables/Functions**: camelCase (e.g., `inputStatement`)
- **Types**: PascalCase (e.g., `AddMeal`)
- **Files**: PascalCase for components, camelCase for utilities

### TypeScript

- Explicit return types for functions (e.g., `JSX.Element`)
- Use union types for state (e.g., `NextSetp = "return" | "m" | ""`)
- Optional properties with `?` (e.g., `tags?: string`)

### Error Handling

- Use try/catch blocks
- Check `error instanceof Error` before accessing `.message`
- Display user-friendly error messages via UI components
- Database constraint violations converted to user-friendly messages
- Real-time input validation with visual feedback
- Graceful handling of duplicate entries and invalid data

### Linting

- **XO** with `xo-react` config
- `react/prop-types` rule disabled
- Prettier integration enabled

### Input Validation

- **Meal Name**: Required, 1-50 characters, no harmful characters (`<>"'&`)
- **Weight**: Required integer 1-5
- **Tags**: Optional, max 100 characters, no harmful characters
- **Description**: Optional, max 200 characters, no harmful characters
- **Duplicate Prevention**: Database-level unique constraint on meal names
- **Real-time Validation**: Visual feedback during input with red/green borders

### Testing

- **AVA** framework with TypeScript support
- Use `ink-testing-library` for React component testing
- Async tests with proper await patterns
- Module mocking via test setup or dependency injection
- Comprehensive validation unit tests in `validation.test.ts`
- Integration tests for complete add meal flow

### Comments

- Mix of Chinese and English comments acceptable
- JSDoc for complex functions
- Inline comments for business logic clarification
