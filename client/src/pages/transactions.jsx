import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getTransactionHistory } from "../services/app.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimestamp } from "../utils/formatTimestamp.js";
import PageNavigationBar from "../components/pageNavigationBar.jsx";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setSearchParams({ page: "1" });
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
    setSearchParams({ page });
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
                    className={`flex-2 text-end font-bold ${e.type === "credit" ? "text-green-600" : "text-red-600"}`}
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
          entryLength={totalEntries}
          handlePageNavigation={handlePageNavigation}
          page={page}
        />
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
