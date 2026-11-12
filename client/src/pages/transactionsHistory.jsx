import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getTransactionHistory, getUserAccounts } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { formatNumber } from "../utils/formatters.js";
import { formatTimestamp } from "../utils/formatters.js";
import PageNavigationBar from "../components/pageNavigationBar.jsx";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const theme = localStorage.getItem("theme") || "light";
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const category = searchParams.get("category") || "all";
  const defaultPage = localStorage.getItem("page") || page;
  const defaultCategory = localStorage.getItem("category") || category;
  const [entryCounts, setEntryCounts] = useState({
    cash: 0,
    eWallet: 0,
    savings: 0,
    currentAccount: 0,
    total: 0,
  });
  const accounts = [
    {
      label: "All",
      value: "all",
      displayCount: formatNumber(entryCounts.total),
    },
    {
      label: "Cash",
      value: "cash",
      displayCount: formatNumber(entryCounts.cash),
    },
    {
      label: "E-Wallet",
      value: "eWallet",
      displayCount: formatNumber(entryCounts.eWallet),
    },
    {
      label: "Savings",
      value: "savings",
      displayCount: formatNumber(entryCounts.savings),
    },
  ];
  const [displayedTransactionDetails, setDisplayedTransactionsDetails] =
    useState([]);

  useEffect(() => {
    setSearchParams({ page: defaultPage, category: defaultCategory });
    getAccountsEntryCounts();
  }, []);

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("page", "1");
      return prev;
    });
  }, [category]);

  useEffect(() => {
    category === "all"
      ? getAllTransactionsHistory()
      : getOneAccountTransactionsHistory();
  }, [page, category]);

  // Function to retrieve the account's transaction entry counts
  async function getAccountsEntryCounts() {
    try {
      const { accounts } = await getUserAccounts();
      const accountsEntriesPromise = accounts.map((account) =>
        getTransactionHistory(page, account),
      );
      const accountsEntries = await Promise.all(accountsEntriesPromise);
      const entryCounts = accountsEntries.map((item) => {
        const { accountTransactionCount: count } = item;
        return Number(count);
      });
      setEntryCounts((prev) => {
        return {
          ...prev,
          cash: entryCounts[0],
          eWallet: entryCounts[1],
          savings: entryCounts[2],
          total: entryCounts.reduce((a, b) => a + b, 0),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle the retrieval of the paginated transaction history
  async function getAllTransactionsHistory() {
    try {
      const response = await getTransactionHistory(page);
      const { allPaginatedTransactions, totalTransactionsCount } = response;
      setDisplayedTransactionsDetails(allPaginatedTransactions);
      setEntryCounts((prev) => ({
        ...prev,
        currentAccount: Number(totalTransactionsCount),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  // Function to retrieve a specific account's transaction history
  async function getOneAccountTransactionsHistory() {
    try {
      const { accountPaginatedTransactions, accountTransactionCount } =
        await getTransactionHistory(page, category);
      setDisplayedTransactionsDetails(accountPaginatedTransactions);
      setEntryCounts((prev) => ({
        ...prev,
        currentAccount: Number(accountTransactionCount),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle the page navigation
  function handlePageNavigation(page) {
    const navigatedPage = String(page);
    localStorage.setItem("page", navigatedPage);
    setSearchParams((prev) => {
      prev.set("page", navigatedPage);
      return prev;
    });
  }

  // Function to handle the account category choice
  function handleAccountCategoryChoice(e) {
    const { name: accountType } = e.target;
    localStorage.setItem("category", accountType);
    setSearchParams((prev) => {
      prev.set("category", accountType);
      return prev;
    });
  }

  return (
    <>
      <BackButton endpoint={"/"} page={"transactions"} />
      <div
        className={`min-h-dvh flex flex-col gap-4 pt-18 p-8 md:gap-8 md:px-25 md:pt-28 lg:px-40 lg:py-12 ${theme === "dark" ? "text-white bg-gray-950" : "text-black bg-white"}`}
      >
        <header>
          <h1 className="font-bold text-3xl text-center md:text-4xl">
            Transaction History
          </h1>
        </header>
        <main className="flex-1 flex flex-col gap-4 md:gap-8 lg:items-center">
          <div className="flex justify-center gap-2 text-xs md:text-base md:gap-4 lg:gap-6">
            {accounts.map((option) => {
              const { value, label, displayCount } = option;
              return (
                <button
                  key={value}
                  className={`transition-all duration-200 active:scale-95 hover:scale-105 cursor-pointer px-3 py-1 rounded-full font-semibold border border-gray-400 ${category === value ? (theme === "dark" ? "text-black bg-white" : "text-white bg-black") : theme === "dark" ? "text-white bg-black" : "text-black bg-white"} ${theme === "dark" ? "active:bg-gray-800 active:text-white" : "active:bg-gray-200 active:text-black"}`}
                  name={value}
                  onClick={handleAccountCategoryChoice}
                >
                  {label} ({displayCount})
                </button>
              );
            })}
          </div>
          <section className="flex flex-col md:text-lg lg:w-3/4">
            {displayedTransactionDetails.map((transaction, index) => {
              const {
                account,
                amount: transactionAmount,
                reference_id: transactionReferenceID,
                created_at: transactionTimestamp,
                description: transactionDescription,
                type: transactionType,
              } = transaction;

              let accountType;
              switch (account) {
                case "cash":
                  accountType = "Cash";
                  break;
                case "eWallet":
                  accountType = "E-Wallet";
                  break;
                case "savings":
                  accountType = "Savings";
                  break;
              }

              return (
                <div
                  className={`px-2 py-3 border-b border-gray-500 flex flex-col gap-1 ${index % 2 !== 0 ? (theme === "dark" ? "bg-gray-900" : "bg-gray-100") : theme === "dark" ? "bg-gray-800" : "bg-white"} ${index === 0 && "border-t border-gray-500"}`}
                  key={transactionReferenceID}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <p>{formatTimestamp(transactionTimestamp)}</p>
                    <p>{accountType}</p>
                  </div>

                  <div className="flex items-center">
                    <p className="flex-3 font-semibold">
                      {transactionDescription}
                    </p>
                    <p
                      className={`flex-2 text-end font-semibold ${transactionType === "credit" ? (theme === "dark" ? "text-green-400" : "text-green-700") : theme === "dark" ? "text-red-400" : "text-red-700"}`}
                    >
                      {transactionType === "credit"
                        ? `+${formatCurrency(Number(transactionAmount))}`
                        : `-${formatCurrency(Number(transactionAmount))}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
        <footer>
          <PageNavigationBar
            theme={theme}
            totalEntries={entryCounts.currentAccount}
            handlePageNavigation={handlePageNavigation}
            currentPage={Number(page)}
          />
        </footer>
      </div>
    </>
  );
}
