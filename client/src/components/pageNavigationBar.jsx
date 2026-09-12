export default function PageNavigationBar(props) {
  const { totalEntries, handlePageNavigation, currentPage } = props;
  const maxEntriesPerPage = 5;
  const maxVisiblePageButtons = 5;
  const totalNumberOfPages = 8; /*Math.ceil(totalEntries / maxEntriesPerPage);*/
  const startingPageNumber =
    currentPage >= 4 && totalNumberOfPages > maxVisiblePageButtons
      ? currentPage - 2
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
    <section className="flex justify-center gap-1">
      <button
        className="cursor-pointer p-1 border font-medium text-sm rounded-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
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
            className={`cursor-pointer px-2 py-1 border font-medium rounded-md ${currentPage === pageNumber && "text-white bg-[#2830c9] border-neutral-400"}`}
            onClick={() => {
              handlePageNavigation(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        className="cursor-pointer p-1 border font-medium text-sm rounded-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
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
