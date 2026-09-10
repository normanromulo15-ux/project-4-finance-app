export default function PageNavigationBar(props) {
  const { entryLength, handlePageNavigation, page } = props;
  const numericEntryLength = Number(entryLength);
  const numericEntryLimit = 5;
  const pages = Math.ceil(numericEntryLength / numericEntryLimit);
  const initialArray = new Array(pages).fill("");
  const pageNumberContainer = initialArray.map((_, i) => i + 1);

  return (
    <section className="flex justify-center gap-1">
      <button className="px-2 py-1 border font-medium">&laquo;</button>
      {pageNumberContainer.map((pageNumber, index) => {
        return (
          <button
            key={index}
            className={`px-2 py-1 border font-medium ${Number(page) === pageNumber && "text-white bg-[#2830c9] border-neutral-400"}`}
            onClick={() => {
              handlePageNavigation(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button className="px-2 py-1 border font-medium">&raquo;</button>
    </section>
  );
}
