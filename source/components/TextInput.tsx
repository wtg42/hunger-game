import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

const cursor = "▶ ";
const TextInput = ({value, onChange}: {value: string, onChange: (value: string) => void}) => {
  React.useEffect(() => {
    onChange("")
  }, [])

  const [ active, setActive ] = useState(true)

  useInput((input, key) => {
    if (key.return) {
      setActive(false)
      return
    }
    onChange(input)
  }, {
    isActive: active
  })

  return (
    <Box>
      <Text>{cursor + value}</Text>
    </Box>
  )
}

export default TextInput;