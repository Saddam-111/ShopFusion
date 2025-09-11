import React from 'react'
import { useSelector } from 'react-redux'

const Pagination = ({
  currentPage,
  onPageChange,
  activeClass = "bg-[#1f241f] text-white",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "First",
  lastPageText = "Last",
}) => {
  const { totalPages, products } = useSelector((state) => state.product);

  if (products.length === 0 || totalPages <= 1) return null;

  // Generate page numbers with a sliding window
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      {/* First + Prev buttons */}
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {firstPageText}
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {prevPageText}
          </button>
        </>
      )}

      {/* Page numbers */}
      {generatePageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === number
              ? `${activeClass} border-blue-600`
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next + Last buttons */}
      {currentPage < totalPages && (
        <>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {nextPageText}
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
