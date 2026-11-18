import {
  CartesianGrid,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  formatCurrency,
  formatBalanceHistoryTimestamp,
} from "../utils/formatters.js";

export default function BalanceHistoryChart(props) {
  const { theme, balances } = props;
  return (
    <section>
      <AreaChart
        style={{ width: "100%", aspectRatio: 1.618, maxWidth: 650 }}
        responsive
        data={balances}
      >
        <CartesianGrid />
        <Area
          fill="#C5C7F2"
          stroke="#2830C9"
          strokeWidth={2}
          dataKey="balance"
        />
        <YAxis
          width={55}
          tick={{
            fill: `${theme === "dark" ? "#FFFFFF" : "#000000"}`,
            fontWeight: 400,
          }}
          tickFormatter={(balance) => `₱${(balance / 1e3).toFixed(0)}k`}
        />
        <XAxis
          dataKey="balanceTimestamp"
          tick={{
            fill: `${theme === "dark" ? "#FFFFFF" : "#000000"}`,
            fontWeight: 400,
          }}
          tickFormatter={(balanceTimestamp) =>
            `${formatBalanceHistoryTimestamp(balanceTimestamp, false)}`
          }
        />
        <Tooltip
          labelFormatter={(balanceTimestamp) =>
            `${formatBalanceHistoryTimestamp(balanceTimestamp, true)}`
          }
          formatter={(balance) => `${formatCurrency(balance)}`}
        />
      </AreaChart>
    </section>
  );
}
