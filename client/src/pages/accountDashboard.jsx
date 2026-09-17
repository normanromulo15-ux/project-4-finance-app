import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getAccountBalanceHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import {
  CartesianGrid,
  AreaChart,
  Area,
  Line,
  LineChart,
  YAxis,
} from "recharts";

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
      setBalances(formattedPeriodBalances.toReversed());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-dvh flex flex-col gap-8 p-8 pt-10">
      <header>
        <h1 className="font-normal text-2xl">Latest Balance</h1>
        <h2 className="font-semibold text-4xl">{displayBalance}</h2>
      </header>
      <section>
        <AreaChart
          style={{ width: "100%", aspectRatio: 1.618, maxWidth: 600 }}
          responsive
          data={balances}
        >
          <CartesianGrid />
          <Area
            fill="#C5C7F2"
            stroke="#2830C9"
            strokeWidth={2}
            dataKey="balance"
          />
          <YAxis
            width="auto"
            label={{ value: "Balance", position: "insideLeft", angle: -90 }}
          />
        </AreaChart>
      </section>
    </div>
  );
}
