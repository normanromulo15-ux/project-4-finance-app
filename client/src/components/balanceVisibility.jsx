import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function BalanceVisibility(props) {
  const { balance, balanceVisibility, handleBalanceVisibility } = props;
  let widthValue;

  switch (balance) {
    case "spending":
      widthValue = "1.25rem";
      break;

    case "allAccounts":
      widthValue = "3rem";
      break;
  }

  return (
    <div className="cursor-pointer">
      {!balanceVisibility ? (
        <VisibilityIcon
          onClick={handleBalanceVisibility}
          sx={{ width: widthValue }}
        />
      ) : (
        <VisibilityOffIcon
          onClick={handleBalanceVisibility}
          sx={{ width: widthValue }}
        />
      )}
    </div>
  );
}
