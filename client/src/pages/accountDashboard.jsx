import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getAccountBalanceHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { Line, LineChart } from "recharts";

export default function AccountDashboard() {
  const { account } = useParams();
  const [searchParams] = useSearchParams();
  const period = searchParams.get("period") || "week";
  const [displayBalance, setDisplayBalance] = useState("");
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    handleGetAccountBalanceHistory();
  }, [period]);

  // Function to handle the retrieval of an account's balance over a specified period
  async function handleGetAccountBalanceHistory() {
    try {
      const response = await getAccountBalanceHistory(account, period);
      const { formattedPeriodBalances } = response;
      const { balance } = formattedPeriodBalances[0];
      setDisplayBalance(formatCurrency(Number(balance)));
      setBalances(formattedPeriodBalances);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-dvh flex flex-col p-8 pt-10">
      <h1 className="font-normal text-2xl">Latest Balance</h1>
      <h2 className="font-semibold text-4xl">{displayBalance}</h2>
      <LineChart
        style={{ width: "100%", aspectRatio: 1.618, maxWidth: 500 }}
        responsive
        data={balances}
      >
        <Line dataKey="balance" />
      </LineChart>
    </div>
  );
}
