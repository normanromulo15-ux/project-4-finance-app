import { useState } from "react";
import BackButton from "../components/backButton.jsx";

export default function DebitTransaction() {
  const [transactionDetails, setTransactionDetails] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const { amount, category, description } = transactionDetails;

  // Function to handle user's transaction details input
  function handleTransactionDetailsInput(e) {
    const { name, value } = e.target;

    console.log(name, value);
    setTransactionDetails((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main className="relative h-dvh flex flex-col justify-start items-start px-8 pb-8 pt-40 gap-8">
      <BackButton endpoint={"/transaction"} />
      <h1 className="text-3xl font-bold">Transaction Details</h1>
      <form className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold" htmlFor="amount">
            Enter an amount (₱):
          </label>
          <input
            className="border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
            id="amount"
            name="amount"
            onChange={handleTransactionDetailsInput}
            placeholder="Amount must be greater than ₱0.00"
            type="number"
            value={amount}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold" htmlFor="category">
            Category:
          </label>
          <input
            type="text"
            className="border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
            id="category"
            list="transaction-categories"
            name="category"
            onChange={handleTransactionDetailsInput}
            placeholder="Type or search a category..."
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
        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold" htmlFor="description">
            Description:
          </label>
          <input
            type="text"
            className="border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
            id="description"
            name="description"
            onChange={handleTransactionDetailsInput}
            placeholder="Write a transaction description..."
            value={description}
          />
        </div>
      </form>
      <button
        className={`w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:bg-gray-300 disabled:cursor-not-allowed`}
        disabled={!amount || !category || !description}
      >
        Review Your Transaction
      </button>
    </main>
  );
}
