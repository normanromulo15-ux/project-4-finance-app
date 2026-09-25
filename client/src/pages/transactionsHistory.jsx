import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getTransactionHistory } from "../services/app.js";
import { getAccountTransactionHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { formatNumber } from "../utils/formatters.js";
import { formatTimestamp } from "../utils/formatters.js";
import PageNavigationBar from "../components/pageNavigationBar.jsx";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const [entryCounts, setEntryCounts] = useState({
    cash: 0,
    eWallet: 0,
    savings: 0,
    current: 0,
    total: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const defaultPage = localStorage.getItem("page") || page;
  const category = searchParams.get("category") || "all";
  const defaultCategory = localStorage.getItem("category") || category;

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
      ? getAllTransactionHistory()
      : getOneAccountTransactionHistory();
  }, [page, category]);

  // Function to retrieve the account's transaction entry counts
  async function getAccountsEntryCounts() {
    try {
      const [cashEntries, eWalletEntries, savingsEntries] = await Promise.all([
        getAccountTransactionHistory("cash", page),
        getAccountTransactionHistory("eWallet", page),
        getAccountTransactionHistory("savings", page),
      ]);
      const { accountNumberOfTransactions: cashCount } = cashEntries;
      const { accountNumberOfTransactions: eWalletCount } = eWalletEntries;
      const { accountNumberOfTransactions: savingsCount } = savingsEntries;
      setEntryCounts((prev) => {
        return {
          ...prev,
          cash: Number(cashCount),
          eWallet: Number(eWalletCount),
          savings: Number(savingsCount),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle the retrieval of the paginated transaction history
  async function getAllTransactionHistory() {
    try {
      const response = await getTransactionHistory(page);
      const { allTransactions, totalNumberOfTransactions } = response;
      setTransactions(allTransactions);
      setEntryCounts((prev) => ({
        ...prev,
        current: Number(totalNumberOfTransactions),
        total: Number(totalNumberOfTransactions),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  // Function to retrieve a specific account's transaction history
  async function getOneAccountTransactionHistory() {
    try {
      const { accountNumberOfTransactions, accountTransactions } =
        await getAccountTransactionHistory(category, page);
      setTransactions(accountTransactions);
      setEntryCounts((prev) => ({
        ...prev,
        current: Number(accountNumberOfTransactions),
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
      <div className="h-dvh flex flex-col pt-16 gap-4 p-8">
        <header>
          <h1 className="font-bold text-3xl">Transaction History</h1>
        </header>
        <main className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center gap-2 text-xs">
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "all" && "text-white bg-black"}`}
              name="all"
              onClick={handleAccountCategoryChoice}
            >
              All ({formatNumber(entryCounts.total)})
            </button>
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "cash" && "text-white bg-black"}`}
              name="cash"
              onClick={handleAccountCategoryChoice}
            >
              Cash ({formatNumber(entryCounts.cash)})
            </button>
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "eWallet" && "text-white bg-black"}`}
              name="eWallet"
              onClick={handleAccountCategoryChoice}
            >
              E-Wallet ({formatNumber(entryCounts.eWallet)})
            </button>
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "savings" && "text-white bg-black"}`}
              name="savings"
              onClick={handleAccountCategoryChoice}
            >
              Savings ({formatNumber(entryCounts.savings)})
            </button>
          </div>
          <section className="flex flex-col ">
            {transactions.map((e, i) => {
              return (
                <div
                  className={`cursor-pointer px-2 py-3 border-b border-gray-500 flex flex-col gap-1 ${i % 2 !== 0 && "bg-gray-100"} ${i === 0 && "border-t border-gray-500"}`}
                  key={e.reference_id}
                >
                  <p className="text-sm font-medium">
                    {formatTimestamp(e.created_at)}
                  </p>

                  <div className="flex items-center">
                    <p className="flex-3 font-semibold">{e.description}</p>
                    <p
                      className={`flex-2 text-end font-semibold ${e.type === "credit" ? "text-green-600" : "text-red-600"}`}
                    >
                      {e.type === "credit"
                        ? `+${formatCurrency(Number(e.amount))}`
                        : `-${formatCurrency(Number(e.amount))}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
        <footer>
          <PageNavigationBar
            totalEntries={entryCounts.current}
            handlePageNavigation={handlePageNavigation}
            currentPage={Number(page)}
          />
        </footer>
      </div>
      <BackButton endpoint={"/"} page={"transactions"} />
    </>
  );
}
