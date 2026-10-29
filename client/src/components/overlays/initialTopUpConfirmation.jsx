import { useNavigate } from "react-router";
import { useUserFullNameStore } from "../../stores/userFullNameStore.js";
import { addTransaction } from "../../services/app.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function InitialTopUpConfirmation(props) {
  const navigate = useNavigate();
  const { topUpDetails, setIsShowConfirmationOverlay } = props;
  const {
    accounts: chosenAccounts,
    category,
    description,
    type,
  } = topUpDetails;
  const fullName = useUserFullNameStore((state) => state.fullName);
  const { firstName, lastName } = fullName;

  // Function to submit the inital user top up to the server and save it to the database
  async function handleSubmitInitialTopUp() {
    try {
      for (const account of chosenAccounts) {
        const requestBody = {
          account: account.name,
          amount: account.amount,
          category,
          description,
          type,
        };
        console.log(requestBody);
        // await addTransaction(requestBody);
      }
      console.log("Navigating to another page...");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="z-10 fixed flex flex-col items-center justify-center h-dvh p-8 inset-0 md:px-30 bg-black/70">
      <div className="z-20 w-full flex flex-col items-center justify-center p-4 gap-2 border-4 shadow-2xl border-[#2830c9] rounded-2xl  md:h-1/2 md:justify-evenly md:border-6 lg:h-4/5 lg:w-1/2 lg:px-8 bg-white">
        <h1 className="text-center text-xl font-bold md:text-2xl lg:text-3xl">
          Top Up Details
        </h1>
        <h2 className="w-full text-left md:text-lg lg:text-xl">
          <span className="font-semibold">Account Name:</span> {firstName}{" "}
          {lastName}
        </h2>
        <table className="w-full border border-black text-start md:text-lg lg:text-xl">
          <thead className="border-b border-black">
            <tr>
              <th scope="col" className="text-start pl-2 md:pl-4">
                Account Type
              </th>
              <th scope="col" className="text-start pl-2 md:pl-4">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {chosenAccounts.map((account) => {
              return (
                <tr key={account.name}>
                  <td className="pl-2 md:pl-4">{account.label}</td>
                  <td className="pl-2 md:pl-4">
                    {formatCurrency(Number(account.amount))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="w-full text-sm font-medium py-2 border-t-2 md:text-base lg:text-lg">
          Please review the top up details. This action can't be undone.
        </p>
        <div className="flex items-center justify-center gap-5">
          <button
            className="transition-all cursor-pointer active:scale-95 bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-full hover:bg-gray-400 hover:text-gray-800"
            onClick={() => setIsShowConfirmationOverlay(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="transition-all cursor-pointer active:scale-95 bg-[#2830c9] text-white font-medium px-4 py-2 rounded-full hover:bg-[#2228A8]"
            onClick={handleSubmitInitialTopUp}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
