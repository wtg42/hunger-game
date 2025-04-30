import React, { useState } from "react";
import { useApp, useInput } from "ink";
import Cover from "./components/Cover.js";
import EconomicSurvey from "./components/EconomicSurvey.js";

type NextSetp = "return" | "m" | "";

export default function App(): JSX.Element {
  // 判斷用戶按下任意鍵轉換場景
  const [nextStep, setNextStep] = useState<NextSetp>("");

  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "q") {
      exit();
    } else if (key.return) {
      setNextStep("return");
    } else if (input === "m") {
      // 進入餐廳編輯畫面
      setNextStep("m");
    }
  }, {
    isActive: !nextStep,
  });

  if (nextStep === "return") {
    return (
      <>
        <EconomicSurvey />
      </>
    );
  }

  if (nextStep === "m") {
    //
  }

  return (
    <>
      <Cover />
    </>
  );
}
