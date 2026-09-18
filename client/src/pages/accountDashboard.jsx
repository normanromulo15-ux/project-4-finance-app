import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getAccountBalanceHistory } from "../services/app.js";
import { getTotalInterest } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import PeriodSelector from "../components/periodSelector.jsx";
import BalanceHistory from "../components/areaChartForBalances.jsx";
import BackButton from "../components/backButton.jsx";

export default function AccountDashboard() {
  const { account } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get("period") || "week";
  const [displayBalance, setDisplayBalance] = useState("");
  const [balances, setBalances] = useState([]);
  const [interestEarned, setInterestEarned] = useState(null);

  useEffect(() => {
    const totalInterest = async () => {
      const { totalEarnedInterest } = await getTotalInterest();
      setInterestEarned(formatCurrency(Number(totalEarnedInterest)));
    };
    totalInterest();
  }, []);

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
    <>
      <div className="h-dvh flex flex-col gap-8 p-8 pt-12">
        <header>
          <h1 className="font-normal text-2xl">Available Balance</h1>
          <h2 className="font-semibold text-4xl">{displayBalance}</h2>
        </header>
        <PeriodSelector
          period={period}
          onPeriodChange={(period) => setSearchParams({ period })}
        />
        <BalanceHistory balances={balances} />
        {account === "savings" && (
          <div className="rounded-lg border border-[#2830C9] border-t-4 p-2 bg-blue-50 text-blue-900">
            <h3 className="text-lg">
              Total Interest Earned:{" "}
              <span className="font-medium">{interestEarned}</span>
            </h3>
            <h4 className="text-xs">Since August 4, 2026</h4>
          </div>
        )}
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
