import {test, expect} from 'vitest';
import React from 'react';
import {render} from 'ink-testing-library';
import proxyquire from 'proxyquire';

// Mock the database module
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
const FateSelectionWithMock = proxyquire('./fate-selection.js', {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'../db.js': {pickRestaurant: mockPickRestaurant},
} as any).default;

test('FateSelection shows loading initially', () => {
	const {lastFrame} = render(<FateSelectionWithMock walletStatus="savings" />);

	const frame = lastFrame();
	expect(typeof frame).toBe('string');
	expect(frame).toContain('正在挑選合適的餐廳...');
});

test('FateSelection shows restaurants after loading', async () => {
	const {lastFrame} = render(<FateSelectionWithMock walletStatus="savings" />);

	// 等待加載完成
	await new Promise(resolve => {
		setTimeout(resolve, 3100); // Wait for the 3 second delay in the component
	});

	const frame = lastFrame();
	expect(typeof frame).toBe('string');
	expect(frame).toContain('以下是適合像你這種 💵 小有積蓄 人類的選項：');
	expect(frame).toContain('測試餐廳1');
	expect(frame).toContain('測試餐廳2');
	expect(frame).toContain('按 R 重新開始，按 Q 退出');
});

test('FateSelection calls onRestart when R is pressed', async () => {
	let restarted = false;
	const onRestart = () => {
		restarted = true;
	};

	const {stdin} = render(
		<FateSelectionWithMock walletStatus="savings" onRestart={onRestart} />,
	);

	// 等待加載完成
	await new Promise(resolve => {
		setTimeout(resolve, 3100);
	});

	// 模擬按 R
	stdin.write('r');

	// 等待事件處理
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	expect(restarted).toBe(true);
});
