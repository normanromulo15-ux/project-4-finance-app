import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function NetChangeIndicator(props) {
  const { balanceDifference, netChangePercentage, numericBalanceDifference } =
    props;
  const returnComponent = () => {
    if (numericBalanceDifference === 0) {
      return (
        <h3 className="text-xl font-medium text-gray-500 md:text-2xl">
          No net change for this period
        </h3>
      );
    } else if (numericBalanceDifference > 0) {
      return (
        <h3 className="flex items-center">
          <ArrowUpwardIcon
            sx={{
              color: "white",
              background: "#046E00",
              borderRadius: "100%",
              padding: "0.2rem",
              scale: 0.85,
            }}
          />
          <span className="text-[#046E00] text-xl font-medium md:text-2xl">
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
              background: "#C0151D",
              borderRadius: "100%",
              padding: "0.2rem",
              scale: 0.85,
            }}
          />
          <span className="text-[#C0151D] text-xl font-medium md:text-2xl">
            {netChangePercentage} ({balanceDifference})
          </span>
        </h3>
      );
    }
  };

  return <>{returnComponent()}</>;
}
