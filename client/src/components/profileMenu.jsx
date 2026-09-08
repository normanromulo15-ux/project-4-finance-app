import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function AccountMenu() {
  return (
    <button
      className="flex flex-col items-center justify-center"
      onClick={() => {
        console.log("Account menu option got clicked.");
      }}
    >
      <AccountCircleIcon />
      <p className="font-semibold border-b-2">Account</p>
    </button>
  );
}
