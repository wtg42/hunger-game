import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';

function Notification({
	message,
	duration,
	onDone,
}: {
	readonly message: string;
	readonly duration: number;
	readonly onDone: () => void;
}): JSX.Element | undefined {
	const [done, setDone] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setDone(true);
		}, duration);
	}, [duration]);

	useEffect(() => {
		if (done) {
			onDone();
		}
	}, [done, onDone]);

	if (done) {
		return undefined;
	}

	return (
		<Box flexDirection="column" alignItems="center">
			<Text color="yellow">{message}</Text>
		</Box>
	);
}

export default Notification;
