import test from 'ava';
import React from 'react';
import {render} from 'ink-testing-library';
import EconomicSurvey from './economic-survey.js';

test('EconomicSurvey renders correctly', t => {
	const {lastFrame} = render(<EconomicSurvey />);

	const frame = lastFrame();
	t.not(frame, undefined);
	t.true(frame!.includes('首先我們來看看你的錢包君健康狀態是...'));
	t.true(frame!.includes('💸 錢包空空如也'));
	t.true(frame!.includes('💵 小有積蓄'));
});

test('EconomicSurvey handles selection and shows FateSelection (async)', async t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬選擇第一個選項 (錢包空空如也)
	stdin.write('\r'); // Enter to select first option

	// 等待渲染
	await new Promise<void>(resolve => {
		setTimeout(resolve, 100);
	});

	const frame = lastFrame();
	t.not(frame, undefined);
	t.true(frame!.includes('Ok，你不是真的窮，你只是資本主義社會的失敗者範本。'));
});

test('EconomicSurvey handles quit (first test)', t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬按 Q 退出
	stdin.write('q');

	const frame = lastFrame();
	t.is(typeof frame, 'string');
	t.true(frame!.includes('首先我們來看看你的錢包君健康狀態是...')); // 應該還在原頁面，因為退出是通過 exit() 處理的
});

test('EconomicSurvey handles selection and shows FateSelection (async with frame check)', async t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬選擇第一個選項 (錢包空空如也)
	stdin.write('\r'); // Enter to select first option

	// 等待渲染
	await new Promise<void>(resolve => {
		setTimeout(resolve, 100);
	});

	const frame = lastFrame();
	if (frame) {
		t.true(
			frame.includes('Ok，你不是真的窮，你只是資本主義社會的失敗者範本。'),
		);
	} else {
		t.fail('Frame is undefined');
	}
});

test('EconomicSurvey handles quit (second test)', t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬按 Q 退出
	stdin.write('q');

	const frame = lastFrame();
	t.not(frame, undefined);
	t.true(frame!.includes('Ok，你不是真的窮，你只是資本主義社會的失敗者範本。'));
});

test('EconomicSurvey handles selection and shows FateSelection (sync)', t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬選擇第一個選項 (錢包空空如也)
	stdin.write('\r'); // Enter to select first option

	// 等待渲染
	setTimeout(() => {
		const frame = lastFrame();
		t.true(
			frame!.includes('Ok，你不是真的窮，你只是資本主義社會的失敗者範本。'),
		);
	}, 100);
});

test('EconomicSurvey handles quit (third test)', t => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬按 Q 退出
	stdin.write('q');

	const frame = lastFrame();
	t.true(frame!.includes('首先我們來看看你的錢包君健康狀態是...')); // 應該還在原頁面，因為退出是通過 exit() 處理的
});
