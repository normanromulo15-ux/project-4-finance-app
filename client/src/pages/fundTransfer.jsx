import { useState } from "react";
import { useLoaderData } from "react-router";
import { formatCurrency } from "../utils/formatCurrency.js";
import { transferFunds } from "../services/app.js";
import BackButton from "../components/backButton.jsx";

export default function FundTransfer() {
  const [transferDetails, setTransferDetails] = useState({
    originAccount: "",
    destinationAccount: "",
    transferAmount: "",
    transferFeePercentage: "0.00",
  });
  const {
    originAccount,
    destinationAccount,
    transferAmount,
    transferFeePercentage,
  } = transferDetails;
  const [availableOriginAccountBalance, setAvailableOriginAccountBalance] =
    useState(null);
  const { fullName, cash, eWallet, savings } = useLoaderData();
  const accountBalances = [
    {
      account: "cash",
      balance: formatCurrency(Number(cash.latestAccountBalance)),
    },
    {
      account: "eWallet",
      balance: formatCurrency(Number(eWallet.latestAccountBalance)),
    },
    {
      account: "savings",
      balance: formatCurrency(Number(savings.latestAccountBalance)),
    },
  ];

  // Function to handle the user's choice of the origin account
  function handleOriginAccountChoice(e) {
    const { value } = e.target;
    const selectedAccount = accountBalances.find((e) => e.account === value);
    if (selectedAccount !== undefined) {
      const { balance } = selectedAccount;
      setAvailableOriginAccountBalance(balance);
      setTransferDetails((prev) => ({ ...prev, originAccount: value }));
    } else {
      setAvailableOriginAccountBalance(null);
    }
  }

  return (
    <main className="relative h-dvh flex flex-col gap-8 p-8">
      <h1 className="text-center text-3xl font-bold w-full">Transfer Funds</h1>
      <form className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="origin-account">
            From:
          </label>
          <select
            className="cursor-pointer border p-2 font-medium rounded-lg"
            id="origin-account"
            name="origin"
            onChange={handleOriginAccountChoice}
          >
            <option value="">--Select an account--</option>
            <option value="cash">Cash</option>
            <option value="eWallet">E-Wallet</option>
            <option value="savings">Savings</option>
          </select>
          {availableOriginAccountBalance && (
            <p className="text-sm font-medium">
              Available balance: {availableOriginAccountBalance}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="amount">
            Amount To Transfer (₱):
          </label>
          <input
            className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
            id="amount"
            placeholder="Amount must be greater than ₱0.00"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="transfer-fee">
            Transfer Fee Percentage (%):
          </label>
          <input
            className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
            id="transfer-fee"
            placeholder="Amount must be equal or greater than 0"
            type="number"
            value={transferFeePercentage}
            readOnly
          />
        </div>
      </form>
      <BackButton endpoint={"/"} />
    </main>
  );
}
