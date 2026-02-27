## ADDED Requirements

### Requirement: Unified navigation hook

The system SHALL provide a React Hook (`useNavigation`) that centralizes all routing logic and provides a consistent interface for navigation.

#### Scenario: Navigation hook is available

- **WHEN** a component imports `useNavigation()` from `src/hooks/useNavigation.ts`
- **THEN** it receives an object with navigation state and methods

#### Scenario: Current route is tracked

- **WHEN** `useNavigation()` is called
- **THEN** it returns `currentRoute` indicating the current page: 'cover' | 'economic-survey' | 'meal-selection' | 'meal-manager'

#### Scenario: Navigation between routes

- **WHEN** a component calls `navigate('economic-survey')`
- **THEN** the current route changes to 'economic-survey' and the UI updates

#### Scenario: Back navigation

- **WHEN** a component calls `goBack()`
- **THEN** the navigation returns to the previous route

### Requirement: Cover page is the entry point

The system SHALL render the Cover component when the application starts (initial route is 'cover').

#### Scenario: Application starts at cover

- **WHEN** the application launches
- **THEN** `currentRoute` is 'cover'

### Requirement: Navigation from cover page

The system SHALL allow navigation from the cover page to economic-survey and meal-manager.

#### Scenario: User presses Enter to start

- **WHEN** a user presses Enter on the cover page
- **THEN** `navigate('economic-survey')` is triggered

#### Scenario: User presses M for management

- **WHEN** a user presses 'M' on the cover page
- **THEN** `navigate('meal-manager')` is triggered

#### Scenario: User presses Q to quit

- **WHEN** a user presses 'Q' on the cover page
- **THEN** the application exits (not a navigation, handled separately by useApp().exit())

### Requirement: Economic survey navigation

The system SHALL handle navigation from the economic survey to meal selection.

#### Scenario: Survey completion triggers navigation

- **WHEN** a user selects their economic status
- **THEN** the route automatically changes to 'meal-selection'

#### Scenario: Restart navigation from meal selection

- **WHEN** a user presses 'R' on the meal selection screen
- **THEN** `navigate('economic-survey')` is triggered

#### Scenario: Exit from meal selection

- **WHEN** a user presses 'Q' on the meal selection screen
- **THEN** the application exits

### Requirement: Meal manager navigation

The system SHALL handle navigation within meal management and back to cover.

#### Scenario: Return to cover from meal manager

- **WHEN** a user presses Escape in meal manager
- **THEN** `navigate('cover')` is triggered

#### Scenario: Exit from meal manager

- **WHEN** a user presses 'Q' in meal manager
- **THEN** the application exits

### Requirement: Route persistence across component re-renders

The system SHALL maintain the current route state across component re-renders and not reset it unexpectedly.

#### Scenario: Route survives component unmount

- **WHEN** a component unmounts and remounts
- **THEN** the current route is preserved (not reset to 'cover')

#### Scenario: Route is testable

- **WHEN** unit tests mock `useNavigation()`
- **THEN** they can verify navigation calls without rendering the entire component tree
