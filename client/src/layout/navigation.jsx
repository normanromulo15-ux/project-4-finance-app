import FundTransfer from "../components/fundTransferButton.jsx";
import Transactions from "../components/transactionsButton.jsx";
import ProfileMenu from "../components/profileMenuButton.jsx";

export default function Navigation() {
  return (
    <nav className="order-1 w-full flex items-center justify-center gap-8 md:justify-around lg:order-0 lg:justify-center lg:gap-16">
      <FundTransfer />
      <Transactions />
      <ProfileMenu />
    </nav>
  );
}
