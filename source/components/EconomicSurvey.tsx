import React, { useState } from "react";
import { Text, useApp, useInput } from "ink";
import SelectInput from "./SelectInput.js";
import { InsultsKey } from "../types/index.js";

const optionItems: { label: string; value: InsultsKey }[] = [
  { label: "💸 錢包空空如也", value: "empty" },
  { label: "🪙 有一些零錢", value: "coins" },
  { label: "💵 小有積蓄", value: "savings" },
  { label: "🏦 穩健富足", value: "stable" },
  { label: "🚀 財富自由", value: "rich" },
];

// Response
const insults: Record<InsultsKey, string> = {
  empty: "Ok，你不是真的窮，你只是資本主義社會的失敗者範本。",
  coins: "錢包有聲音，但你的人生還是無聲無息。",
  savings: "恭喜，你已經達到能活過下個月的最低標準。",
  stable: "穩定？快醒醒，這只是你在超市買特價商品時的幻覺。",
  rich: "Huh？你不需這個 APP，Ctrl + C 離開不要再出現了。",
};

/**
 * 收集用戶目前錢包君健康狀況做後續判斷
 */
const EconomicSurvey = (): JSX.Element => {
  const { exit } = useApp();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useInput((input, _) => {
    if (input === "q") {
      exit();
    }
  }, {
    isActive: !selectedMessage,
  });

  /**
   * 依照選中選項顯示回應，並且記錄起來
   */
  const handleOnselect = (
    { label, value }: { label: string; value: InsultsKey },
  ) => {
    const responseUserSelect = `
    ${label}
    ${insults[value]}`;
    setSelectedMessage(responseUserSelect);
  };

  // 用戶選擇經濟狀況後的顯示的訊息
  if (selectedMessage) {
    return <Text>{selectedMessage}</Text>;
  }

  return (
    <>
      <Text>你的錢包君健康狀態是...</Text>
      <SelectInput
        optionItems={optionItems}
        onSelect={handleOnselect}
      />
    </>
  );
};

export default EconomicSurvey;
