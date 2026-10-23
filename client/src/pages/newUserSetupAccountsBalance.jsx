import BackButton from "../components/backButton.jsx";
import { useAccountsChoiceStore } from "../stores/accountsChoiceStore.js";

export default function NewUserSetupAccountsBalance() {
  const selectedAccounts = useAccountsChoiceStore(
    (state) => state.selectedAccounts,
  );
  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-12 p-8">
        <header>
          <h1 className="text-2xl font-medium">
            Enter your balance for the following account(s)
          </h1>
        </header>
        <main>
          <ol>
            {selectedAccounts.map((account, index) => {
              return <li key={index}>{account}</li>;
            })}
          </ol>
        </main>
      </div>
      <BackButton
        endpoint={"/new-user/accounts"}
        page={"newUserSetupBalance"}
      />
    </>
  );
}
