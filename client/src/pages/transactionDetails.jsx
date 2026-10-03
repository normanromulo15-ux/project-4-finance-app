import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { addTransaction } from "../services/app.js";
import { capitalizeFirstLetter } from "../utils/formatters.js";
import { formatCurrency } from "../utils/formatters.js";
import { transactionCategories } from "../utils/constants.js";
import TransactionCategoriesDropdown from "../components/transactionCategoriesDropdown.jsx";
import BackButton from "../components/backButton.jsx";
import TransactionConfirmation from "../components/overlays/transactionConfirmation.jsx";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function TransactionDetails() {
  const navigate = useNavigate();
  const [amountInputType, setAmountInputType] = useState("number");
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
  const [amountExceedBalance, setAmountExceedBalance] = useState(false);
  const [accountAvailableBalance, setAccountAvailableBalance] = useState(null);
  const { transactionType, accountType } = useParams();
  const { firstName, lastName } = useLoaderData().fullName;
  const { cash, eWallet } = useLoaderData();
  const transactionAccounts = [
    { name: "cash", value: cash },
    { name: "eWallet", value: eWallet },
  ];
  const isDescriptionRequired =
    (transactionType === "debit" &&
      (!amount || !category || !description.trim())) ||
    (transactionType === "credit" && (!amount || !description.trim()));

  useEffect(() => {
    setAccountAvailableBalance(
      transactionAccounts.find((e) => e.name === accountType).value
        .latestAccountBalance,
    );
  }, []);

  useEffect(() => {
    setAccountName(`${firstName} ${lastName}`);
    setFormatAmount(formatCurrency(Number(amount)));
  }, [showTransactionConfirmation, amount]);

  // Function to handle user's transaction details input
  function handleTransactionDetailsInput(e) {
    const { name, value } = e.target;
    setTransactionDetails((prev) => ({ ...prev, [name]: value }));
    if (name === "amount" && transactionType === "debit") {
      setAmountExceedBalance(value > accountAvailableBalance);
    }
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
        `/transaction/${transactionType}/${accountType}/success?amount=${transactionAmount}&refNo=${refNo}&timestamp=${timestamp}`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="min-h-dvh flex flex-col justify-center items-center px-8 pb-8 pt-40 gap-8 md:px-25 md:pt-60 md:pb-16 md:gap-16">
        <h1 className="text-3xl font-bold md:text-4xl">Transaction Details</h1>
        <form
          autoComplete="off"
          className="w-full flex flex-col gap-6 md:gap-8"
        >
          <div className="relative flex flex-col gap-1">
            <label className="font-semibold md:text-lg" htmlFor="amount">
              Enter an amount (₱):{" "}
              {!amount && <span className="text-red-500 ">*</span>}
            </label>
            <div
              className={`w-full relative items-center cursor-text rounded-lg
                border font-medium ${amountExceedBalance ? "border-red-500 bg-red-100 text-red-500" : "border-gray-600 bg-gray-100"}`}
            >
              <input
                className="w-full rounded-lg p-2 placeholder:text-sm md:placeholder:text-base"
                id="amount"
                name="amount"
                onBlur={() => setAmountInputType("text")}
                onFocus={() => setAmountInputType("number")}
                onChange={handleTransactionDetailsInput}
                placeholder="Amount must be greater than ₱0.00"
                required={true}
                type={amountInputType}
                value={
                  amountInputType === "number" ? amount : formatCurrency(amount)
                }
              />
              {amountExceedBalance && (
                <div className="absolute right-1 top-1.5">
                  <WarningAmberIcon sx={{ color: "red", scale: 0.8 }} />
                </div>
              )}
            </div>
            <p
              className={`font-medium text-sm ${amountExceedBalance && "text-red-500"} md:text-base`}
            >
              {amountExceedBalance
                ? " Amount exceeded the account balance"
                : `Available balance: ${formatCurrency(accountAvailableBalance)}`}
            </p>
          </div>
          {transactionType === "debit" && (
            <TransactionCategoriesDropdown
              handleTransactionDetailsInput={handleTransactionDetailsInput}
              category={category}
              amount={amount}
              setTransactionDetails={setTransactionDetails}
              amountExceedBalance={amountExceedBalance}
            />
          )}
          <div className="flex flex-col gap-1">
            <label className="font-semibold md:text-lg" htmlFor="description">
              Description:{" "}
              {isDescriptionRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              className="cursor-text rounded-lg
              border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium md:placeholder:text-base"
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
          className="w-full bg-[#2830c9] text-white text-lg font-medium px-4 py-2 rounded-4xl mt-auto disabled:bg-gray-300 disabled:cursor-not-allowed md:text-xl md:py-3"
          disabled={
            amountExceedBalance ||
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
      <BackButton endpoint={`/transaction/${transactionType}`} />
    </>
  );
}
