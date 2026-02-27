# Meal Recommendation Specification

## Purpose

Recommend meal options that are appropriate for the user's current economic status, providing smart meal selection instead of random choices.

## Requirements

### Requirement: Status-aware meal filtering

The system SHALL filter and recommend meal options based on the user's economic status (wallet condition).

#### Scenario: Recommend budget-friendly meals for empty wallet

- **WHEN** `pickMealsByStatus('empty')` is called
- **THEN** the system returns only meals with weight 1-2
- **AND** sorts them by weight in descending order (2 → 1)

#### Scenario: Recommend mid-range meals for middle status

- **WHEN** `pickMealsByStatus('coins')`, `pickMealsByStatus('savings')`, or `pickMealsByStatus('stable')` is called
- **THEN** the system returns meals with weight 2-4
- **AND** sorts them by weight in descending order (higher weight first)

#### Scenario: Recommend premium meals for rich status

- **WHEN** `pickMealsByStatus('rich')` is called
- **THEN** the system returns only meals with weight 4-5
- **AND** sorts them by weight in descending order (5 → 4)

### Requirement: Recommendation respects database state

The system SHALL return meal recommendations filtered from the current database state and handle edge cases gracefully.

#### Scenario: Return all available meals if none match criteria

- **WHEN** no meals match the status criteria (e.g., no weight 1-2 meals for 'empty')
- **THEN** the system returns all available meals sorted by weight
- **AND** ensures recommendations are not empty if any meals exist

#### Scenario: Handle empty database

- **WHEN** `pickMealsByStatus()` is called but no meals exist
- **THEN** the system returns an empty array
- **AND** does not throw an error

#### Scenario: Return correct meal structure

- **WHEN** `pickMealsByStatus()` returns results
- **THEN** each meal has all required fields: id, name, weight, tags, description

### Requirement: Recommendations are deterministic within weight bands

The system SHALL provide consistent recommendations within each weight band while allowing flexibility in ordering.

#### Scenario: Recommendations are sorted by weight

- **WHEN** multiple meals match the status criteria
- **THEN** they are sorted by weight in descending order (higher weight first)
- **AND** meals with the same weight can be in any order

#### Scenario: Recommendations are based on weight only

- **WHEN** recommendations are generated
- **THEN** the selection is based solely on weight ranges matching the status
- **AND** other factors (tags, description, creation date) do not affect filtering
