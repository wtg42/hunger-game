import {test, expect} from 'vitest';
import React from 'react';
import {render} from 'ink-testing-library';
import EconomicSurvey from './economic-survey.js';

test('EconomicSurvey renders correctly', () => {
	const {lastFrame} = render(<EconomicSurvey />);

	const frame = lastFrame();
	expect(frame).toBeDefined();
	expect(frame).toContain('首先我們來看看你的錢包君健康狀態是...');
	expect(frame).toContain('💸 錢包空空如也');
	expect(frame).toContain('💵 小有積蓄');
});

test('EconomicSurvey handles quit', () => {
	const {lastFrame, stdin} = render(<EconomicSurvey />);

	// 模擬按 Q 退出
	stdin.write('q');

	const frame = lastFrame();
	expect(typeof frame).toBe('string');
	expect(frame).toContain('首先我們來看看你的錢包君健康狀態是...');
});
