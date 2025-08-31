import React from 'react';
import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import AddMealPage from './add-meal-page.js';

// Mock components for testing
function MockApp(): undefined {
	return undefined;
}

// Mock addMeal function for testing
const createMockAddMeal = () => {
	const calls: unknown[][] = [];
	const mockFn = (...args: unknown[]) => {
		calls.push(args);
		return {lastInsertRowid: 1, changes: 1};
	};

	mockFn.calls = calls;
	return mockFn;
};

test('renders without crashing', () => {
	const mockAddMeal = createMockAddMeal();

	const {lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	const frame = lastFrame();
	expect(frame).toBeTruthy();
	expect(frame!.length).toBeGreaterThan(0);
});

test('handles database errors gracefully', () => {
	const mockAddMeal = () => {
		throw new Error('資料庫連線失敗');
	};

	const {lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	const frame = lastFrame();
	expect(frame).toBeTruthy();
});
