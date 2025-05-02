import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";

const Notification = (
  { message, duration, onDone }: {
    message: string;
    duration: number;
    onDone: () => void;
  },
) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, duration);
  }, [duration]);

  useEffect(() => {
    if (done) {
      onDone();
    }
  }, [done, onDone]);

  if (done) {
    return null;
  }

  return (
    <Box flexDirection="column" alignItems="center">
      <Text color="yellow">{message}</Text>
    </Box>
  );
};

export default Notification;
