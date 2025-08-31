import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import {pickRestaurant} from '../db.js'; // 你自己的 db 讀取
import {InsultsKey} from '../types/index.js';

type FateSelectionProps = {
	// 用戶選擇的經濟狀況，例如 "empty", "coins", "savings" 這類
	walletStatus: InsultsKey;
	comment: string;
};

/**
 * 經濟狀況對應的描述
 */
const walletStatusDecription: Record<InsultsKey, string> = {
	empty: '💸 錢包空空如也',
	coins: '🪙 有一些零錢',
	savings: '💵 小有積蓄',
	stable: '🏦 穩健富足',
	rich: '🚀 財富自由',
};

const FateSelection = ({walletStatus}: FateSelectionProps): JSX.Element => {
	const [loading, setLoading] = useState(true);
	const [restaurant1, setRestaurant1] = useState<string | null>(null);
	const [restaurant2, setRestaurant2] = useState<string | null>(null);

	useEffect(() => {
		/**
		 * 定義一個 async 函式來處理非同步操作
		 */
		const fetchDataAndDelay = async () => {
			const options = pickRestaurant();
			// 這邊可以加更細緻的經濟狀態過濾，例如空空的就挑 weight 最低的
			const picked1 = options[0]; // 目前先拿第一個當挑選結果
			setRestaurant1(picked1?.name || '沒有找到合適的餐廳...');
			const picked2 = options[1]; // 目前先拿第一個當挑選結果
			setRestaurant2(picked2?.name || '沒有找到合適的餐廳...');

			/**
			 * sleep 函式的定義，或者移到元件外部作為一個輔助函式
			 */
			const sleep = (ms: number) =>
				new Promise(resolve => setTimeout(resolve, ms));
			await sleep(3000);
			setLoading(false);
		};

		fetchDataAndDelay(); // 呼叫這個 async 函式
	}, [walletStatus]);

	if (loading) {
		return (
			<Box flexDirection="column" alignItems="center">
				<Text color="cyan">
					<Spinner type="weather" /> 正在挑選合適的餐廳...
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" alignItems="center" marginTop={1}>
			<Text color="green">
				以下是適合像你這種 {walletStatusDecription[walletStatus]} 人類的選項：
			</Text>
			<Text bold color="yellow">
				{restaurant1}
			</Text>
			<Text bold color="yellow">
				{restaurant2}
			</Text>
		</Box>
	);
};

export default FateSelection;
