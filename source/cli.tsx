#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
// import meow from 'meow';
import App from './app.js';

// Temporarily disabled - flags not used yet
// const cli = meow(
// 	`
// 	Usage
// 	  $ hunger-game

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ hunger-game --name=Jane
// 	  Hello, Jane
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );

// render(<App name={cli.flags.name} />);
(async () => {
	const {waitUntilExit} = render(<App />);

	try {
		await waitUntilExit();
	} catch (error) {
		console.log('An error occurred as the app was exiting.', error);
	}
})();
