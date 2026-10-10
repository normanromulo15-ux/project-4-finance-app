import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function NetChangeIndicator(props) {
  const {
    theme,
    balanceDifference,
    netChangePercentage,
    numericBalanceDifference,
  } = props;
  const returnComponent = () => {
    if (numericBalanceDifference === 0) {
      return (
        <h3
          className={`text-xl font-medium md:text-2xl lg:text-3xl ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          No net change for this period
        </h3>
      );
    } else if (numericBalanceDifference > 0) {
      return (
        <h3 className="flex items-center">
          <ArrowUpwardIcon
            sx={{
              color: "white",
              background: `${theme === "dark" ? "#05DF72" : "#046E00"}`,
              borderRadius: "100%",
              padding: "0.2rem",
              scale: 0.85,
            }}
          />
          <span
            className={`text-xl font-medium md:text-2xl lg:text-3xl ${theme === "dark" ? "text-green-400" : "text-[#046E00]"}`}
          >
            +{netChangePercentage} (+{balanceDifference})
          </span>
        </h3>
      );
    } else {
      return (
        <h3 className="flex items-center">
          <ArrowDownwardIcon
            sx={{
              color: "white",
              background: `${theme == "dark" ? "#FF6467" : "#C0151D"}`, 
              borderRadius: "100%",
              padding: "0.2rem",
              scale: 0.85,
            }}
          />
          <span
            className={`text-xl font-medium md:text-2xl lg:text-3xl ${theme === "dark" ? "text-red-400" : "text-[#C0151D]"}`}
          >
            {netChangePercentage} ({balanceDifference})
          </span>
        </h3>
      );
    }
  };

  return <>{returnComponent()}</>;
}
