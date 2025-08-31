import React from 'react';
import test from 'ava';
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

test('renders initial questions correctly', async t => {
	const mockAddMeal = createMockAddMeal();

	const {stdin, lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	// Simulate entering meal name
	stdin.write('牛肉麵');
	stdin.write('\r'); // Enter

	// Simulate entering weight
	stdin.write('5');
	stdin.write('\r'); // Enter

	// Simulate entering tags
	stdin.write('中式,湯麵');
	stdin.write('\r'); // Enter

	// Simulate entering description
	stdin.write('經典台灣小吃');
	stdin.write('\r'); // Enter

	// Wait for processing
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	// Check the final output
	const finalOutput = lastFrame();
	t.true(finalOutput?.includes('已儲存'), 'Should show success message');

	// Check that addMeal was called with correct data
	t.is(mockAddMeal.calls.length, 1);
	const callArgs = mockAddMeal.calls[0];
	const mealData = callArgs?.[0] as {
		name: string;
		weight: number;
		tags: string;
		description: string;
	};
	t.is(mealData?.name, '牛肉麵');
	t.is(mealData?.weight, 5);
	t.is(mealData?.tags, '中式,湯麵');
	t.is(mealData?.description, '經典台灣小吃');
});

test('shows validation errors for invalid input', async t => {
	const mockAddMeal = createMockAddMeal();

	const {stdin, lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	// Enter empty name
	stdin.write('\r'); // Enter with empty input

	// Wait for processing
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	// Should show validation error
	const output = lastFrame();
	t.true(output?.includes('餐點名稱不能為空') ?? output?.includes('錯誤'));
});

function MockAppForErrorTest(): undefined {
	return undefined;
}

test('handles database errors gracefully', async t => {
	const mockAddMeal = () => {
		throw new Error('資料庫連線失敗');
	};

	const {stdin, lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockAppForErrorTest} />,
	);

	// Enter valid data
	stdin.write('牛肉麵');
	stdin.write('\r');
	stdin.write('5');
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');

	// Wait for processing
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	// Should show error message
	const output = lastFrame();
	t.true(output?.includes('資料庫連線失敗') ?? output?.includes('錯誤'));
});

test('prevents submission with invalid weight', async t => {
	const mockAddMeal = createMockAddMeal();

	const {stdin, lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	// Enter valid name
	stdin.write('牛肉麵');
	stdin.write('\r');

	// Enter invalid weight
	stdin.write('10'); // Weight > 5
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');

	// Wait for processing
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	// Should show validation error and not call addMeal
	const output = lastFrame();
	t.true(output?.includes('權重必須在 1-5 之間') ?? output?.includes('錯誤'));
	t.is(mockAddMeal.calls.length, 0);
});

test('handles duplicate name error', async t => {
	const mockAddMeal = () => {
		throw new Error('此餐點名稱已存在');
	};

	const {stdin, lastFrame} = render(
		<AddMealPage addMeal={mockAddMeal} App={MockApp} />,
	);

	// Enter data that would create duplicate
	stdin.write('牛肉麵');
	stdin.write('\r');
	stdin.write('5');
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');
	stdin.write('');
	stdin.write('\r');

	// Wait for processing
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	// Should show duplicate error
	const output = lastFrame();
	t.true(output?.includes('此餐點名稱已存在'));
});

test('render test', async t => {
	const React = await import('react');
	const {render} = await import('ink-testing-library');
	const addMealPageModule = await import('./add-meal-page.js');
	const AddMealPage = addMealPageModule.default;

	try {
		const {lastFrame} = render(
			React.createElement(AddMealPage, {
				addMeal: () => ({lastInsertRowid: 1, changes: 1}),
				App: MockApp,
			}),
		);

		t.true(lastFrame() !== null);
	} catch (error: unknown) {
		console.error('Error in render test:', error);
		throw error;
	}
});

test('show error message when addMealOption throws', async t => {
	const {stdin, lastFrame} = render(
		<AddMealPage
			addMeal={() => {
				throw new Error('DB error');
			}}
			App={MockApp}
		/>,
	);

	// 模擬回答四個問題
	for (let i = 0; i < 4; i++) {
		stdin.write('\r');
	}

	// 等待 React 更新
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	t.true(lastFrame()?.includes('DB error'));
});
