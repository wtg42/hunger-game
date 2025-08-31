import React, {useEffect, useState} from 'react';
import {Text} from 'ink';

/**
 * 讓子元素 (children) 閃爍顯示的元件。
 *
 * @example
 * <BlinkingText>Hello World</BlinkingText>
 */
function BlinkingText({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	// 顯示或隱藏文字
	const [visible, setVisible] = useState(true);

	// 在掛載時候 設定定時器閃爍
	useEffect(() => {
		const interval = setInterval(() => {
			setVisible(previousVisible => !previousVisible);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// You need to leave a space, otherwise the screen will look wired.
	return visible ? <Text>{children}</Text> : <Text> </Text>;
}

export default BlinkingText;
