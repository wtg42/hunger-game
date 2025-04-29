import React, { useState } from "react";
import { useInput, useApp } from "ink";
import Cover from "./components/Cover.js";
import EconomicSurvey from "./components/EconomicSurvey.js";

export default function App(): JSX.Element {
  // 判斷用戶按下任意鍵轉換場景
  const [nextStep, setNextStep] = useState(false);

  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "q") {
      exit();
    } else if (key.return) {
      setNextStep(true);
    } else if (input === "m") {
      // 進入餐廳編輯畫面
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
