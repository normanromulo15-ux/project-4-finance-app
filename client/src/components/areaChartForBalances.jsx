import { CartesianGrid, AreaChart, Area, YAxis } from "recharts";

export default function BalanceHistory(props) {
  const { balances } = props;
  return (
    <section>
      <AreaChart
        style={{ width: "100%", aspectRatio: 1.618, maxWidth: 600 }}
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
        <YAxis width="16" />
      </AreaChart>
    </section>
  );
}
