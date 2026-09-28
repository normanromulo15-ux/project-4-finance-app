import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getAccountBalanceHistory } from "../services/app.js";
import { getTotalInterest } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { accounts } from "../utils/constants.js";
import NetChangeIndicator from "../components/netChangeIndicator.jsx";
import PeriodSelector from "../components/periodSelector.jsx";
import BalanceHistory from "../components/balanceHistoryChart.jsx";
import BackButton from "../components/backButton.jsx";

export default function AccountDashboard() {
  const { account } = useParams();
  const selectedAccount = accounts.find((e) => e.value === account);
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get("period") || "week";
  const [displayBalance, setDisplayBalance] = useState("");
  const [balances, setBalances] = useState([]);
  const [numericBalanceDifference, setNumericBalanceDifference] = useState(0);
  const [balanceDifference, setBalanceDifference] = useState("");
  const [netChangePercentage, setNetChangePercentage] = useState(null);
  const [averagePeriodBalance, setAveragePeriodBalance] = useState(null);
  const [interestEarned, setInterestEarned] = useState(null);

  useEffect(() => {
    const totalInterest = async () => {
      const { totalEarnedInterest } = await getTotalInterest();
      setInterestEarned(formatCurrency(Number(totalEarnedInterest)));
    };
    totalInterest();
  }, []);

  useEffect(() => {
    handleGetAccountBalanceInfo();
  }, [period]);

  // Function to handle the retrieval of an account's balance info over a specified period
  async function handleGetAccountBalanceInfo() {
    try {
      const response = await getAccountBalanceHistory(account, period);
      const { averagePeriodBalance, formattedPeriodBalances } = response;
      const { balance: latestPeriodBalance } = formattedPeriodBalances[0];
      const { balance: firstPeriodBalance } =
        formattedPeriodBalances[formattedPeriodBalances.length - 1];
      const balanceDifference =
        Number(latestPeriodBalance) - Number(firstPeriodBalance);
      setAveragePeriodBalance(formatCurrency(averagePeriodBalance));
      setNetChangePercentage(
        `${((balanceDifference / firstPeriodBalance) * 100).toFixed(2)}%`,
      );
      setNumericBalanceDifference(balanceDifference);
      setDisplayBalance(formatCurrency(Number(latestPeriodBalance)));
      setBalanceDifference(formatCurrency(balanceDifference));
      setBalances(formattedPeriodBalances.toReversed());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="h-dvh flex flex-col gap-8 p-8 pt-14 md:px-25 md:py-28">
        <header className="flex flex-col gap-2">
          <h1 className="font-medium text-2xl md:text-3xl">
            {selectedAccount.title} Available Balance
          </h1>
          <h2 className="font-semibold text-4xl md:text-5xl">
            {displayBalance}
          </h2>
          <NetChangeIndicator
            balanceDifference={balanceDifference}
            netChangePercentage={netChangePercentage}
            numericBalanceDifference={numericBalanceDifference}
          />
        </header>
        <PeriodSelector
          period={period}
          onPeriodChange={(period) => setSearchParams({ period })}
        />
        <BalanceHistory balances={balances} />
        <section className="flex flex-col gap-2 md:text-lg">
          <div className="border-b pb-1 border-gray-400 flex justify-between">
            <h5>Average Period Balance: </h5>
            <h5 className="font-medium">{averagePeriodBalance}</h5>
          </div>
          {account === "savings" && (
            <div className="border-b pb-1 border-gray-400 flex justify-between">
              <h5>Total Interest Earned: </h5>
              <h5 className="font-medium">{interestEarned}</h5>
            </div>
          )}
        </section>
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
