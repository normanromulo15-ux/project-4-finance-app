import { CartesianGrid, AreaChart, Area, YAxis } from "recharts";

export default function BalanceHistory(props) {
  const { balances } = props;
  const scaledBalances = balances.map((item) => {
    return { ...item, balance: item.balance / 1e3 };
  });
  return (
    <section>
      <AreaChart
        style={{ width: "100%", aspectRatio: 1.618, maxWidth: 650 }}
        responsive
        data={scaledBalances}
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
          label={{
            value: "Balance (PHP)",
            position: "insideLeft",
            angle: -90,
            fill: "#000000",
            fontWeight: 600,
          }}
          tick={{ fill: "#000000", fontWeight: 600 }}
        />
      </AreaChart>
      <p className="text-sm md:text-base">
        Balance Scale: <span className="font-bold">Thousands (1,000)</span>
      </p>
    </section>
  );
}
