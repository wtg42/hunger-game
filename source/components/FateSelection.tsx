import React, { useEffect, useState } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";
import { pickRestaurant } from "../db.js"; // 你自己的 db 讀取

interface FateSelectionProps {
  walletStatus: string; // 用戶選擇的經濟狀況，例如 "empty", "coins", "savings" 這類
}

const FateSelection = ({ walletStatus }: FateSelectionProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const options = pickRestaurant();
    // 這邊可以加更細緻的經濟狀態過濾，例如空空的就挑 weight 最低的
    const picked = options[0]; // 目前先拿第一個當挑選結果
    setRestaurant(picked?.name || "沒有找到合適的餐廳...");
    setLoading(false);

    setTimeout(pickRestaurant, 1500); // 小小延遲，做出正在篩選的感覺
  }, [walletStatus]);

  if (loading) {
    return (
      <Box flexDirection="column" alignItems="center">
        <Text color="cyan"><Spinner type="dots" /> 正在召喚命運的餐廳...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" alignItems="center" marginTop={1}>
      <Text color="green">你的命運餐廳是：</Text>
      <Text bold color="yellow">{restaurant}</Text>
      <Text color="gray">（根據你的經濟狀況: {walletStatus}）</Text>
    </Box>
  );
};

export default FateSelection;
