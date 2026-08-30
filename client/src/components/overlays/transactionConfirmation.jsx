export default function TransactionConfirmation(props) {
  const {
    handleTransactionConfirmation,
    transactionType,
    formatAmount,
    accountName,
    capitalizeFirstLetter,
    account,
    category,
    description,
    handleDisplayTransactionConfirmation,
  } = props;

  return (
    <div className="z-10 fixed flex flex-col items-center justify-center h-dvh bg-black/70 p-8 inset-0">
      <form
        className="z-20 w-full flex flex-col items-center justify-start bg-white p-4 gap-2 border-4 border-[#2830c9] rounded-2xl"
        onSubmit={handleTransactionConfirmation}
      >
        <h1 className="text-center text-xl font-bold">
          You are about to {transactionType === "debit" ? "spend" : "save"}{" "}
          {formatAmount}
        </h1>
        <h2 className="w-full text-left">
          <span className="font-semibold">Account Name:</span> {accountName}
        </h2>
        <h2 className="w-full text-left">
          <span className="font-semibold">Account:</span>{" "}
          {capitalizeFirstLetter(account)}
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
          Please review the transaction details. This action can't be undone.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            className="bg-neutral-300 text-gray-700 text-base font-medium px-3 py-2 rounded-lg"
            onClick={handleDisplayTransactionConfirmation}
            type="button"
          >
            Close
          </button>
          <button
            className="bg-[#2830c9] text-white text-base font-medium px-3 py-2 rounded-lg"
            type="submit"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
