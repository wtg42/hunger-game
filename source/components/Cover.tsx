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
    <Box flexDirection="column">
      <Box margin={2}>
        <Text color="gray">"You are alone... Choose wisely."</Text>
      </Box>
      <Box margin={1}>
        <Text color="cyan">[Enter]</Text>
        <Text>吃什麼？隨便、都可以 🤷‍♂️</Text>
      </Box>
      <Box margin={1}>
        <Text color="green">[M]</Text>
        <Text>想要有新菜單？進去試試看吧 🤙</Text>
      </Box>
      <Box margin={1}>
        <Text color="red">[Q]</Text>
        <Text>Good Bye~ ☠️</Text>
      </Box>
    </Box>
    <Box marginTop={3}>
      <BlinkingText>請選擇一個項目</BlinkingText>
    </Box>
  </Box>
);

export default Cover;
