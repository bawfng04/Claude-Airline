import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSibling > 2;
    const shouldShowRightDots = rightSibling < totalPages - 1;

    // First page
    pages.push(
      <button
        key={1}
        className={`px-4 py-2 mx-1 rounded ${
          1 === currentPage
            ? "bg-primary-color text-white"
            : "bg-gray-200 text-gray-700 hover:bg-primary-light"
        }`}
        onClick={() => handlePageClick(1)}
      >
        1
      </button>
    );

    // Left dots
    if (shouldShowLeftDots) {
      pages.push(<span key="left-dots" className="px-4 py-2 mx-1">...</span>);
    }

    // Middle pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <button
            key={i}
            className={`px-4 py-2 mx-1 rounded ${
              i === currentPage
                ? "bg-primary-color text-white"
                : "bg-gray-200 text-gray-700 hover:bg-primary-light"
            }`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Right dots
    if (shouldShowRightDots) {
      pages.push(<span key="right-dots" className="px-4 py-2 mx-1">...</span>);
    }

    // Last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            totalPages === currentPage
              ? "bg-primary-color text-white"
              : "bg-gray-200 text-gray-700 hover:bg-primary-light"
          }`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-primary-light"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-primary-light"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;