import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxVisiblePages = 5;
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages are less than max visible pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end of visible pages
    let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

    // Adjust start if end is too close to total pages
    start = Math.max(2, end - maxVisiblePages + 3);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] h-10 px-3 rounded-lg transition duration-200 ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="px-2 text-gray-400">...</span>
            )}
          </React.Fragment>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}