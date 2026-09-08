import FundTransfer from "./fundTransferButton.jsx";
import Transactions from "./transactionsButton.jsx";
import AccountMenu from "./profileMenu.jsx";

export default function Navigation() {
  return (
    <nav className="w-full flex items-center justify-center gap-8">
      <FundTransfer />
      <Transactions />
      <AccountMenu />
    </nav>
  );
}
