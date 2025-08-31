import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import App from '../app.js';
import TextInput from './TextInput.js';
import Notification from './Notification.js';

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

const AddMealPage = ({addMeal}: {addMeal: AddMeal}) => {
	// 用戶當前輸入的內容
	const [inputStatement, setInputStatetment] = useState('');

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

	useInput((_, key) => {
		if (key.return) {
			setStep(prev => {
				if (prev >= questions.length) {
					return prev;
				}
				return prev + 1;
			});

			// write into logs and reset input.
			setLogs(prev => {
				// 問題已回答完畢只需要顯示已有的回答
				if (questionDone) {
					return prev;
				}
				return [...prev, inputStatement];
			});
			setInputStatetment('');
			return;
		}
	});

	// 問卷內容寫入 DB
	useEffect(() => {
		if (!questionDone) {
			return;
		}

		let timer: NodeJS.Timeout | undefined = undefined;
		try {
			addMeal({
				name: logs[0] ?? '',
				weight: Number(logs[1]),
				tags: logs[2],
				description: logs[3],
				metadata: '', // 之後會有其他頁面功能寫入
			});
			// 故意停個幾秒讓用戶看自己輸入的列表
			timer = setTimeout(() => {
				// You don't need to do anything.
				setIsSaved(true);
			}, 2000);
		} catch (error) {
			// 發生錯誤時保持在頁面並顯示訊息
			setIsSaved(false);
			const message = error instanceof Error ? error.message : 'Unknown error';
			setErrorText(message);
		}

		return () => {
			clearTimeout(timer);
		};
	}, [questionDone]);

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
		setInputStatetment(prev => prev + value);
	};

	/**
	 * Update input statement when delete
	 */
	const handleOnDelete = (value: string) => {
		setInputStatetment(value);
	};

	if (goHome) {
		return <App />;
	}

	if (isSaved) {
		return (
			<Box flexDirection="column" borderColor="yellow" borderStyle={'round'}>
				<Text>已儲存</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Box
				flexDirection="column"
				margin={1}
				borderColor="yellow"
				borderStyle={'round'}
			>
				<Text color={'cyan'} dimColor={true}>
					{questionDone ? '' : questions[step] ?? ' '}
				</Text>
				{questionDone &&
					logs.length > 0 &&
					logs.map((item: string, index: number) => (
						<Text key={`${index}-${item}`}>
							{`${questions[index]}: ${item}`}
						</Text>
					))}
			</Box>
			{!questionDone && (
				<Box
					flexDirection="column"
					margin={1}
					borderColor="green"
					borderStyle={'round'}
				>
					{/* <Text color="cyan">▶ {inputStatement || " "}</Text> */}
					<TextInput
						value={inputStatement}
						onChange={handleOnChange}
						onDelete={handleOnDelete}
					></TextInput>
				</Box>
			)}
			{errorText && (
				<Notification
					message={errorText}
					duration={3000}
					onDone={() => setErrorText('')}
				/>
			)}
		</Box>
	);
};

export default AddMealPage;
