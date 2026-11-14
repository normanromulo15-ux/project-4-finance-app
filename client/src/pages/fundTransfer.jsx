import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useSuccessfulTransactionStore } from "../stores/successfulTransactionStore.js";
import { formatCurrency } from "../utils/formatters.js";
import { transferFunds } from "../services/app.js";
import BackButton from "../components/backButton.jsx";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function FundTransfer() {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const setSuccessfulTransactionDetails = useSuccessfulTransactionStore(
    (state) => state.useSuccessfulTransactionStore,
  );
  const [amountInputType, setAmountInputType] = useState("number");
  const [transferDetails, setTransferDetails] = useState({
    originAccount: "",
    destinationAccount: "",
    transferAmount: "",
    transferFeePercentage: "",
  });
  const {
    originAccount,
    destinationAccount,
    transferAmount,
    transferFeePercentage,
  } = transferDetails;
  const [selectedOriginAccount, setSelectedOriginAccount] = useState({
    account: null,
    balance: 0,
    displayBalance: null,
    label: null,
  });
  const { balance: originAccountBalance } = selectedOriginAccount;
  const [finalTransferAmount, setFinalTransferAmount] = useState(null);
  const [isAmountExceedBalance, setIsAmountExceedBalance] = useState(false);
  const { userAccountsData } = useLoaderData();
  const accountsData = userAccountsData.map((account) => {
    const { accountType, latestAccountBalance } = account;
    let label;
    switch (accountType) {
      case "cash":
        label = "Cash";
        break;
      case "eWallet":
        label = "E-Wallet";
        break;
      case "savings":
        label = "Savings";
    }
    return {
      account: accountType,
      balance: latestAccountBalance,
      displayBalance: formatCurrency(latestAccountBalance),
      label,
    };
  });
  const isDisableConfirmButton =
    !originAccount ||
    !destinationAccount ||
    !transferAmount ||
    transferFeePercentage === "";

  useEffect(() => {
    const amountToTransfer =
      Number(transferAmount) * (1 - Number(transferFeePercentage) / 100);
    setFinalTransferAmount(formatCurrency(amountToTransfer));
  }, [transferAmount, transferFeePercentage]);

  // Function to handle the user's inputs of the transfer details
  function handleTransferDetails(e) {
    const { name, value } = e.target;
    if (name === "originAccount" && value) {
      const selectedAccount = accountsData.find(
        (item) => item.account === value,
      );
      const { account, displayBalance, label, balance } = selectedAccount;
      setSelectedOriginAccount({
        account,
        displayBalance,
        label,
        balance,
      });
    } else if (name === "originAccount" && !value) {
      setSelectedOriginAccount({
        account: null,
        balance: 0,
        displayBalance: null,
        label: null,
      });
    } else if (name === "transferAmount") {
      setIsAmountExceedBalance(value > originAccountBalance);
    }
    setTransferDetails((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle the submission of the fund transfer
  async function handleFundTransferSubmission(e) {
    e.preventDefault();
    try {
      const response = await transferFunds(transferDetails);
      const {
        storedFundTransferReferenceId: referenceNumber,
        storedFundTransferAmount: transactionAmount,
        storedFundTransferTimestamp: timestamp,
      } = response;
      const transactionDetails = {
        referenceNumber,
        transactionAmount,
        timestamp,
      };
      setSuccessfulTransactionDetails(transactionDetails);
      navigate("/transfer/success");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main
        className={`relative min-h-dvh flex flex-col gap-12 p-8 pt-18 md:px-25 md:pt-28 lg:justify-center lg:items-center lg:py-12 lg:gap-6 ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-black"}`}
      >
        <h1 className="text-center text-3xl font-bold w-full lg:text-4xl">
          Transfer Funds
        </h1>
        <form
          autoComplete="off"
          className="w-full flex-1 flex flex-col gap-6 lg:flex-0 lg:w-1/4"
          onSubmit={handleFundTransferSubmission}
        >
          <div className="flex flex-col gap-2">
            <label
              className="font-semibold md:text-lg"
              htmlFor="origin-account"
            >
              From:{" "}
              {!originAccount && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`}
                >
                  *
                </span>
              )}
            </label>
            <select
              className={`cursor-pointer border-2 p-2 font-medium rounded-lg ${theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-500 bg-gray-100"}`}
              id="origin-account"
              name="originAccount"
              onChange={handleTransferDetails}
              required
            >
              <option value="">--Select an origin account--</option>
              {accountsData.map((item) => {
                return (
                  <option key={item.account} value={item.account}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <p className="text-sm font-medium">
              Available balance:{" "}
              {selectedOriginAccount.displayBalance
                ? selectedOriginAccount.displayBalance
                : "TBD"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-semibold md:text-lg"
              htmlFor="destination-account"
            >
              To:{" "}
              {!destinationAccount && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`}
                >
                  *
                </span>
              )}
            </label>
            <select
              className={`cursor-pointer border-2 p-2 font-medium rounded-lg ${theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-500 bg-gray-100"}`}
              id="destination-account"
              name="destinationAccount"
              onChange={handleTransferDetails}
              required
            >
              <option value="">--Select a destination account--</option>
              {accountsData
                .filter(
                  (item) => item.account !== selectedOriginAccount.account,
                )
                .map((item) => {
                  return (
                    <option key={item.account} value={item.account}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold md:text-lg" htmlFor="amount">
              Amount To Transfer (₱):{" "}
              {!transferAmount && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`}
                >
                  *
                </span>
              )}
            </label>
            <div
              className={`relative 
                cursor-text rounded-lg
                border-2 font-medium ${isAmountExceedBalance ? (theme === "dark" ? "border-red-400 bg-red-200 text-red-600" : "border-red-500 bg-red-100 text-red-500") : theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-500 bg-gray-100"}`}
            >
              <input
                className="placeholder:text-sm disabled:cursor-not-allowed disabled:text-gray-500/95 disabled:placeholder:text-gray-400 p-2 w-full rounded-lg md:placeholder:text-base"
                id="amount"
                name="transferAmount"
                placeholder="Amount must be at least ₱0.10"
                onBlur={() => setAmountInputType("text")}
                onFocus={() => setAmountInputType("number")}
                onChange={handleTransferDetails}
                value={
                  amountInputType === "number"
                    ? transferAmount
                    : formatCurrency(transferAmount)
                }
                type={amountInputType}
                required={true}
                disabled={!originAccount || !destinationAccount}
              />
              {isAmountExceedBalance && (
                <>
                  <p className="absolute -bottom-6 font-medium text-sm text-red-500">
                    Amount exceeded the account balance
                  </p>
                  <div className="absolute right-1 top-1.5">
                    <WarningAmberIcon sx={{ color: "red", scale: 0.8 }} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="transfer-fee">
              Transfer Fee Percentage:{" "}
              {transferFeePercentage === "" && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`}
                >
                  *
                </span>
              )}
            </label>
            <fieldset
              className={`disabled:cursor-not-allowed flex justify-evenly border-2 p-2 font-medium rounded-lg ${theme === "dark" ? "border-gray-600 bg-gray-800 disabled:text-gray-500/95" : "border-gray-500 bg-gray-100 disabled:text-gray-400 disabled:placeholder:text-gray-400"}`}
              id="transfer-fee"
              name="transferFeePercentage"
              onChange={handleTransferDetails}
              required={true}
              disabled={
                !originAccount ||
                !destinationAccount ||
                !transferAmount ||
                Number(transferAmount) <= 0 ||
                isAmountExceedBalance
              }
            >
              {[0, 1, 2].map((percentage) => (
                <div key={percentage} className="flex gap-1 items-center">
                  <input
                    type="radio"
                    className="disabled:cursor-not-allowed cursor-pointer"
                    id={String(percentage)}
                    name="transferFeePercentage"
                    value={String(percentage)}
                  />
                  <label className="font-medium" htmlFor={String(percentage)}>
                    {String(percentage)}%
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
          <p className="font-semibold">
            Amount To Be Transferred:{" "}
            <span
              className={`font-bold ${isAmountExceedBalance && "text-red-500"}`}
            >
              {finalTransferAmount}
            </span>
          </p>
          <button
            className={`transition-all duration-200 cursor-pointer w-full mt-auto bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl disabled:bg-gray-300 disabled:cursor-not-allowed lg:mt-0 ${!isDisableConfirmButton && "active:scale-95"} ${theme === "dark" ? "hover:bg-[#363ED6] disabled:bg-gray-400" : "hover:bg-[#2228A8] disabled:bg-gray-300"}`}
            disabled={isDisableConfirmButton}
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
