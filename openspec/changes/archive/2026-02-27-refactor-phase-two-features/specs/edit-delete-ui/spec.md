# Edit/Delete UI Specification

## Purpose

Enable users to edit and delete meal options through an intuitive CLI interface with clear feedback and safety confirmations.

## ADDED Requirements

### Requirement: User can edit meal option

The system SHALL allow users to edit meal options by selecting them from the meal manager and providing a form to modify details.

#### Scenario: User initiates edit mode

- **WHEN** user presses 'E' while viewing a meal option in the meal manager
- **THEN** the interface enters edit mode for that meal option

#### Scenario: Edit form displays current values

- **WHEN** the edit form is shown
- **THEN** it displays the current name, weight, tags, and description pre-filled from the database

#### Scenario: User modifies meal details

- **WHEN** user edits one or more fields in the edit form
- **THEN** changes are stored in memory and ready for submission

#### Scenario: User submits edited meal

- **WHEN** user confirms the edit (e.g., presses Enter or Ctrl+S)
- **THEN** the system calls `updateMealOption()` with the modified data
- **AND** returns to the meal list view after successful update
- **AND** displays a success message: "餐點已更新"

#### Scenario: Edit fails due to validation

- **WHEN** the user attempts to save with invalid data (e.g., weight outside 1-5)
- **THEN** the system shows the error message from `updateMealOption()`
- **AND** remains in edit mode for correction

#### Scenario: User cancels edit

- **WHEN** user presses Escape or 'Q' in edit mode
- **THEN** changes are discarded
- **AND** returns to the meal list without applying any updates

### Requirement: User can delete meal option

The system SHALL allow users to delete meal options with a confirmation dialog to prevent accidental deletion.

#### Scenario: User initiates delete

- **WHEN** user presses 'D' while viewing a meal option in the meal manager
- **THEN** the interface shows a delete confirmation dialog

#### Scenario: Confirmation dialog displays meal details

- **WHEN** the delete confirmation is shown
- **THEN** it displays the meal name and asks: "確定要刪除此餐點嗎? (Y)es (N)o"

#### Scenario: User confirms deletion

- **WHEN** user presses 'Y' or clicks confirm
- **THEN** the system calls `deleteMealOption(id)`
- **AND** removes the meal from the list
- **AND** displays a success message: "餐點已刪除"

#### Scenario: User cancels deletion

- **WHEN** user presses 'N', Escape, or 'Q'
- **THEN** the deletion is cancelled
- **AND** returns to the meal list without removing the meal

### Requirement: Meal list refreshes after edit/delete

The system SHALL update the displayed meal list immediately after editing or deleting a meal option.

#### Scenario: List reflects changes after edit

- **WHEN** a meal is successfully edited
- **THEN** the meal list is re-fetched from the database
- **AND** displays the updated meal with new values

#### Scenario: List reflects changes after delete

- **WHEN** a meal is successfully deleted
- **THEN** the meal list is re-fetched from the database
- **AND** the deleted meal is no longer displayed

### Requirement: UI provides keyboard navigation hints

The system SHALL display keyboard shortcuts clearly so users understand available actions.

#### Scenario: Meal list shows edit/delete hints

- **WHEN** viewing the meal list in meal manager
- **THEN** each meal item displays hints like: "(E)dit (D)elete" or similar
- **AND** help text is visible at the bottom of the screen

#### Scenario: Edit mode shows navigation hints

- **WHEN** in edit mode
- **THEN** the interface shows hints like: "Confirm: Enter | Cancel: Esc"
