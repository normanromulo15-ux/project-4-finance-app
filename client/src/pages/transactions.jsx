import { useState } from "react";
import { useLoaderData } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimestamp } from "../utils/formatTimestamp.js";
import BackButton from "../components/backButton.jsx";

export default function Transactions() {
  const loaderData = useLoaderData();
  const [transactions, setTransactions] = useState(loaderData.transactionData);

  return (
    <>
      <div className="h-dvh flex flex-col pt-16 p-8">
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
      </div>
      <BackButton endpoint={"/"} />
    </>
  );
}
