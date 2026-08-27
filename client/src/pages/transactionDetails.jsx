import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { transactionCategories } from "../utils/transactionCategories.js";
import BackButton from "../components/backButton.jsx";

export default function TransactionDetails() {
  const [transactionDetails, setTransactionDetails] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const { amount, category, description } = transactionDetails;

  const [formatAmount, setFormatAmount] = useState(0);
  const [accountName, setAccountName] = useState("");
  const [showTransactionConfirmation, setShowTransactionConfirmation] =
    useState(false);
  const [showTransactionSuccess, setShowTransactionSuccess] = useState(false);
  const { transactionType } = useParams();
  const { firstName, lastName } = useLoaderData().userFullName;

  useEffect(() => {
    setAccountName(`${firstName} ${lastName}`);
    setFormatAmount(formatCurrency(Number(amount)));
  }, [showTransactionConfirmation, amount]);

  // Function to handle user's transaction details input
  function handleTransactionDetailsInput(e) {
    const { name, value } = e.target;

    setTransactionDetails((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle the display of transaction confirmation
  function handleDisplayTransactionConfirmation() {
    setShowTransactionConfirmation((prev) => !prev);
  }

  return (
    <>
      <main className="relative h-dvh flex flex-col justify-center items-center px-8 pb-8 pt-40 gap-8">
        <BackButton endpoint={`/${transactionType}`} />
        <h1 className="text-3xl font-bold">Transaction Details</h1>
        <form className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" htmlFor="amount">
              Enter an amount (₱):
            </label>
            <input
              className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
              id="amount"
              name="amount"
              onChange={handleTransactionDetailsInput}
              placeholder="Amount must be greater than ₱0.00"
              required={true}
              type="number"
              value={amount}
            />
          </div>
          {transactionType === "debit" && (
            <div className="w-full flex flex-col gap-1">
              <label className="font-semibold" htmlFor="category">
                Category:
              </label>
              <input
                type="text"
                className="cursor-text rounded-lg
              border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
                id="category"
                list="transaction-categories"
                name="category"
                onChange={handleTransactionDetailsInput}
                placeholder="Type or search a category..."
                required={true}
                value={category}
              />
              <datalist id="transaction-categories">
                <option value="Communication" />
                <option value="Education" />
                <option value="Financial" />
                <option value="Food" />
                <option value="Government" />
                <option value="Health" />
                <option value="Housing" />
                <option value="Leisure" />
                <option value="Personal" />
                <option value="Social" />
                <option value="Technology" />
                <option value="Transportation" />
                <option value="Utilities" />
                <option value="Work" />
              </datalist>
            </div>
          )}

          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" htmlFor="description">
              Description:
            </label>
            <input
              type="text"
              className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
              id="description"
              name="description"
              onChange={handleTransactionDetailsInput}
              placeholder="Write a transaction description..."
              required={true}
              value={description}
            />
          </div>
        </form>
        <button
          className="w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={
            Number(amount) <= 0 ||
            !amount.trim() ||
            (!transactionCategories.includes(category) &&
              transactionType === "debit") ||
            !description.trim()
          }
          onClick={handleDisplayTransactionConfirmation}
        >
          Review Your Transaction
        </button>
      </main>
      {showTransactionConfirmation && (
        <div className="z-10 fixed flex flex-col items-center justify-center h-dvh bg-black/70 p-8 inset-0">
          <div className="z-20 w-full flex flex-col items-center justify-start bg-white p-4 gap-2 border-4 border-[#2830c9] rounded-2xl">
            <h1 className="text-center text-xl font-bold">
              You are about to {transactionType === "debit" ? "spend" : "save"}{" "}
              {formatAmount}
            </h1>
            <h2 className="w-full text-left">
              <span className="font-semibold">Account Name:</span> {accountName}
            </h2>
            <h2 className="w-full text-left ">
              <span className="font-semibold">Amount:</span> {formatAmount}
            </h2>
            {transactionType === "debit" && (
              <h2 className="w-full text-left ">
                <span className="font-semibold">Category:</span> {category}
              </h2>
            )}
            <h2 className="w-full text-left ">
              <span className="font-semibold">Description:</span> {description}
            </h2>
            <p className="text-sm font-medium mt-2 pt-2 border-t-2">
              Please review the transaction details. This action can't be
              undone.{" "}
            </p>
            <section className="flex justify-center gap-4">
              <button
                className="bg-neutral-300 text-gray-700 text-base font-medium px-3 py-2 rounded-lg"
                onClick={handleDisplayTransactionConfirmation}
              >
                Close
              </button>
              <button className="bg-[#2830c9] text-white text-base font-medium px-3 py-2 rounded-lg">
                Confirm
              </button>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
