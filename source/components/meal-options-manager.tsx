import React, {useCallback, useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import type {MealOption} from '../types/index.js';
import {
	getMealOptions,
	updateMealOption,
	deleteMealOption,
} from '../services/database.js';
import {useNavigation} from '../hooks/use-navigation.js';
import SelectInput from './select-input.js';
import Notification from './notification.js';
import TextInput from './text-input.js';

const mealOptions: Array<{label: string; value: string}> = [
	{label: '新增餐點', value: 'add'},
	{label: '編輯/管理餐點', value: 'list'},
	{label: '返回', value: 'escape'},
];

type FieldName = 'name' | 'weight' | 'tags' | 'description';
type EditingState = {
	mealId: number;
	name: string;
	weight: number;
	tags?: string;
	description?: string;
	currentField: FieldName;
	tempValue: string;
	error?: undefined | string;
};

/**
 * Meal Options Manager
 *
 * 讓用戶可以新增、編輯、刪除餐點 DB 內容
 */
function MealOptionsManager(): JSX.Element {
	const {goBack} = useNavigation();

	// 用戶選擇
	const [userSelected, setUserSelected] = useState<string>('');

	// 餐點列表
	const [meals, setMeals] = useState<MealOption[]>([]);
	const [selectedMealIndex, setSelectedMealIndex] = useState(0);

	// 編輯狀態
	const [editingState, setEditingState] = useState<EditingState | undefined>(
		undefined,
	);

	// 刪除確認狀態
	const [deletingMealId, setDeletingMealId] = useState<number | undefined>(
		undefined,
	);

	// 操作反饋訊息
	const [notification, setNotification] = useState<string>('');

	// 刷新餐點列表
	const refreshMeals = useCallback(() => {
		setMeals(getMealOptions());
		setSelectedMealIndex(0);
	}, []);

	// 初始化時加載餐點列表
	useEffect(() => {
		refreshMeals();
	}, [refreshMeals]);

	/**
	 * 依照 user 選擇顯示功能畫面
	 */
	const handleOnSelect = useCallback((item: {label: string; value: string}) => {
		setUserSelected(item.value);
	}, []);

	// 列表模式下的快捷鍵監聽
	const [inputActive, setInputActive] = useState(true);

	useInput(
		(input, key) => {
			// 編輯模式
			if (editingState) {
				if (key.escape || input === 'q') {
					// 取消編輯
					setEditingState(undefined);
					return;
				}

				if (key.return) {
					// 確認輸入並移到下一個字段
					const nextField = getNextEditField(editingState.currentField);
					if (nextField) {
						setEditingState(previous =>
							previous
								? {
										...previous,
										currentField: nextField,
										tempValue: getFieldValue(previous, nextField),
								  }
								: undefined,
						);
					} else {
						// 所有字段編輯完成，提交變更
						handleEditSubmit();
					}

					return;
				}

				setInputActive(false);
				return;
			}

			// 刪除確認模式
			if (deletingMealId !== undefined) {
				if (input === 'y') {
					handleDeleteConfirm();
					return;
				}

				if (input === 'n' || key.escape) {
					setDeletingMealId(undefined);
					return;
				}

				return;
			}

			// 列表模式
			if (userSelected === 'list' && meals.length > 0) {
				if (input === 'e') {
					// 進入編輯模式
					const selectedMeal = meals[selectedMealIndex];
					if (selectedMeal) {
						setEditingState({
							mealId: selectedMeal.id,
							name: selectedMeal.name,
							weight: selectedMeal.weight,
							tags: selectedMeal.tags,
							description: selectedMeal.description,
							currentField: 'name',
							tempValue: selectedMeal.name,
						});
					}

					return;
				}

				if (input === 'd') {
					// 進入刪除確認模式
					const selectedMeal = meals[selectedMealIndex];
					if (selectedMeal) {
						setDeletingMealId(selectedMeal.id);
					}

					return;
				}

				if (key.upArrow) {
					setSelectedMealIndex(previous =>
						previous > 0 ? previous - 1 : meals.length - 1,
					);
					return;
				}

				if (key.downArrow) {
					setSelectedMealIndex(previous =>
						previous < meals.length - 1 ? previous + 1 : 0,
					);
					return;
				}
			}

			// 全局快捷鍵
			if (key.escape) {
				goBack();
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
	 * 取得編輯字段的下一個字段
	 */
	const getNextEditField = (current: FieldName): FieldName | undefined => {
		const fields: FieldName[] = ['name', 'weight', 'tags', 'description'];
		const currentIndex = fields.indexOf(current);
		if (currentIndex >= 0 && currentIndex < fields.length - 1) {
			return fields[currentIndex + 1];
		}

		return undefined;
	};

	/**
	 * 取得字段值
	 */
	const getFieldValue = (state: EditingState, field: FieldName): string => {
		switch (field) {
			case 'name': {
				return state.name;
			}

			case 'weight': {
				return state.weight.toString();
			}

			case 'tags': {
				return state.tags ?? '';
			}

			case 'description': {
				return state.description ?? '';
			}

			default: {
				const _exhaustive: never = field;
				return _exhaustive;
			}
		}
	};

	/**
	 * 處理編輯文本輸入
	 */
	const handleEditInputChange = (value: string) => {
		setEditingState(previous =>
			previous
				? {...previous, tempValue: previous.tempValue + value}
				: undefined,
		);
	};

	/**
	 * 處理編輯文本刪除
	 */
	const handleEditInputDelete = (value: string) => {
		setEditingState(previous =>
			previous ? {...previous, tempValue: value} : undefined,
		);
	};

	/**
	 * 提交編輯
	 */
	const handleEditSubmit = () => {
		if (!editingState) {
			return;
		}

		try {
			updateMealOption(editingState.mealId, {
				name: editingState.name,
				weight: editingState.weight,
				tags: editingState.tags,
				description: editingState.description,
			});

			setNotification('餐點已更新');
			setEditingState(undefined);
			refreshMeals();
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			setEditingState(previous =>
				previous ? {...previous, error: message} : undefined,
			);
		}
	};

	/**
	 * 確認刪除
	 */
	const handleDeleteConfirm = () => {
		if (deletingMealId === undefined) {
			return;
		}

		try {
			deleteMealOption(deletingMealId);
			setNotification('餐點已刪除');
			setDeletingMealId(undefined);
			refreshMeals();
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			setNotification(`刪除失敗: ${message}`);
			setDeletingMealId(undefined);
		}
	};

	/**
	 * Message 結束時間到就返回選項畫面
	 */
	const handleOnDone = useCallback(() => {
		setUserSelected('');
		setNotification('');
	}, []);

	// 編輯模式
	if (editingState) {
		const selectedMeal = meals.find(m => m.id === editingState.mealId);
		if (!selectedMeal) {
			return <Text color="red">餐點不存在</Text>;
		}

		const fieldLabels: Record<FieldName, string> = {
			name: '❤️ 餐點名稱：',
			weight: '⭐️ 喜愛程度(1~5)：',
			tags: '📌 Tags(咖哩、麵包、素食...)：',
			description: '📝 額外說明：',
		};

		return (
			<Box flexDirection="column">
				<Text>編輯餐點：{selectedMeal.name}</Text>
				<Box
					margin={1}
					borderColor="yellow"
					borderStyle="round"
					flexDirection="column"
				>
					<Text dimColor color="cyan">
						{fieldLabels[editingState.currentField]}
					</Text>
					<Box
						margin={1}
						borderColor="green"
						borderStyle="round"
						flexDirection="column"
					>
						<TextInput
							value={editingState.tempValue}
							onChange={handleEditInputChange}
							onDelete={handleEditInputDelete}
						/>
					</Box>
					{editingState.error && (
						<Text color="red">⚠️ {editingState.error}</Text>
					)}
					<Text dimColor color="gray">
						確認 (Enter) / 取消 (Esc/Q)
					</Text>
				</Box>
			</Box>
		);
	}

	// 刪除確認模式
	if (deletingMealId !== undefined) {
		const mealToDelete = meals.find(m => m.id === deletingMealId);
		return (
			<Box flexDirection="column">
				<Text color="red">確認刪除餐點：{mealToDelete?.name}？ (y/n)</Text>
			</Box>
		);
	}

	// 列表模式
	if (userSelected === 'list') {
		if (meals.length === 0) {
			return (
				<Box flexDirection="column">
					<Text>沒有餐點，請先新增</Text>
					<Text dimColor color="gray">
						按 Q 返回選單
					</Text>
				</Box>
			);
		}

		return (
			<Box flexDirection="column">
				<Text bold>餐點列表 (↑↓ 選擇, E 編輯, D 刪除, Esc 返回)</Text>
				{meals.map((meal, index) => (
					<Text
						key={meal.id}
						color={index === selectedMealIndex ? 'cyan' : undefined}
						backgroundColor={index === selectedMealIndex ? 'gray' : undefined}
					>
						{index === selectedMealIndex ? '► ' : '  '}
						{meal.name} (⭐️ {meal.weight}){meal.tags && ` [${meal.tags}]`}
					</Text>
				))}
				{notification && (
					<Box marginY={1}>
						<Notification
							message={notification}
							duration={2000}
							onDone={handleOnDone}
						/>
					</Box>
				)}
			</Box>
		);
	}

	// 主菜單
	return <SelectInput optionItems={mealOptions} onSelect={handleOnSelect} />;
}

export default MealOptionsManager;
