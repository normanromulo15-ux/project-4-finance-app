import FundTransfer from "../components/fundTransferButton.jsx";
import Transactions from "../components/transactionsButton.jsx";
import ProfileMenu from "../components/profileMenuButton.jsx";

export default function Navigation() {
  return (
    <nav className="w-full flex items-center justify-center gap-8 md:justify-around">
      <FundTransfer />
      <Transactions />
      <ProfileMenu />
    </nav>
  );
}
