import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

/**
 * 讓子元素 (children) 閃爍顯示的元件。
 *
 * @example
 * <BlinkingText>Hello World</BlinkingText>
 */
const BlinkingText = ({children}: {children: React.ReactNode}): JSX.Element => {
  // 顯示或隱藏文字
  const [visible, setVisible] = useState(true);

  // 在掛載時候 設定定時器閃爍
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((visible) => !visible);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return visible ? <Text>{children}</Text> : <Text> </Text>;
}

export default BlinkingText