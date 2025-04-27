import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';

const EconomicSurvey = (): JSX.Element => {
  const { exit } = useApp();

  useInput((input, _) => {
    if (input === 'q') {
      exit();
    }
  }, {
    isActive: true,
  })
  return (
    <Box>
      <Text>TODO: Economic Survey</Text>
    </Box>
  )
}

export default EconomicSurvey;