import React from 'react';
import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import proxyquire from 'proxyquire';

// Mock database operations for App component
const mockPickRestaurant = () => [
	{
		id: 1,
		name: '測試餐廳1',
		weight: 5,
		tags: '中式',
		description: '美味的餐廳',
		createdAt: '2023-01-01',
	},
	{
		id: 2,
		name: '測試餐廳2',
		weight: 3,
		tags: '日式',
		description: '另一家餐廳',
		createdAt: '2023-01-01',
	},
];

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const AppWithMock = proxyquire('./source/app.js', {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'./db.js': {pickRestaurant: mockPickRestaurant},
} as any).default;

test('app renders without crashing', () => {
	const {lastFrame} = render(<AppWithMock />);

	// Just check that it renders something
	const frame = lastFrame();
	expect(frame).toBeTruthy();
	expect(frame?.length).toBeGreaterThan(0);
});
