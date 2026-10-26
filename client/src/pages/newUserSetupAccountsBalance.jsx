import { useAccountsChoiceStore } from "../stores/accountsChoiceStore.js";
import BackButton from "../components/backButton.jsx";

export default function NewUserSetupAccountsBalance() {
  const selectedAccounts = useAccountsChoiceStore(
    (state) => state.selectedAccounts,
  );

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-12 p-8">
        <header className="w-full text-center md:w-1/2 lg:w-1/4">
          <h1 className="text-2xl font-medium">
            Enter your balance for the following account(s):
          </h1>
        </header>
        <main className="w-full flex flex-col gap-12 md:w-1/2 lg:w-1/4">
          <form className="flex flex-col items-center gap-4" autoComplete="off">
            {selectedAccounts.map((account) => {
              const { name, label } = account;
              return (
                <div key={name} className="w-full flex flex-col gap-2">
                  <label className="font-medium text-lg" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type="number"
                    className="border border-gray-500 bg-gray-100 font-medium rounded-lg p-2"
                    placeholder="Amount must be greater than ₱0.00"
                  />
                </div>
              );
            })}
          </form>
          <button
            type="button"
            className={`w-full mt-2 transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium md:text-lg`}
            onClick={() => {
              console.log("I got clicked");
            }}
          >
            Continue
          </button>
        </main>
      </div>
      <BackButton
        endpoint={"/new-user/accounts"}
        page={"newUserSetupBalance"}
      />
    </>
  );
}
