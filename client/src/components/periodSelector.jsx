import { useState, useEffect } from "react";
import { periods } from "../utils/constants.js";

export default function PeriodSelector(props) {
  const { period, onPeriodChange } = props;
  const [periodOptions, setPeriodOptions] = useState([]);
  useEffect(() => {
    setPeriodOptions(periods);
  });

  return (
    <nav className="flex justify-center gap-4">
      {periodOptions.map((e) => {
        return (
          <div
            key={e.value}
            className={`font-medium px-2 py-1 ${period === e.value ? "rounded-full bg-gray-100 text-[#2830c9]" : "text-gray-700"}`}
            onClick={() => onPeriodChange(e.value)}
          >
            {e.title}
          </div>
        );
      })}
    </nav>
  );
}
