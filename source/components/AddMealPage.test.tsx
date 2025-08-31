import React from 'react';
import test from 'ava';
import {render} from 'ink-testing-library';

// 模擬 addMealOption 拋出錯誤並顯示訊息
// 需求：顯示錯誤訊息且不返回首頁

test('show error message when addMealOption throws', async t => {
	const {default: AddMealPage} = await t.mock('./AddMealPage.tsx', {
		'../app.js': {default: () => null},
	});

	const {stdin, lastFrame} = render(
		<AddMealPage
			addMeal={() => {
				throw new Error('DB error');
			}}
		/>,
	);

	// 模擬回答四個問題
	for (let i = 0; i < 4; i++) {
		stdin.write('\r');
	}

	// 等待 React 更新
	await new Promise(resolve => setTimeout(resolve, 0));

	t.true(lastFrame()?.includes('DB error'));
});
