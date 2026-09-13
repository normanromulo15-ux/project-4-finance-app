import FundTransfer from "../components/fundTransferButton.jsx";
import Transactions from "../components/transactionsButton.jsx";
import AccountMenu from "../components/profileMenu.jsx";

export default function Navigation() {
  return (
    <nav className="w-full flex items-center justify-center gap-8">
      <FundTransfer />
      <Transactions />
      <AccountMenu />
    </nav>
  );
}
