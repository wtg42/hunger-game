import { Box, Text, useInput } from "ink";
import React, { useState } from "react";

type options = {
  label: string;
  value: string;
}

type SelectInputProps = {
  optionItems: options[];
  onSelect: (item: { label: string; value: string }) => void;
};

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
