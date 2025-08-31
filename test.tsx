import test from 'ava';
import {render} from 'ink-testing-library';
import App from './source/app.js';

test('app renders without crashing', t => {
	const {lastFrame} = render(<App />);

	// Just check that it renders something
	const frame = lastFrame();
	t.true(frame != null);
	t.true(frame && frame.length > 0);
});
