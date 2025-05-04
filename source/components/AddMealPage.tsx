import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

// 定義要詢問用戶的問題列表
const questions = [
  "❤️ 新增收藏品項：",
  "⭐️ 喜愛程度(1~5)：",
  "📌 Tags(咖哩、麵包、素食...)：",
  "📝 額外說明：",
];

/**
 * 新增餐點頁面元件
 *
 * 逐步詢問用戶問題，收集餐點資訊。
 */
const AddMealPage = () => {
  // 用戶當前輸入的內容
  const [inputStatement, setInputStatetment] = useState("");

  // 儲存用戶對每個問題的回答
  const [logs, setLogs] = useState<string[]>([]);

  // 當前進行到第幾個問題的索引 (從 0 開始)
  const [step, setStep] = useState(0);

  // 判斷是否所有問題都已回答完畢
  const questionDone = step === questions.length;

  React.useEffect(() => {
    console.log(logs)
  }, [logs])

  useInput((input, key) => {
    if (key.return) {
      setStep((prev) => {
        if (prev >= questions.length) {
          return prev
        }
        return prev + 1;
      });

      // write into logs and reset input.
      setLogs((prev) => {
        // 問題已回答完畢只需要顯示已有的回答
        if (questionDone) {
          return prev
        }
        return [...prev, inputStatement]
      });
      setInputStatetment("");
      return;
    }
    setInputStatetment((prev) => prev + input);
  });
  return (
    <Box flexDirection="column">
      <Box
        flexDirection="column"
        margin={1}
        borderColor="yellow"
        borderStyle={"round"}
      >
        <Text
          color={"cyan"}
          dimColor={true}
        >
          {questionDone ? "" : questions[step] ?? " "}
        </Text>
        {questionDone && logs.length > 0 && (
          logs.map((item: string, index: number) => (
            <Text key={`${index}-${item}`}>
              {`${questions[index]}: ${item.slice(0, 1)}`}
              {/* {`${questions[index]}: `} */}
            </Text>
          ))
        )}
      </Box>
      <Box
        flexDirection="column"
        margin={1}
        borderColor="green"
        borderStyle={"round"}
      >
        <Text color="cyan">{inputStatement || " "}</Text>
      </Box>
    </Box>
  );
};

export default AddMealPage;
