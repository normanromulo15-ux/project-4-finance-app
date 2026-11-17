import { periods } from "../utils/constants.js";

export default function PeriodSelector(props) {
  const { theme, period, onPeriodChange } = props;

  return (
    <nav className="flex justify-center gap-4 md:gap-8">
      {periods.map((periodOption) => {
        return (
          <div
            key={periodOption.value}
            className={`transition-all duration-75 cursor-pointer active:scale-90 font-medium rounded-full px-3 py-2 md:px-4 md:text-lg ${period === periodOption.value && theme === "light" ? " bg-gray-200 text-[#2830c9]" : "text-gray-700"} ${theme === "dark" && "text-white hover:bg-[#072446]"} ${theme === "dark" && period === periodOption.value && "bg-[#2830c9]"}`}
            onClick={() => onPeriodChange(periodOption.value)}
          >
            {periodOption.title}
          </div>
        );
      })}
    </nav>
  );
}
