import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { transactionCategories as categories } from "../utils/constants.js";
import CloseIcon from "@mui/icons-material/Close";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SchoolIcon from "@mui/icons-material/School";
import PaymentsIcon from "@mui/icons-material/Payments";
import FlatwareIcon from "@mui/icons-material/Flatware";
import GavelIcon from "@mui/icons-material/Gavel";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HouseIcon from "@mui/icons-material/House";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import GroupsIcon from "@mui/icons-material/Groups";
import DevicesIcon from "@mui/icons-material/Devices";
import CommuteIcon from "@mui/icons-material/Commute";
import PowerIcon from "@mui/icons-material/Power";
import WorkIcon from "@mui/icons-material/Work";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function TransactionCategoriesDropdown(props) {
  const inputRef = useRef(null);
  const { transactionType } = useParams();
  const {
    handleTransactionDetailsInput,
    category,
    amount,
    setTransactionDetails,
    amountExceedBalance,
  } = props;
  const [showTransactionsCategory, setShowTransactionsCategory] =
    useState(false);
  const [transactionCategories, setTransactionCategories] =
    useState(categories);

  useEffect(() => {
    filterTransactionCategories();
  }, [category]);

  // Function to handle filtering of transactions categories
  function filterTransactionCategories() {
    const searchKeyword =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().trim();
    if (category.trim().charAt(0) === "") {
      setTransactionCategories(categories);
      return;
    }
    const filteredCategories = categories.filter((item) =>
      item.startsWith(searchKeyword),
    );
    setTransactionCategories(filteredCategories);
  }

  // Function to handle category input focus
  function handleCategoryInputFocus() {
    inputRef.current.focus();
  }

  return (
    <div className="relative flex flex-col gap-1">
      <label className="font-semibold md:text-lg" htmlFor="category">
        Category:{" "}
        {(!amount || !category) && transactionType === "debit" && (
          <span className="text-red-500 ">*</span>
        )}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="cursor-text w-full disabled:cursor-not-allowed rounded-lg
          border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium md:placeholder:text-base"
          id="category"
          name="category"
          value={category}
          onChange={handleTransactionDetailsInput}
          onFocus={() => {
            setShowTransactionsCategory(true);
          }}
          onBlur={() => {
            setShowTransactionsCategory(false);
          }}
          disabled={!amount || Number(amount) <= 0 || amountExceedBalance}
          placeholder="Select a category..."
          required={true}
        />
        {showTransactionsCategory &&
          (transactionCategories.length > 0 ? (
            <ul
              className="absolute -bottom-40 z-10 w-full overflow-y-auto h-36 flex flex-col gap-3 border-2 bg-gray-50 rounded-lg p-4 md:h-72 md:-bottom-72 lg:-bottom-72"
              id="transaction-categories"
            >
              {transactionCategories.map((transactionCategory) => {
                let transactionExamples = "";
                let transactionIcon;
                switch (transactionCategory) {
                  case "Communication":
                    transactionIcon = <QuestionAnswerIcon />;
                    transactionExamples =
                      "load, broadband, calls, texts, postage";
                    break;

                  case "Education":
                    transactionIcon = <SchoolIcon />;
                    transactionExamples =
                      "tuition, books, courses, uniform, supplies";
                    break;

                  case "Financial":
                    transactionIcon = <PaymentsIcon />;
                    transactionExamples =
                      "savings, deposit, withdrawal, loan, insurance";
                    break;

                  case "Food":
                    transactionIcon = <FlatwareIcon />;
                    transactionExamples =
                      "groceries, breakfast, lunch, dinner, snacks";
                    break;

                  case "Government":
                    transactionIcon = <GavelIcon />;
                    transactionExamples =
                      "taxes, passport, license, permit, clearance";
                    break;

                  case "Health":
                    transactionIcon = <HealthAndSafetyIcon />;
                    transactionExamples =
                      "checkup, medicine, dental, laboratory, insurance";
                    break;

                  case "Housing":
                    transactionIcon = <HouseIcon />;
                    transactionExamples =
                      "rent, repairs, furniture, appliances, mortgage";
                    break;

                  case "Leisure":
                    transactionIcon = <SportsEsportsIcon />;
                    transactionExamples =
                      "movies, gaming, streaming, travel, concerts";
                    break;

                  case "Personal":
                    transactionIcon = <SentimentVerySatisfiedIcon />;
                    transactionExamples =
                      "clothing, grooming, toiletries, haircut, cosmetics";
                    break;

                  case "Social":
                    transactionIcon = <GroupsIcon />;
                    transactionExamples =
                      "dating, gifts, birthday, wedding, donation";
                    break;

                  case "Technology":
                    transactionIcon = <DevicesIcon />;
                    transactionExamples =
                      "smartphone, laptop, earbuds, accessories, software";
                    break;

                  case "Transportation":
                    transactionIcon = <CommuteIcon />;
                    transactionExamples =
                      "jeepney, bus, taxi, gasoline, parking";
                    break;

                  case "Utilities":
                    transactionIcon = <PowerIcon />;
                    transactionExamples =
                      "electricity, water, internet, cooking gas, garbage";
                    break;

                  case "Work":
                    transactionIcon = <WorkIcon />;
                    transactionExamples =
                      "equipment, software, supplies, training, coworking";
                    break;
                }
                return (
                  <li
                    key={transactionCategory}
                    className="transition-all duration-200 active:scale-95 cursor-pointer hover:bg-gray-300 flex gap-2 items-center font-medium p-2 rounded-xl border bg-gray-200"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setTransactionDetails((prev) => ({
                        ...prev,
                        category: transactionCategory,
                      }));
                      setShowTransactionsCategory(false);
                    }}
                  >
                    <div>{transactionIcon}</div>
                    <div>
                      <h1 className="text-lg">{transactionCategory}</h1>
                      <p className="text-sm text-gray-600">
                        Examples: {transactionExamples}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="absolute -bottom-40 z-10 w-full overflow-y-auto h-36 flex flex-col items-center justify-center border-2 bg-gray-50 rounded-lg p-4 md:-bottom-36">
              <p className="text-medium text-gray-500">No results found.</p>
            </div>
          ))}
        <button
          className="transition-all active:scale-85 cursor-pointer disabled:cursor-not-allowed absolute bottom-2 right-2"
          disabled={!amount || Number(amount) <= 0 || amountExceedBalance}
          onClick={() => {
            handleCategoryInputFocus();
            setShowTransactionsCategory(true);
          }}
        >
          <ArrowDropDownIcon />
        </button>
        {category.trim() && (
          <button
            className="absolute right-8 top-1.5 cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => {
              handleCategoryInputFocus();
              setTransactionDetails((prev) => ({
                ...prev,
                category: "",
                description: "",
              }));
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}
