import React, {useState} from 'react';
import {useApp, useInput} from 'ink';
import Cover from './components/cover.js';
import EconomicSurvey from './components/economic-survey.js';
import MealOptionsManager from './components/meal-options-manager.js';

type NextSetp = 'return' | 'm' | '';

export default function App(): JSX.Element {
	// 判斷用戶按下任意鍵轉換場景
	const [nextStep, setNextStep] = useState<NextSetp>('');
	const [restartKey, setRestartKey] = useState(0); // 用來強制重新渲染

	const {exit} = useApp();

	const handleRestart = () => {
		setNextStep('');
		setRestartKey(previous => previous + 1); // 強制重新渲染
	};

	useInput(
		(input, key) => {
			if (input === 'q') {
				exit();
			} else if (key.return) {
				setNextStep('return');
			} else if (input === 'm') {
				// 進入餐廳編輯畫面
				setNextStep('m');
			}
		},
		{
			isActive: !nextStep,
		},
	);

	if (nextStep === 'return') {
		return <EconomicSurvey key={restartKey} onRestart={handleRestart} />;
	}

	if (nextStep === 'm') {
		// 進入餐廳編輯畫面
		return <MealOptionsManager />;
	}

	return <Cover />;
}
