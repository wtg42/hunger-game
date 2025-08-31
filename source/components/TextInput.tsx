import React from 'react';
import {Box, Text, useInput} from 'ink';

const cursor = '▶ ';
/**
 * 自訂的 input 元件
 */
const TextInput = ({
	value,
	onChange,
	onDelete,
	color,
}: {
	value: string;
	/**
	 * Callback function triggered when the delete\
	 * or backspace key is pressed.
	 */
	onChange: (value: string) => void;
	/**
	 * Callback function triggered when the delete\
	 * or backspace key is pressed.
	 */
	onDelete: (value: string) => void;
	color?: string;
}) => {
	React.useEffect(() => {
		onChange('');
	}, []);

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
};

export default TextInput;
