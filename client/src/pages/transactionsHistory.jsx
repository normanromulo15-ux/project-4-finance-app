import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getTransactionHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { formatNumber } from "../utils/formatters.js";
import { formatTimestamp } from "../utils/formatters.js";
import PageNavigationBar from "../components/pageNavigationBar.jsx";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const defaultPage = localStorage.getItem("page") || page;
  const category = searchParams.get("category") || "all";
  const defaultCategory = localStorage.getItem("category") || category;

  useEffect(() => {
    setSearchParams({ page: defaultPage, category: defaultCategory });
  }, []);

  useEffect(() => {
    handleTransactionHistory();
  }, [page]);

  // Function to handle the retrieval of the paginated transaction history
  async function handleTransactionHistory() {
    try {
      const { data } = await getTransactionHistory(page);
      const { transactionData, totalLength } = data;
      setTransactions(transactionData);
      setTotalEntries(Number(totalLength));
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
    const { name } = e.target;
    localStorage.setItem("category", name);
    setSearchParams((prev) => {
      prev.set("category", name);
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
          <div className="flex justify-center gap-4 text-xs">
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "all" && "text-white bg-black"}`}
              name="all"
              onClick={handleAccountCategoryChoice}
            >
              All ({formatNumber(totalEntries)})
            </button>
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "cash" && "text-white bg-black"}`}
              name="cash"
              onClick={handleAccountCategoryChoice}
            >
              Cash (432)
            </button>
            <button
              className={`px-3 py-1 rounded-full font-semibold  border border-gray-400 ${category === "eWallet" && "text-white bg-black"}`}
              name="eWallet"
              onClick={handleAccountCategoryChoice}
            >
              E-Wallet (311)
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
            totalEntries={totalEntries}
            handlePageNavigation={handlePageNavigation}
            currentPage={Number(page)}
          />
        </footer>
      </div>
      <BackButton endpoint={"/"} page={"transactions"} />
    </>
  );
}
