import { Box, Text, useInput } from "ink";
import React, { useState } from "react";
import { InsultsKey } from "../types/index.js";

type options = {
  label: string;
  value: InsultsKey;
}

type SelectInputProps = {
  optionItems: options[];
  onSelect: (item: { label: string; value: InsultsKey }) => void;
};

/**
 * 下拉式選單共用元件
 *
 * 傳入要顯示的選項 optionItems 跟 選中後的 callback onSelect()
 */
const SelectInput = ({ optionItems, onSelect }: SelectInputProps): JSX.Element => {
  // Cursor position
  const [index, setIndex] = useState(0);

  useInput((_, key) => {
    if (key.upArrow) {
      setIndex((index) => Math.max(0, index - 1));
    } else if (key.downArrow) {
      setIndex((index) => Math.min(optionItems.length - 1, index + 1));
    } else if (key.return && optionItems[index]) {
      onSelect(optionItems[index]);
    }
  });

  return (
    <>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="yellow"
      >
        {optionItems.map((item, i) => (
          <Text key={item.value}>
            {i === index ? "> " : "  "}
            {item.label}
          </Text>
        ))}
      </Box>
    </>
  );
};

export default SelectInput;
