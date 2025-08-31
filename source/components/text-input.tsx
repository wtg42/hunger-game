import React from 'react';
import {Box, Text, useInput} from 'ink';

const cursor = '▶ ';
/**
 * 自訂的 input 元件
 */
function TextInput({
	value,
	onChange,
	onDelete,
	color,
}: {
	readonly value: string;
	/**
	 * Callback function triggered when the delete
	 * or backspace key is pressed.
	 */
	readonly onChange: (value: string) => void;
	/**
	 * Callback function triggered when the delete
	 * or backspace key is pressed.
	 */
	readonly onDelete: (value: string) => void;
	readonly color?: string;
}): JSX.Element {
	React.useEffect(() => {
		onChange('');
	}, [onChange]);

	useInput((input, key) => {
		if (key.delete || key.backspace) {
			onDelete(value.slice(0, -1));
			return;
		}

		onChange(input);
	});

	return (
		<Box>
			<Text color={color}>{cursor + (value || ' ')}</Text>
		</Box>
	);
}

export default TextInput;
