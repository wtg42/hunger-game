import React from 'react';
import { Text, useApp, useInput } from 'ink';
import SelectInput from './SelectInput.js';

const optionItems = [
  { label: "💸 錢包空空如也", value: "empty" },
  { label: "🪙 有一些零錢", value: "coins" },
  { label: "💵 小有積蓄", value: "savings" },
  { label: "🏦 穩健富足", value: "stable" },
  { label: "🚀 財富自由", value: "rich" },
];

const EconomicSurvey = (): JSX.Element => {
  const { exit } = useApp();

  useInput((input, _) => {
    if (input === 'q') {
      exit();
    }
  }, {
    isActive: true,
  })

  const handleOnselect = ({ label, value }: { label: string; value: string }) => {
    console.log(label, value);
  }

  return (
    <>
      <Text>你的錢包君健康狀態是...</Text>
      <SelectInput
        optionItems={optionItems}
        onSelect={handleOnselect}
      />
    </>
  )
}

export default EconomicSurvey;