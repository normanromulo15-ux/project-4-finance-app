export default function TransactionConfirmation(props) {
  const {
    handleTransactionSubmission,
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
    <div className="z-10 fixed flex flex-col items-center justify-center h-dvh bg-black/70 p-8 inset-0 md:px-30">
      <form
        className="z-20 w-full flex flex-col items-center justify-center bg-white p-4 gap-2 border-4 border-[#2830c9] rounded-2xl md:h-1/2 md:justify-evenly md:border-6"
        onSubmit={handleTransactionSubmission}
      >
        <h1 className="text-center text-xl font-bold md:text-2xl">
          You are about to {transactionType === "debit" ? "spend" : "save"}{" "}
          {formatAmount}
        </h1>
        <h2 className="w-full text-left md:text-lg">
          <span className="font-semibold">Account Name:</span> {accountName}
        </h2>
        <h2 className="w-full text-left md:text-lg">
          <span className="font-semibold">Account:</span>{" "}
          {capitalizeFirstLetter(account)}
        </h2>
        <h2 className="w-full text-left md:text-lg">
          <span className="font-semibold">Amount:</span> {formatAmount}
        </h2>
        {transactionType === "debit" && (
          <h2 className="w-full text-left md:text-lg">
            <span className="font-semibold">Category:</span> {category}
          </h2>
        )}
        <h2 className="w-full text-left md:text-lg">
          <span className="font-semibold">Description:</span> {description}
        </h2>
        <p className="w-full text-sm font-medium py-2 border-t-2 md:text-base">
          Please review the transaction details. This action can't be undone.
        </p>
        <div className="flex items-center justify-center gap-5">
          <button
            className="bg-neutral-300 text-gray-700 font-medium px-3 py-2 rounded-lg "
            onClick={handleDisplayTransactionConfirmation}
            type="button"
          >
            Close
          </button>
          <button
            className="bg-[#2830c9] text-white font-medium px-3 py-2 rounded-lg"
            type="submit"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
