import React from 'react';
import {Box, Text} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

const gameTitle = 'HUNGER GAME';

// 讀取 package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = resolve(__dirname, '../../package.json'); // 看你的檔案結構調一下
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const version = packageJson.version;

/**
 *  hunger-game  的標題。
 *
 *  hunger-game  標題的元件，裡面包含了標題的內容 (HUNGER GAME) 和版本號碼。
 */
const BtopLikeTitle = (): JSX.Element => {
	return (
		<>
			<Box
				flexDirection="row"
				alignItems="flex-end"
				justifyContent="center"
				height="100%"
			>
				<Gradient name="rainbow">
					<BigText text={gameTitle} font="block" />
				</Gradient>
				<Text>{version} Beta</Text>
			</Box>
		</>
	);
};

export default BtopLikeTitle;
