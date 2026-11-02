import { useState } from "react";
import { useNewUserAccountsChoiceStore } from "../stores/newUserAccountsChoiceStore.js";
import { formatCurrency } from "../utils/formatters.js";
import InitialTopUpConfirmation from "../components/overlays/initialTopUpConfirmation.jsx";
import BackButton from "../components/backButton.jsx";

export default function NewUserSetupAccountsBalance() {
  const selectedAccounts = useNewUserAccountsChoiceStore(
    (state) => state.selectedAccounts,
  );
  const [initialTopUpDetails, setInitialTopUpDetails] = useState({
    accounts: selectedAccounts.map((account) => ({
      ...account,
      amount: sessionStorage.getItem(`${account.name}Balance`) ?? "",
      amountDataType: "text",
    })),
    category: "Financial",
    description: "Initial top up",
    type: "credit",
  });
  const { accounts: chosenAccounts } = initialTopUpDetails;
  const isEnableReview = chosenAccounts
    .map((account) => Number(account.amount) >= 0.1)
    .every((element) => element === true);
  const [isShowConfirmationOverlay, setIsShowConfirmationOverlay] =
    useState(false);

  // Function to handle the initial balance(s) input
  function handleInitialBalanceInput(e) {
    const { name, value } = e.target;
    setInitialTopUpDetails((prev) => ({
      ...prev,
      accounts: prev.accounts.map((account) =>
        account.name === name ? { ...account, amount: value } : account,
      ),
    }));
    sessionStorage.setItem(`${name}Balance`, String(value));
  }

  // Function to handle input focus
  function handleInputFocus(e) {
    const { name } = e.target;
    setInitialTopUpDetails((prev) => ({
      ...prev,
      accounts: prev.accounts.map((account) => {
        return account.name === name
          ? { ...account, amountDataType: "number" }
          : account;
      }),
    }));
  }

  // Function to handle input blur
  function handleInputBlur(e) {
    const { name } = e.target;
    setInitialTopUpDetails((prev) => ({
      ...prev,
      accounts: prev.accounts.map((account) => {
        return account.name === name
          ? { ...account, amountDataType: "text" }
          : account;
      }),
    }));
  }

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-12 p-8">
        <header className="w-full text-center md:w-1/2 lg:w-1/4">
          <h1 className="text-2xl font-medium">
            Enter your initial balance for the following account(s):
          </h1>
        </header>
        <main className="w-full flex flex-col gap-12 md:w-1/2 lg:w-1/4">
          <form className="flex flex-col items-center gap-4" autoComplete="off">
            {chosenAccounts.map((account, index) => {
              const { name, label, amount, amountDataType } = account;
              return (
                <div key={name} className="w-full flex flex-col gap-2">
                  <label className="font-medium text-lg" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    type={amountDataType}
                    autoFocus={index === 0}
                    id={name}
                    name={name}
                    value={
                      amountDataType === "number"
                        ? amount
                        : formatCurrency(Number(amount))
                    }
                    onChange={handleInitialBalanceInput}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="border border-gray-500 bg-gray-100 font-medium rounded-lg p-2"
                    placeholder="Amount must be at least ₱0.10"
                    required={true}
                  />
                </div>
              );
            })}
          </form>
          <button
            type="button"
            className={`w-full mt-2 transition-all duration-200 cursor-pointer hover:bg-[#2228A8] disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center bg-[#2830c9] rounded-full px-4 py-2 text-white font-medium md:text-lg ${isEnableReview && "active:scale-95"}`}
            onClick={() => {
              setIsShowConfirmationOverlay(true);
            }}
            disabled={!isEnableReview}
          >
            Review Top Up
          </button>
        </main>
      </div>
      {isShowConfirmationOverlay && (
        <InitialTopUpConfirmation
          initialTopUpDetails={initialTopUpDetails}
          setIsShowConfirmationOverlay={setIsShowConfirmationOverlay}
        />
      )}
      <BackButton
        endpoint={"/new-user/accounts-choice"}
        page={"newUserSetupBalance"}
      />
    </>
  );
}
