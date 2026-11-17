import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getAccountBalanceHistory } from "../services/app.js";
import { getTotalInterest, getCurrentBalance } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { accounts } from "../utils/constants.js";
import NetChangeIndicator from "../components/netChangeIndicator.jsx";
import PeriodSelector from "../components/periodSelector.jsx";
import BalanceHistoryChart from "../components/balanceHistoryChart.jsx";
import BackButton from "../components/backButton.jsx";

export default function AccountDashboard() {
  const theme = localStorage.getItem("theme") || "light";
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
    switch (selectedAccount.value) {
      case "savings":
        const totalInterest = async () => {
          const { totalEarnedInterest } = await getTotalInterest();
          setInterestEarned(formatCurrency(Number(totalEarnedInterest)));
        };
        totalInterest();
        break;
    }
  }, []);

  useEffect(() => {
    handleGetAccountBalanceInfo();
  }, [period]);

  // Function to handle the retrieval of an account's balance info over a specified period
  async function handleGetAccountBalanceInfo() {
    try {
      const response = await getAccountBalanceHistory(account, period);
      const { averagePeriodBalance, formattedPeriodBalances } = response;
      const { latestAccountBalance } = await getCurrentBalance(account);
      const firstPeriodBalance =
        formattedPeriodBalances[0]?.balance ?? latestAccountBalance;
      const latestPeriodBalance =
        formattedPeriodBalances[formattedPeriodBalances.length - 1]?.balance ??
        latestAccountBalance;
      const balanceDifference =
        Number(latestPeriodBalance) - Number(firstPeriodBalance) || 0;
      setAveragePeriodBalance(
        formatCurrency(averagePeriodBalance || latestAccountBalance),
      );
      setNetChangePercentage(
        `${((balanceDifference / firstPeriodBalance) * 100).toFixed(2)}%`,
      );
      setNumericBalanceDifference(balanceDifference);
      setDisplayBalance(formatCurrency(Number(latestPeriodBalance)));
      setBalanceDifference(formatCurrency(balanceDifference));
      setBalances(
        formattedPeriodBalances.length >= 1
          ? formattedPeriodBalances
          : [
              {
                balance: latestAccountBalance,
                balanceTimestamp: new Date().toISOString(),
              },
            ],
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <div
        className={`min-h-dvh flex flex-col gap-8 p-8 pt-18 md:px-25 md:py-28 lg:px-40 lg:py-12 lg:justify-center ${theme === "dark" ? "bg-gray-950 text-white" : "text-black bg-white"}`}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
          <header className="flex flex-col gap-8 lg:flex-2">
            <section className="flex flex-col gap-2">
              <h1 className="font-medium text-2xl md:text-3xl lg:text-4xl">
                {selectedAccount.title} Balance
              </h1>
              <h2 className="font-semibold text-4xl md:text-5xl lg:text-6xl">
                {displayBalance}
              </h2>
              <NetChangeIndicator
                theme={theme}
                balanceDifference={balanceDifference}
                netChangePercentage={netChangePercentage}
                numericBalanceDifference={numericBalanceDifference}
              />
              {account === "savings" && (
                <h3 className="text-xl md:text-2xl lg:text-3xl">
                  Total Interest Earned:{" "}
                  <span
                    className={`font-medium ${theme === "dark" ? "text-green-400" : "text-[#046E00]"}`}
                  >
                    {interestEarned}
                  </span>
                </h3>
              )}
            </section>
            <section className="flex flex-col gap-2 md:text-lg lg:text-xl">
              <div className="border-b pb-1 border-gray-400 flex justify-between">
                <h5>Average Period Balance: </h5>
                <h5 className="font-medium">{averagePeriodBalance}</h5>
              </div>
            </section>
          </header>
          <section className="flex flex-col gap-8 lg:flex-3">
            <PeriodSelector
              theme={theme}
              period={period}
              onPeriodChange={(period) => setSearchParams({ period })}
            />
            <BalanceHistoryChart theme={theme} balances={balances} />
          </section>
        </div>
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
