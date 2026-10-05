import { useState, useEffect } from "react";
import { periods } from "../utils/constants.js";

export default function PeriodSelector(props) {
  const { period, onPeriodChange } = props;
  const [periodOptions, setPeriodOptions] = useState([]);
  useEffect(() => {
    setPeriodOptions(periods);
  });

  return (
    <nav className="flex justify-center gap-4 md:gap-8">
      {periodOptions.map((e) => {
        return (
          <div
            key={e.value}
            className={`transition-all duration-75 cursor-pointer active:scale-90 font-medium px-2 py-1 md:px-4 md:text-lg ${period === e.value ? "rounded-full bg-gray-200 text-[#2830c9]" : "text-gray-700"}`}
            onClick={() => onPeriodChange(e.value)}
          >
            {e.title}
          </div>
        );
      })}
    </nav>
  );
}
