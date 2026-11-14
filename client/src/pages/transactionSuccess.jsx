import { Link } from "react-router";
import { useSuccessfulTransactionStore } from "../stores/successfulTransactionStore.js";
import { formatTimestamp } from "../utils/formatters.js";
import { formatCurrency } from "../utils/formatters.js";

export default function TransactionSuccess() {
  const successfulTransactionDetails = useSuccessfulTransactionStore(
    (state) => state.successfulTransactionDetails,
  );
  const { referenceNumber, transactionAmount, timestamp } =
    successfulTransactionDetails;
  const formattedTransactionAmount = formatCurrency(Number(transactionAmount));
  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <div className="flex flex-col items-center justify-around min-h-dvh inset-0 p-8 md:p-16 ">
      <h1 className="text-3xl font-bold text-[#2830c9] md:text-4xl lg:text-5xl">
        Transaction Success!
      </h1>
      <div className="w-full flex flex-col items-start justify-between border-4 border-t-8 border-[#2830c9] rounded-2xl gap-8 p-4 md:w-3/4 lg:w-1/2">
        <h2 className="self-center text-2xl font-bold md:text-3xl lg:text-4xl">
          Transaction Receipt
        </h2>
        <h3 className="text-xl md:text-2xl lg:text-3xl">
          <span className="font-bold">Amount: </span>
          {formattedTransactionAmount}
        </h3>
        <div className="w-full text-xs flex justify-between md:text-base lg:text-lg">
          <h4>
            <span className="font-bold">Ref No:</span> {referenceNumber}
          </h4>
          <h4>{formattedTimestamp}</h4>
        </div>
      </div>
      <Link
        to="/"
        className="transition-all duration-75 active:scale-95 cursor-pointer w-full hover:bg-[#2228A8] bg-[#2830c9] py-2 rounded-full text-center text-lg text-white font-bold md:w-3/4 md:text-xl md:py-3 lg:w-1/2"
        onClick={() => {
          sessionStorage.clear();
        }}
      >
        Back To Home
      </Link>
    </div>
  );
}
