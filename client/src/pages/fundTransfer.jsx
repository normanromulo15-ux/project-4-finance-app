import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
import { transferFunds } from "../services/app.js";
import BackButton from "../components/backButton.jsx";

export default function FundTransfer() {
  const [amountInputType, setAmountInputType] = useState("number");
  const [transferDetails, setTransferDetails] = useState({
    originAccount: "",
    destinationAccount: "",
    transferAmount: "",
    transferFeePercentage: 0,
  });
  const {
    originAccount,
    destinationAccount,
    transferAmount,
    transferFeePercentage,
  } = transferDetails;
  const [selectedOriginAccount, setSelectedOriginAccount] = useState({
    account: null,
    balance: null,
    displayName: null,
  });
  const [finalTransferAmount, setFinalTransferAmount] = useState(null);
  const { cash, eWallet, savings } = useLoaderData();
  const navigate = useNavigate();
  const accountBalances = [
    {
      account: "cash",
      balance: formatCurrency(Number(cash.latestAccountBalance)),
      displayName: "Cash",
    },
    {
      account: "eWallet",
      balance: formatCurrency(Number(eWallet.latestAccountBalance)),
      displayName: "E-Wallet",
    },
    {
      account: "savings",
      balance: formatCurrency(Number(savings.latestAccountBalance)),
      displayName: "Savings",
    },
  ];

  useEffect(() => {
    const amountToTransfer =
      Number(transferAmount) * (1 - Number(transferFeePercentage) / 100);
    setFinalTransferAmount(formatCurrency(amountToTransfer));
  }, [transferAmount, transferFeePercentage]);

  // Function to handle the user's inputs of the transfer details
  function handleTransferDetails(e) {
    const { name, value } = e.target;
    if (name === "originAccount" && value !== "") {
      const selectedAccount = accountBalances.find((e) => e.account === value);
      const { account, balance, displayName } = selectedAccount;
      setSelectedOriginAccount({ account, balance, displayName });
    } else if (name === "originAccount" && value === "") {
      setSelectedOriginAccount({
        account: null,
        balance: null,
        displayName: null,
      });
    }
    setTransferDetails((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle the submission of the fund transfer
  async function handleFundTransferSubmission(e) {
    e.preventDefault();
    try {
      const response = await transferFunds(transferDetails);
      const {
        storedFundTransferReferenceId: refNo,
        storedFundTransferAmount: amount,
        storedFundTransferTimestamp: timestamp,
      } = response;
      navigate(
        `/transfer/success?refNo=${refNo}&amount=${amount}&timestamp=${timestamp}`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="relative h-dvh flex flex-col gap-12 px-8 py-10">
        <h1 className="text-center text-3xl font-bold w-full">
          Transfer Funds
        </h1>
        <form
          className="w-full flex-1 flex flex-col justify-between"
          onSubmit={handleFundTransferSubmission}
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="origin-account">
              From:
            </label>
            <select
              className="cursor-pointer border-gray-600 bg-gray-100 border-2 p-2 font-medium rounded-lg"
              id="origin-account"
              name="originAccount"
              onChange={handleTransferDetails}
              required
            >
              <option value="">--Select an origin account--</option>
              {accountBalances.map((e) => {
                return (
                  <option key={e.account} value={e.account}>
                    {e.displayName}
                  </option>
                );
              })}
            </select>
            <p className="text-sm font-medium">
              Available balance:{" "}
              {selectedOriginAccount.balance
                ? selectedOriginAccount.balance
                : "TBD"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="destination-account">
              To:
            </label>
            <select
              className="cursor-pointer border-gray-600 bg-gray-100 border-2 p-2 font-medium rounded-lg"
              id="destination-account"
              name="destinationAccount"
              onChange={handleTransferDetails}
              required
            >
              <option value="">--Select a destination account--</option>
              {accountBalances
                .filter((e) => e.account !== selectedOriginAccount.account)
                .map((e) => {
                  return (
                    <option key={e.account} value={e.account}>
                      {e.displayName}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="amount">
              Amount To Transfer (₱):
            </label>
            <input
              className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
              id="amount"
              min={1}
              name="transferAmount"
              placeholder="Amount must be at least ₱1.00"
              onBlur={() => setAmountInputType("text")}
              onFocus={() => setAmountInputType("number")}
              onChange={handleTransferDetails}
              value={
                amountInputType === "number"
                  ? transferAmount
                  : formatCurrency(transferAmount)
              }
              type={amountInputType}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="transfer-fee">
              Transfer Fee Percentage (0% - 2%):
            </label>
            <input
              className="cursor-text rounded-lg
            border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium"
              id="transfer-fee"
              min={0}
              max={2}
              name="transferFeePercentage"
              placeholder="Value must be equal or greater than 0"
              type="number"
              value={transferFeePercentage}
              onChange={handleTransferDetails}
              required
            />
          </div>
          <h2 className="font-semibold">
            Amount To Be Transferred:{" "}
            <span className={`font-bold text-[#2830c9]`}>
              {finalTransferAmount}
            </span>
          </h2>
          <button
            className="w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={
              !originAccount ||
              !destinationAccount ||
              !transferAmount ||
              !(
                transferFeePercentage >= 0 &&
                transferFeePercentage <= 100 &&
                transferFeePercentage !== ""
              )
            }
            type="submit"
          >
            Confirm
          </button>
        </form>
      </main>
      <BackButton endpoint={"/"} />
    </>
  );
}
