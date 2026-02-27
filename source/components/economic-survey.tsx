import React, {useCallback, useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import type {InsultsKey} from '../types/index.js';
import SelectInput from './select-input.js';
import FateSelection from './fate-selection.js';

type EconomicSurveyProps = {
	readonly onRestart?: () => void;
};

const optionItems: Array<{label: string; value: InsultsKey}> = [
	{label: '💸 錢包空空如也', value: 'empty'},
	{label: '🪙 有一些零錢', value: 'coins'},
	{label: '💵 小有積蓄', value: 'savings'},
	{label: '🏦 穩健富足', value: 'stable'},
	{label: '🚀 財富自由', value: 'rich'},
];

// Response
const insults: Record<InsultsKey, string> = {
	empty: 'Ok，你不是真的窮，你只是資本主義社會的失敗者範本。',
	coins: '錢包有聲音，但你的人生還是無聲無息。',
	savings: '恭喜，你已經達到能活過下個月的最低標準。',
	stable: '穩定？快醒醒，這只是你在超市買特價商品時的幻覺。',
	rich: 'Huh？你不需這個 APP，Ctrl + C 離開不要再出現了。',
};

/**
 * 收集用戶目前錢包君健康狀況做後續判斷
 */
function EconomicSurvey({onRestart}: EconomicSurveyProps): JSX.Element {
	const {exit} = useApp();

	// 要給我用互看的訊息
	const [selectedMessage, setSelectedMessage] = useState<string | undefined>(
		undefined,
	);

	// 用戶選擇的經濟狀況
	const [userWalletStatus, setUserWalletStatus] = useState<InsultsKey>('empty');

	useInput(
		(input, _) => {
			if (input === 'q') {
				exit();
			}
		},
		{
			isActive: !selectedMessage,
		},
	);

	/**
	 * 依照選中選項顯示回應，並且記錄起來
	 */
	const handleOnselect = useCallback(
		({label, value}: {label: string; value: InsultsKey}) => {
			setUserWalletStatus(value);
			setSelectedMessage(label + insults[value]);
		},
		[],
	);

	// 用戶選擇經濟狀況後的顯示的訊息
	if (selectedMessage) {
		return (
			<FateSelection walletStatus={userWalletStatus} onRestart={onRestart} />
		);
	}

	return (
		<Box
			margin={5}
			gap={3}
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Text>首先我們來看看你的錢包君健康狀態是...</Text>
			<SelectInput optionItems={optionItems} onSelect={handleOnselect} />
		</Box>
	);
}

export default EconomicSurvey;
