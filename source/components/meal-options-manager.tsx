import React, {useCallback, useState} from 'react';
import {Text, useInput} from 'ink';
import App from '../app.js';
import SelectInput from './select-input.js';
import Notification from './notification.js';
import AddMealPage from './add-meal-page.js';
import {addMealOption} from '../db.js';

const mealOptions: Array<{label: string; value: string}> = [
	{label: '新增餐點', value: 'add'},
	// { label: "編輯餐點", value: "edit" },
	// { label: "刪除餐點", value: "delete" },
	// { label: "返回", value: "escape" },
];

/**
 * Meal Options Manager
 *
 * 讓用戶用可以自行新增編輯餐點 DB 內容
 */
function MealOptionsManager(): JSX.Element {
	// 用戶選擇
	const [userSelected, setUserSelected] = useState<string>('');

	/**
	 * 依照 user 選擇顯示功能畫面
	 */
	const handleOnSelect = useCallback((item: {label: string; value: string}) => {
		setUserSelected(item.value);
	}, []);

	const [inputActive, setInputActive] = useState(true);

	useInput(
		(input, key) => {
			if (key.escape) {
				setUserSelected('escape');
				return;
			}

			if (input === 'q') {
				setUserSelected('q');
				return;
			}

			setInputActive(false);
		},
		{
			isActive: inputActive,
		},
	);

	/**
	 * message 結束時間到就返回選項畫面
	 */
	const handleOnDone = useCallback(() => {
		setUserSelected('');
	}, []);

	// 路線選擇
	switch (userSelected) {
		case 'add':
			return <AddMealPage addMeal={addMealOption} />;
		case 'edit':
			return <Text color="yellowBright">Still working on it</Text>; // return <div />;
		case 'delete':
			return <Text color="yellowBright">Still working on it</Text>; // return <div />;
		case 'escape':
			return <App />;

		case 'q':
			return (
				<Notification
					message="Use [Ctrl + c] to exit."
					duration={1000}
					onDone={handleOnDone}
				/>
			);
	}

	return <SelectInput optionItems={mealOptions} onSelect={handleOnSelect} />;
}

export default MealOptionsManager;
