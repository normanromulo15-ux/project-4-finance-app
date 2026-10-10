export default function TransactionConfirmation(props) {
  const {
    isDisableSubmit,
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
        className="z-20 w-full flex flex-col items-center justify-center bg-white p-4 gap-2 border-4 border-[#2830c9] rounded-2xl md:h-1/2 md:justify-evenly md:border-6 lg:h-4/5 lg:w-1/2 lg:px-8"
        onSubmit={handleTransactionSubmission}
      >
        <h1 className="text-center text-xl font-bold md:text-2xl lg:text-3xl">
          You are about to {transactionType === "debit" ? "spend" : "save"}{" "}
          {formatAmount}
        </h1>
        <h2 className="w-full text-left md:text-lg lg:text-xl">
          <span className="font-semibold">Account Name:</span> {accountName}
        </h2>
        <h2 className="w-full text-left md:text-lg lg:text-xl">
          <span className="font-semibold">Account:</span>{" "}
          {capitalizeFirstLetter(account)}
        </h2>
        <h2 className="w-full text-left md:text-lg lg:text-xl">
          <span className="font-semibold">Amount:</span> {formatAmount}
        </h2>
        {transactionType === "debit" && (
          <h2 className="w-full text-left md:text-lg lg:text-xl">
            <span className="font-semibold">Category:</span> {category}
          </h2>
        )}
        <h2 className="w-full text-left md:text-lg lg:text-xl">
          <span className="font-semibold">Description:</span> {description}
        </h2>
        <p className="w-full text-sm font-medium py-2 border-t-2 md:text-base lg:text-lg">
          Please review the transaction details. This action can't be undone.
        </p>
        <div className="flex items-center justify-center gap-5">
          <button
            className="transition-all cursor-pointer active:scale-95 hover:bg-neutral-400 hover:text-gray-800 disabled:bg-neutral-300/85 disabled:cursor-not-allowed bg-neutral-300 text-gray-700 font-medium px-3 py-2 rounded-lg"
            onClick={handleDisplayTransactionConfirmation}
            type="button"
            disabled={isDisableSubmit}
          >
            Close
          </button>
          <button
            className="transition-all cursor-pointer active:scale-95 hover:bg-[#2228A8] bg-[#2830c9] text-white font-medium px-3 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
            type="submit"
            disabled={isDisableSubmit}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
