import React from 'react';
import {test, expect} from 'vitest';
import {render} from 'ink-testing-library';
import Cover from './cover.js';

test('Cover renders correctly', () => {
	const {lastFrame} = render(<Cover />);

	const frame = lastFrame();
	expect(frame).toBeDefined();
	expect(frame).toContain('You are alone... Choose wisely.');
	expect(frame).toContain('[Enter]');
	expect(frame).toContain('[M]');
	expect(frame).toContain('[Q]');
});
