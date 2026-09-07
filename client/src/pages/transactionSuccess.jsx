import { useNavigate, useSearchParams } from "react-router";
import { formatTimestamp } from "../utils/formatTimestamp.js";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function TransactionSuccess() {
  const [searchParams] = useSearchParams();
  const referenceNumber = searchParams.get("refNo") || "";
  const transactionAmount = formatCurrency(
    Number(searchParams.get("amount") || 0),
  );
  const timestamp = formatTimestamp(
    searchParams.get("timestamp") || new Date().toISOString(),
  );
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-around h-dvh inset-0 p-8">
      <h1 className="text-3xl font-bold text-[#2830c9]">
        Transaction Success!
      </h1>
      <div className="w-full flex flex-col items-start justify-between border-4 border-t-8 border-[#2830c9] rounded-2xl gap-8 p-4">
        <h2 className="self-center text-2xl font-bold">Transaction Receipt</h2>
        <h3 className="text-xl">
          <span className="font-bold">Amount: </span>
          {transactionAmount}
        </h3>
        <div className="w-full flex justify-between">
          <h4 className="text-xs">
            <span className="font-bold">Ref No:</span> {referenceNumber}
          </h4>
          <h4 className="text-xs">{timestamp}</h4>
        </div>
      </div>
      <button
        className="w-full bg-[#2830c9] p-2 rounded-full text-lg text-white font-bold"
        onClick={() => {
          navigate("/");
        }}
      >
        Back To Home
      </button>
    </div>
  );
}
