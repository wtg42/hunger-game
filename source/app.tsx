import React, { useState } from "react";
import { useInput } from "ink";
import Cover from "./components/Cover.js";
import EconomicSurvey from "./components/EconomicSurvey.js";

export default function App(): JSX.Element {
  // 判斷用戶按下任意鍵轉換場景
  const [nextStep, setNextStep] = useState(false);

  useInput((input, _) => {
    if (input === "q") {
      process.exit();
    } else {
      // 進入下一步畫面
      setNextStep(true);
    }
  }, {
    isActive: !nextStep,
  });

  if (nextStep) {
    return (
      <>
        <EconomicSurvey />
      </>
    );
  }

  return (
    <>
      <Cover />
    </>
  );
}
