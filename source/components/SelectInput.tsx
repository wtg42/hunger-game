import {Box, Text, useInput} from 'ink';
import React, {memo, useState} from 'react';

// 使用泛型 T 來代表 value 的型別
type OptionItem<T> = {
	label: string;
	value: T;
};

// 在 Props 中也使用泛型 T
type SelectInputProps<T> = {
	optionItems: OptionItem<T>[];
	onSelect: (item: OptionItem<T>) => void;
};

/**
 * 下拉式選單共用元件
 *
 * 傳入要顯示的選項 optionItems 跟 選中後的 callback onSelect()
 */
// 元件宣告也要加上泛型 T
const SelectInputComponent = <T,>({
	optionItems,
	onSelect,
}: SelectInputProps<T>): JSX.Element => {
	// Cursor position
	const [index, setIndex] = useState(0);

	useInput((input, key) => {
		if (key.upArrow || input === 'k') {
			setIndex(index => Math.max(0, index - 1));
		} else if (key.downArrow || input === 'j') {
			// 確保 optionItems[index] 存在才呼叫 onSelect
			setIndex(index => Math.min(optionItems.length - 1, index + 1));
		} else if (key.return && optionItems[index]) {
			onSelect(optionItems[index]);
		}
	});

	return (
		<>
			<Box flexDirection="column" borderStyle="round" borderColor="yellow">
				{optionItems.map((item, i) => (
					// 如果 T 不是 string 或 number，key 可能需要調整
					<Text
						key={
							typeof item.value === 'string' || typeof item.value === 'number'
								? item.value
								: i
						}
					>
						{i === index ? '▶ ' : '  '}
						{item.label}
					</Text>
				))}
			</Box>
		</>
	);
};

// 使用 React.memo 包裹元件
const SelectInput = memo(SelectInputComponent) as typeof SelectInputComponent;

export default SelectInput;
