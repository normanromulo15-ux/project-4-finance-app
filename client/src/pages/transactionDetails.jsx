import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useTransactionDetailsStore } from "../stores/transactionDetailsStore.js";
import { useSuccessfulTransactionStore } from "../stores/successfulTransactionStore.js";
import { addTransaction } from "../services/app.js";
import { getCurrentBalance } from "../services/app.js";
import { capitalizeFirstLetter } from "../utils/formatters.js";
import { formatCurrency } from "../utils/formatters.js";
import { transactionCategories } from "../utils/constants.js";
import TransactionCategoriesDropdown from "../components/transactionCategoriesDropdown.jsx";
import BackButton from "../components/backButton.jsx";
import TransactionConfirmation from "../components/overlays/transactionConfirmation.jsx";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function TransactionDetails() {
  const theme = localStorage.getItem("theme") ?? "light";
  const navigate = useNavigate();
  const transactionDetails = useTransactionDetailsStore(
    (state) => state.transactionDetails,
  );
  const setTransactionDetails = useTransactionDetailsStore(
    (state) => state.setTransactionDetails,
  );
  const setSuccessfulTransactionDetails = useSuccessfulTransactionStore(
    (state) => state.setSuccessfulTransactionDetails,
  );
  const {
    account,
    amount,
    category,
    description,
    type: transactionType,
  } = transactionDetails;
  const [amountInputType, setAmountInputType] = useState("text");
  const [formattedTransactionAmount, setFormattedTransactionAmount] =
    useState("");
  const [showTransactionConfirmation, setShowTransactionConfirmation] =
    useState(false);
  const [isAmountExceedBalance, setIsAmountExceedBalance] = useState(false);
  const [accountAvailableBalance, setAccountAvailableBalance] = useState(null);
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);
  const { userFullName } = useLoaderData();
  const { firstName, lastName } = userFullName;
  const accountName = `${firstName} ${lastName}`;
  const isDescriptionRequired =
    (transactionType === "debit" &&
      (!amount || !category || !description.trim())) ||
    (transactionType === "credit" && (!amount || !description.trim()));
  const isReviewTransactionButtonDisabled =
    isAmountExceedBalance ||
    Number(amount) < 0.1 ||
    !amount.trim() ||
    (!transactionCategories.includes(category) &&
      transactionType === "debit") ||
    !description.trim();

  useEffect(() => {
    const accountBalance = async () => {
      const { latestAccountBalance } = await getCurrentBalance(account);
      setAccountAvailableBalance(latestAccountBalance);
    };
    accountBalance();
  }, []);

  useEffect(() => {
    setFormattedTransactionAmount(formatCurrency(Number(amount)));
  }, [showTransactionConfirmation, amount]);

  // Function to handle user's transaction details input
  function handleTransactionDetailsInput(e) {
    const { name, value } = e.target;
    setTransactionDetails(name, value);
    if (name === "amount" && transactionType === "debit") {
      setIsAmountExceedBalance(value > accountAvailableBalance);
    }
    switch (name) {
      case "amount":
        sessionStorage.setItem("inputAmount", value);
        break;
      case "category":
        sessionStorage.setItem("inputCategory", value);
        break;
      case "description":
        sessionStorage.setItem("inputDescription", value);
        break;
    }
  }

  // Function to handle the display of transaction confirmation
  function handleDisplayTransactionConfirmation() {
    console.log(transactionDetails);
    setShowTransactionConfirmation((prev) => !prev);
  }

  // Function to handle the transaction submission
  async function handleTransactionSubmission(e) {
    try {
      e.preventDefault();
      setIsDisableSubmit(true);
      const response = await addTransaction(transactionDetails);
      const {
        storedTransactionAmount: transactionAmount,
        transactionReferenceId: referenceNumber,
        transactionTimestamp: timestamp,
      } = response;
      const successfulTransactionDetails = {
        transactionAmount,
        referenceNumber,
        timestamp,
      };
      setSuccessfulTransactionDetails(successfulTransactionDetails);
      navigate("/transaction/success");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <main
        className={`min-h-dvh flex flex-col justify-center items-center px-8 pb-8 pt-40 gap-8 md:px-25 md:pt-60 md:pb-16 md:gap-16 lg:py-12 ${theme === "dark" && "bg-gray-950 text-white"}`}
      >
        <h1 className="text-3xl font-bold md:text-4xl">Transaction Details</h1>
        <form
          autoComplete="off"
          className="w-full flex flex-col gap-6 md:gap-8 lg:w-1/4"
        >
          <div className="relative flex flex-col gap-1">
            <label className="font-semibold md:text-lg" htmlFor="amount">
              Enter an amount (₱):{" "}
              {!amount && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"}`}
                >
                  *
                </span>
              )}
            </label>
            <div
              className={`relative cursor-text rounded-lg 
                border font-medium ${isAmountExceedBalance ? (theme === "dark" ? "border-red-400 bg-red-200 text-red-600" : "border-red-500 bg-red-100 text-red-500") : theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-500 bg-gray-100"}`}
            >
              <input
                className="w-full rounded-lg p-2 placeholder:text-sm md:placeholder:text-base"
                id="amount"
                name="amount"
                onBlur={() => setAmountInputType("text")}
                onFocus={() => setAmountInputType("number")}
                onChange={handleTransactionDetailsInput}
                placeholder="Amount must be at least ₱0.10"
                required={true}
                type={amountInputType}
                value={
                  amountInputType === "number" ? amount : formatCurrency(amount)
                }
                autoFocus={Boolean(!amount)}
              />
              {isAmountExceedBalance && (
                <div className="absolute right-1 top-1.5">
                  <WarningAmberIcon sx={{ color: "red", scale: 0.8 }} />
                </div>
              )}
            </div>
            <p
              className={`font-medium text-sm ${isAmountExceedBalance && (theme === "dark" ? "text-red-400" : "text-red-500")} md:text-base`}
            >
              {isAmountExceedBalance
                ? " Amount exceeded the account balance"
                : `Available balance: ${formatCurrency(accountAvailableBalance)}`}
            </p>
          </div>
          {transactionType === "debit" && (
            <TransactionCategoriesDropdown
              theme={theme}
              handleTransactionDetailsInput={handleTransactionDetailsInput}
              category={category}
              amount={amount}
              setTransactionDetails={setTransactionDetails}
              isAmountExceedBalance={isAmountExceedBalance}
            />
          )}
          <div className="flex flex-col gap-1">
            <label className="font-semibold md:text-lg" htmlFor="description">
              Description:{" "}
              {isDescriptionRequired && (
                <span
                  className={`${theme === "dark" ? "text-red-400" : "text-red-500"} `}
                >
                  *
                </span>
              )}
            </label>
            <input
              type="text"
              className={`cursor-text disabled:cursor-not-allowed disabled:text-gray-500/95 disabled:placeholder:text-gray-400 rounded-lg
              border p-2 placeholder:text-sm font-medium md:placeholder:text-base ${theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-500 bg-gray-100"}`}
              id="description"
              name="description"
              onChange={handleTransactionDetailsInput}
              placeholder="Write a transaction description..."
              required={true}
              value={description}
              disabled={
                (transactionType === "debit" &&
                  (!amount.trim() || !category.trim())) ||
                (transactionType === "credit" && !amount.trim())
              }
            />
          </div>
        </form>
        <button
          className={`transition-all duration-75 cursor-pointer w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:cursor-not-allowed md:text-xl md:py-3 lg:mt-0 lg:w-1/4 ${theme === "dark" ? "disabled:bg-gray-400 hover:bg-[#363ED6]" : "disabled:bg-gray-300 hover:bg-[#2228A8]"} ${!isReviewTransactionButtonDisabled && "active:scale-95"}`}
          disabled={isReviewTransactionButtonDisabled}
          onClick={handleDisplayTransactionConfirmation}
        >
          Review Your Transaction
        </button>
      </main>
      {showTransactionConfirmation && (
        <TransactionConfirmation
          theme={theme}
          isDisableSubmit={isDisableSubmit}
          handleTransactionSubmission={handleTransactionSubmission}
          transactionType={transactionType}
          formattedTransactionAmount={formattedTransactionAmount}
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
      <BackButton endpoint={"/transaction/account-options"} />
    </>
  );
}
