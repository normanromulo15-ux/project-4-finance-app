import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { addTransaction } from "../services/app.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { transactionCategories } from "../utils/transactionCategories.js";
import BackButton from "../components/backButton.jsx";
import TransactionConfirmation from "../components/overlays/transactionConfirmation.jsx";

export default function TransactionDetails() {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState({
    account: "",
    amount: "",
    category: "",
    description: "",
    type: "",
  });
  const { account, amount, category, description } = transactionDetails;

  const [formatAmount, setFormatAmount] = useState(0);
  const [accountName, setAccountName] = useState("");
  const [showTransactionConfirmation, setShowTransactionConfirmation] =
    useState(false);
  const { transactionType, accountType } = useParams();
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
    setTransactionDetails((prev) => ({
      ...prev,
      account: accountType,
      category: transactionType === "credit" ? "Financial" : prev.category,
      type: transactionType,
    }));
  }

  // Function to handle the transaction submission
  async function handleTransactionSubmission(e) {
    e.preventDefault();
    try {
      const response = await addTransaction(transactionDetails);
      const {
        storedTransactionAmount: transactionAmount,
        transactionReferenceId: refNo,
        transactionTimestamp: timestamp,
      } = response;

      navigate(
        `/${transactionType}/${accountType}/success?amount=${transactionAmount}&refNo=${refNo}&timestamp=${timestamp}`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        <TransactionConfirmation
          handleTransactionSubmission={handleTransactionSubmission}
          transactionType={transactionType}
          formatAmount={formatAmount}
          accountName={accountName}
          capitalizeFirstLetter={capitalizeFirstLetter}
          account={account}
          category={category}
          description={description}
          handleDisplayTransactionConfirmation={
            handleDisplayTransactionConfirmation
          }
        />
      )}
    </>
  );
}
