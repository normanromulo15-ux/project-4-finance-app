import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatters.js";
import { transferFunds } from "../services/app.js";
import BackButton from "../components/backButton.jsx";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function FundTransfer() {
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
    displayBalance: null,
    displayName: null,
    numericBalance: 0,
  });
  const { numericBalance: originAccountBalance } = selectedOriginAccount;
  const [finalTransferAmount, setFinalTransferAmount] = useState(null);
  const [amountExceedBalance, setAmountExceedBalance] = useState(false);
  const { cash, eWallet, savings } = useLoaderData();
  const navigate = useNavigate();
  const accountBalances = [
    {
      account: "cash",
      displayBalance: formatCurrency(Number(cash.latestAccountBalance)),
      displayName: "Cash",
      numericBalance: Number(cash.latestAccountBalance),
    },
    {
      account: "eWallet",
      displayBalance: formatCurrency(Number(eWallet.latestAccountBalance)),
      displayName: "E-Wallet",
      numericBalance: Number(eWallet.latestAccountBalance),
    },
    {
      account: "savings",
      displayBalance: formatCurrency(Number(savings.latestAccountBalance)),
      displayName: "Savings",
      numericBalance: Number(savings.latestAccountBalance),
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
    if (name === "originAccount" && value) {
      const selectedAccount = accountBalances.find((e) => e.account === value);
      const { account, displayBalance, displayName, numericBalance } =
        selectedAccount;
      setSelectedOriginAccount({
        account,
        displayBalance,
        displayName,
        numericBalance,
      });
    } else if (name === "originAccount" && !value) {
      setSelectedOriginAccount({
        account: null,
        displayBalance: null,
        displayName: null,
        numericBalance: null,
      });
    } else if (name === "transferAmount") {
      setAmountExceedBalance(value > originAccountBalance);
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
      <main className="relative min-h-dvh flex flex-col gap-12 p-8 pt-14 md:px-25 md:pt-28 lg:justify-center lg:items-center lg:py-12 lg:gap-6">
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
              From: {!originAccount && <span className="text-red-500">*</span>}
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
              {!destinationAccount && <span className="text-red-500">*</span>}
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
            <label className="font-semibold md:text-lg" htmlFor="amount">
              Amount To Transfer (₱):{" "}
              {!transferAmount && <span className="text-red-500">*</span>}
            </label>
            <div
              className={`relative disabled:cursor-not-allowed disabled:text-gray-400 disabled:placeholder:text-gray-400
                cursor-text rounded-lg
                border-2 font-medium  ${amountExceedBalance ? "border-red-500 bg-red-100 text-red-500" : "border-gray-600 bg-gray-100"}`}
            >
              <input
                className="placeholder:text-sm p-2 w-full rounded-lg md:placeholder:text-base"
                id="amount"
                min={1}
                name="transferAmount"
                placeholder="Amount must be greater than ₱0.00"
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
              {amountExceedBalance && (
                <>
                  <p className="absolute font-medium text-sm text-red-500">
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
                <span className="text-red-500">*</span>
              )}
            </label>
            <fieldset
              className="disabled:cursor-not-allowed disabled:text-gray-400 disabled:placeholder:text-gray-400 border-gray-600 bg-gray-100 flex justify-evenly border-2 p-2 font-medium rounded-lg"
              id="transfer-fee"
              name="transferFeePercentage"
              onChange={handleTransferDetails}
              required={true}
              disabled={
                !originAccount ||
                !destinationAccount ||
                !transferAmount ||
                Number(transferAmount) <= 0 ||
                amountExceedBalance
              }
            >
              {[0, 1, 2].map((percentage) => (
                <div key={percentage} className="flex gap-1 items-center">
                  <input
                    type="radio"
                    className="cursor-pointer"
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
              className={`font-bold ${amountExceedBalance && "text-red-500"}`}
            >
              {finalTransferAmount}
            </span>
          </p>
          <button
            className="transition-all duration-200 cursor-pointer active:scale-95 hover:bg-[#2228A8] w-full mt-auto bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl disabled:bg-gray-300 disabled:cursor-not-allowed lg:mt-0"
            disabled={
              !originAccount ||
              !destinationAccount ||
              !transferAmount ||
              transferFeePercentage === ""
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
