import BackButton from "../components/backButton.jsx";

export default function NewUserSetupAccountsBalance() {
  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-12 p-8">
        <header>
          <h1 className="text-2xl font-medium">
            Enter your balance for the following account(s)
          </h1>
        </header>
      </div>
      <BackButton endpoint={"/new-user/accounts"} />
    </>
  );
}
