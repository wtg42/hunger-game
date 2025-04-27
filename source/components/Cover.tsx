import React from "react";
import { Box, Text } from "ink";
import BlinkingText from "./BlinkingText.js";
import BtopLikeTitle from "./BtopLikeTitle.js";

/**
 * The Cover component serves as the introductory screen of the application.
 */
const Cover = (): JSX.Element => (
  <Box
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100%"
  >
    <BtopLikeTitle />
    <Box marginTop={1}>
      <Text color="gray">"You are alone... Choose wisely."</Text>
    </Box>
    <Box marginTop={2}>
      <BlinkingText>請按任意鍵開始或輸入 q 離開...</BlinkingText>
    </Box>
  </Box>
);

export default Cover;
