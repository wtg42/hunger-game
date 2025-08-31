import test from 'ava';
import React from 'react';
import {render} from 'ink-testing-library';
import FateSelection from './fate-selection.js';

test('FateSelection shows loading initially', t => {
	const {lastFrame} = render(
		<FateSelection walletStatus="savings" comment="test" />,
	);

	const frame = lastFrame();
	t.is(typeof frame, 'string');
	t.true((frame as string).includes('正在挑選合適的餐廳...'));
});

test('FateSelection shows restaurants after loading', async t => {
	const {lastFrame} = render(
		<FateSelection walletStatus="savings" comment="test" />,
	);

	// 等待加載完成
	await new Promise(resolve => setTimeout(resolve, 4000));

	const frame = lastFrame();
	t.is(typeof frame, 'string');
	t.true(
		(frame as string).includes('以下是適合像你這種 💵 小有積蓄 人類的選項：'),
	);
	t.true((frame as string).includes('按 R 重新開始，按 Q 退出'));
});

test('FateSelection calls onRestart when R is pressed', async t => {
	let restarted = false;
	const onRestart = () => {
		restarted = true;
	};

	const {stdin} = render(
		<FateSelection
			walletStatus="savings"
			comment="test"
			onRestart={onRestart}
		/>,
	);

	// 等待加載完成
	await new Promise(resolve => setTimeout(resolve, 4000));

	// 模擬按 R
	stdin.write('r');

	// 等待事件處理
	await new Promise(resolve => setTimeout(resolve, 100));

	t.true(restarted);
});
