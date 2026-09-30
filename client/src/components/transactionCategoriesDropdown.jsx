import { useEffect, useState } from "react";
import { transactionCategories as categories } from "../utils/constants.js";

export default function TransactionCategoriesDropdown(props) {
  const {
    handleTransactionDetailsInput,
    category,
    amount,
    setTransactionDetails,
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

  return (
    <div className="relative flex flex-col gap-1">
      <label className="font-semibold md:text-lg" htmlFor="category">
        Category:
      </label>
      <input
        type="search"
        className="disabled:cursor-not-allowed  cursor-text rounded-lg
        border border-gray-600 bg-gray-100 p-2 placeholder:text-sm font-medium md:placeholder:text-base"
        id="category"
        name="category"
        onChange={handleTransactionDetailsInput}
        onFocus={() => {
          setShowTransactionsCategory(true);
        }}
        disabled={!amount || Number(amount) <= 0}
        placeholder="Select a category..."
        required={true}
        value={category}
      />
      {showTransactionsCategory &&
        (transactionCategories.length > 0 ? (
          <ul
            className="absolute -bottom-40 z-10 w-full overflow-y-auto h-36 flex flex-col gap-3 border-2 bg-gray-50 rounded-lg p-4 md:h-72 md:-bottom-76"
            id="transaction-categories"
          >
            {transactionCategories.map((transactionCategory) => {
              let transactionExamples = "";

              switch (transactionCategory) {
                case "Communication":
                  transactionExamples =
                    "load, broadband, calls, texts, postage";
                  break;

                case "Education":
                  transactionExamples =
                    "tuition, books, courses, uniform, supplies";
                  break;

                case "Financial":
                  transactionExamples =
                    "savings, deposit, withdrawal, loan, insurance";
                  break;

                case "Food":
                  transactionExamples =
                    "groceries, breakfast, lunch, dinner, snacks";
                  break;

                case "Government":
                  transactionExamples =
                    "taxes, passport, license, permit, clearance";
                  break;

                case "Health":
                  transactionExamples =
                    "checkup, medicine, dental, laboratory, insurance";
                  break;

                case "Housing":
                  transactionExamples =
                    "rent, repairs, furniture, appliances, mortgage";
                  break;

                case "Leisure":
                  transactionExamples =
                    "movies, gaming, streaming, travel, concerts";
                  break;

                case "Personal":
                  transactionExamples =
                    "clothing, grooming, toiletries, haircut, cosmetics";
                  break;

                case "Social":
                  transactionExamples =
                    "dating, gifts, birthday, wedding, donation";
                  break;

                case "Technology":
                  transactionExamples =
                    "smartphone, laptop, earbuds, accessories, software";
                  break;

                case "Transportation":
                  transactionExamples = "jeepney, bus, taxi, gasoline, parking";
                  break;

                case "Utilities":
                  transactionExamples =
                    "electricity, water, internet, cooking gas, garbage";
                  break;

                case "Work":
                  transactionExamples =
                    "equipment, software, supplies, training, coworking";
                  break;
              }

              return (
                <li
                  key={transactionCategory}
                  className="font-medium p-2 rounded-xl border bg-gray-200"
                  onClick={() => {
                    setTransactionDetails((prev) => ({
                      ...prev,
                      category: transactionCategory,
                    }));
                    setShowTransactionsCategory(false);
                  }}
                >
                  <h1 className="text-lg">{transactionCategory}</h1>
                  <p className="text-sm text-gray-600">
                    Examples: {transactionExamples}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="absolute -bottom-40 z-10 w-full overflow-y-auto h-36 flex flex-col items-center justify-center border-2 bg-gray-50 rounded-lg p-4">
            <p className="text-medium text-gray-500">No results found.</p>
          </div>
        ))}
    </div>
  );
}
