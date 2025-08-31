import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {
	validateMealInput,
	validateMealName,
	validateMealWeight,
} from '../utils/validation.js';
import App from '../app.js';
import TextInput from './text-input.js';
import Notification from './notification.js';

// 定義要詢問用戶的問題列表
const questions = [
	'❤️ 新增收藏品項：',
	'⭐️ 喜愛程度(1~5)：',
	'📌 Tags(咖哩、麵包、素食...)：',
	'📝 額外說明：',
];

/**
 * 新增餐點頁面元件
 *
 * 逐步詢問用戶問題，收集餐點資訊。
 */

type AddMeal = (option: {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
	metadata?: string;
}) => unknown;

function AddMealPage({
	addMeal,
	App: AppComponent,
}: {
	readonly addMeal: AddMeal;
	readonly App?: React.ComponentType;
}): JSX.Element {
	// 用戶當前輸入的內容
	const [inputStatement, setInputStatement] = useState('');

	// 儲存用戶對每個問題的回答
	const [logs, setLogs] = useState<string[]>([]);

	// 當前進行到第幾個問題的索引 (從 0 開始)
	const [step, setStep] = useState(0);

	// 判斷是否所有問題都已回答完畢
	const questionDone = step === questions.length;

	// 判斷是否已儲存到 DB
	const [isSaved, setIsSaved] = useState(false);
	// 儲存錯誤訊息，顯示於 UI
	const [errorText, setErrorText] = useState<string>('');

	// 即時驗證狀態
	const [validationStatus, setValidationStatus] = useState<{
		isValid: boolean;
		message: string;
	}>({isValid: true, message: ''});

	useInput((_, key) => {
		if (key.return) {
			setStep((previous: number) => {
				if (previous >= questions.length) {
					return previous;
				}

				return previous + 1;
			});

			// Write into logs and reset input.
			setLogs((previous: string[]) => {
				// 問題已回答完畢只需要顯示已有的回答
				if (questionDone) {
					return previous;
				}

				return [...previous, inputStatement];
			});

			setInputStatement('');
		}
	});

	// 問卷內容寫入 DB
	useEffect(() => {
		if (!questionDone) {
			return;
		}

		let timer: NodeJS.Timeout | undefined;
		try {
			// 驗證輸入資料
			const validation = validateMealInput(logs);
			if (!validation.isValid) {
				throw new Error(validation.errors.join('\n'));
			}

			// 確保驗證通過後有資料
			if (!validation.data) {
				throw new Error('驗證通過但沒有資料');
			}

			addMeal({
				name: validation.data.name,
				weight: validation.data.weight,
				tags: validation.data.tags,
				description: validation.data.description,
				metadata: '', // 之後會有其他頁面功能寫入
			});

			// 故意停個幾秒讓用戶看自己輸入的列表
			timer = setTimeout(() => {
				// You don't need to do anything.
				setIsSaved(true);
			}, 2000);
		} catch (error: unknown) {
			// 發生錯誤時保持在頁面並顯示訊息
			setIsSaved(false);
			const message = error instanceof Error ? error.message : 'Unknown error';
			setErrorText(message);
		}

		return () => {
			clearTimeout(timer);
		};
	}, [questionDone, logs, addMeal]);

	// 即時驗證當前輸入
	useEffect(() => {
		if (logs.length === 0 || questionDone) {
			setValidationStatus({isValid: true, message: ''});
			return;
		}

		const currentStep = step;
		const currentInput = inputStatement;

		// 根據當前步驟進行驗證
		switch (currentStep) {
			case 0: {
				// 餐點名稱驗證
				const nameValidation = validateMealName(currentInput);
				setValidationStatus({
					isValid: nameValidation.isValid,
					message: nameValidation.isValid ? '' : nameValidation.error ?? '',
				});

				break;
			}

			case 1: {
				// 權重驗證
				const weightValidation = validateMealWeight(currentInput);
				setValidationStatus({
					isValid: weightValidation.isValid,
					message: weightValidation.isValid ? '' : weightValidation.error ?? '',
				});

				break;
			}

			default: {
				setValidationStatus({isValid: true, message: ''});
			}
		}
	}, [inputStatement, step, logs, questionDone]);

	// 時間到自動切換到首頁
	const [goHome, setGoHome] = useState(false);

	// 最後在顯示一秒儲存成功訊息 回到首頁
	useEffect(() => {
		if (!isSaved) {
			return;
		}

		const timer = setTimeout(() => {
			setGoHome(true);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [isSaved]);

	/**
	 * Update input statement
	 */
	const handleOnChange = (value: string) => {
		setInputStatement((previous: string) => previous + value);
	};

	/**
	 * Update input statement when delete
	 */
	const handleOnDelete = (value: string) => {
		setInputStatement(value);
	};

	if (goHome) {
		const Component = AppComponent ?? App;
		return <Component />;
	}

	if (isSaved) {
		return (
			<Box flexDirection="column" borderColor="yellow" borderStyle="round">
				<Text>已儲存</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Box
				margin={1}
				borderColor="yellow"
				borderStyle="round"
				flexDirection="column"
			>
				<Text dimColor color="cyan">
					{questionDone ? '' : questions[step] ?? ' '}
				</Text>
				{questionDone &&
					logs.length > 0 &&
					logs.map((item: string, index: number) => (
						<Text key={item}>{`${questions[index] ?? ''}: ${item}`}</Text>
					))}
			</Box>
			{!questionDone && (
				<Box
					margin={1}
					borderColor={validationStatus.isValid ? 'green' : 'red'}
					borderStyle="round"
					flexDirection="column"
				>
					{/* <Text color="cyan">▶ {inputStatement || " "}</Text> */}
					<TextInput
						value={inputStatement}
						onChange={handleOnChange}
						onDelete={handleOnDelete}
					/>
					{!validationStatus.isValid && validationStatus.message && (
						<Text dimColor color="red">
							⚠️ {validationStatus.message}
						</Text>
					)}
				</Box>
			)}
			{errorText && (
				<Box marginY={1}>
					<Notification
						message={errorText}
						duration={5000}
						onDone={() => {
							setErrorText('');
						}}
					/>
				</Box>
			)}
		</Box>
	);
}

export default AddMealPage;
