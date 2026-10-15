import { useNavigate } from "react-router";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Navigation() {
  const theme = localStorage.getItem("theme");
  const navigate = useNavigate();
  const options = [
    {
      endpoint: "/transfer",
      label: "Transfer",
      icon: <CurrencyExchangeIcon />,
    },
    { endpoint: "/transactions", label: "Transactions", icon: <HistoryIcon /> },
    { endpoint: "/profile", label: "Profile", icon: <AccountCircleIcon /> },
  ];

  return (
    <nav
      className={`order-1 w-full flex items-center justify-center gap-5 md:gap-8 md:justify-around lg:order-0 lg:justify-center lg:gap-16 ${theme === "dark" ? "text-white" : "text-black"}`}
    >
      {options.map((option) => {
        return (
          <button
            key={option.endpoint}
            className={`transition-all duration-75 active:scale-90  border-b-3 border-transparent hover:border-[#2830c9] flex flex-col items-center justify-center cursor-pointer px-3 py-1 md:text-xl lg:flex-row lg:gap-2 ${theme === "dark" ? "hover:bg-[#072446]" : "hover:bg-blue-100"}`}
            onClick={() => {
              navigate(option.endpoint);
            }}
          >
            <div>{option.icon}</div>
            <p className="font-semibold lg:font-normal">{option.label}</p>
          </button>
        );
      })}
    </nav>
  );
}
