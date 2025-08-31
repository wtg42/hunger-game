// eslint-disable-next-line n/file-extension-in-import
import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node', // Ink 需要 Node 環境
		globals: true,
		testTimeout: 10_000, // 10 秒超時
	},
	esbuild: {
		target: 'node16', // 確保與 Node 版本匹配
	},
});
