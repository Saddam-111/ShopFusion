import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

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
    <div className="flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg border border-art-gold/30 text-art-silver hover:bg-art-gold/10 hover:text-art-gold transition-colors"
          >
            First
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-2 rounded-lg border border-art-gold/30 text-art-silver hover:bg-art-gold/10 hover:text-art-gold transition-colors"
          >
            Prev
          </button>
        </>
      )}

      {generatePageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentPage === number
              ? 'bg-art-gold text-art-black border-art-gold font-semibold'
              : 'border-art-gold/30 text-art-silver hover:bg-art-gold/10 hover:text-art-gold'
          }`}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages && (
        <>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-2 rounded-lg border border-art-gold/30 text-art-silver hover:bg-art-gold/10 hover:text-art-gold transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg border border-art-gold/30 text-art-silver hover:bg-art-gold/10 hover:text-art-gold transition-colors"
          >
            Last
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;