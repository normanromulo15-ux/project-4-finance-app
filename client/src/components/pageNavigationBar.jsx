export default function PageNavigationBar(props) {
  const { theme, totalEntries, handlePageNavigation, currentPage } = props;
  const maxEntriesPerPage = 5;
  const maxVisiblePageButtons = 5;
  const totalNumberOfPages = Math.ceil(totalEntries / maxEntriesPerPage);
  const startingPageNumber =
    currentPage >= 4 && totalNumberOfPages > maxVisiblePageButtons
      ? Math.min(
          currentPage - 2,
          totalNumberOfPages - maxVisiblePageButtons + 1,
        )
      : 1;
  const endingPageNumber = Math.min(
    totalNumberOfPages,
    startingPageNumber + maxVisiblePageButtons - 1,
  );
  const initialArray = new Array(
    endingPageNumber - startingPageNumber + 1,
  ).fill(startingPageNumber);
  const pageButtonsContainer = initialArray.map(
    (_, i) => startingPageNumber + i,
  );

  return (
    <section className="flex justify-center gap-1 md:gap-2">
      <button
        className={`transition-all duration-75 cursor-pointer p-1 border border-gray-500 font-medium text-sm rounded-md disabled:cursor-not-allowed ${theme === "dark" ? "disabled:bg-gray-400 hover:bg-gray-800" : "hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-600"}  ${currentPage !== 1 && "active:scale-95"}`}
        disabled={currentPage === 1}
        onClick={() => {
          handlePageNavigation(currentPage - 1);
        }}
      >
        Prev
      </button>
      {pageButtonsContainer.map((pageNumber) => {
        return (
          <button
            key={pageNumber}
            className={`transition-all duration-75 active:scale-95 hover:bg-gray-200 cursor-pointer px-2 py-1 border border-gray-500 font-medium rounded-md ${theme === "dark" ? "disabled:bg-gray-400 hover:bg-gray-800" : "hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-600"} ${currentPage === pageNumber && "text-white bg-[#2830c9] border-neutral-400"}`}
            onClick={() => {
              handlePageNavigation(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        className={`transition-all duration-75 cursor-pointer p-1 border border-gray-500 font-medium text-sm rounded-md disabled:cursor-not-allowed ${theme === "dark" ? "disabled:bg-gray-400 hover:bg-gray-800" : "hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-600"} ${currentPage !== totalNumberOfPages && "active:scale-95"}`}
        disabled={currentPage === totalNumberOfPages}
        onClick={() => {
          handlePageNavigation(currentPage + 1);
        }}
      >
        Next
      </button>
    </section>
  );
}
