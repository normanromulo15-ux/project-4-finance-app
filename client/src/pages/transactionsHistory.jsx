import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getTransactionHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatters.js";
import { formatTimestamp } from "../utils/formatters.js";
import PageNavigationBar from "../components/pageNavigationBar.jsx";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const defaultPage = localStorage.getItem("page") || page;

  useEffect(() => {
    setSearchParams({ page: defaultPage });
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
    setSearchParams({ page: navigatedPage });
  }

  return (
    <>
      <div className="h-dvh flex flex-col pt-16 justify-between p-8">
        <section className="flex flex-col gap-4">
          {transactions.map((e) => {
            return (
              <div
                className="cursor-pointer p-2 border-b-2 flex flex-col gap-1"
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
        <PageNavigationBar
          totalEntries={totalEntries}
          handlePageNavigation={handlePageNavigation}
          currentPage={Number(page)}
        />
      </div>
      <BackButton endpoint={"/"} page={"transactions"} />
    </>
  );
}
