import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end   = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const navBtn = `
    inline-flex items-center justify-center h-8 min-w-[2rem] px-2.5 text-[13px] font-medium
    rounded-lg border transition-all duration-150 focus:outline-none
  `;

  return (
    <div className="flex items-center justify-between">

      {/* Info */}
      <p className="text-[13px] text-gray-500">
        Page <span className="font-semibold text-gray-900">{currentPage}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-900">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${navBtn} gap-1 border-slate-200 text-gray-600 bg-white
            hover:bg-slate-50 hover:border-slate-300 shadow-xs
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPages().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${navBtn}
                ${page === currentPage
                  ? 'bg-primary-500 border-primary-500 text-white shadow-btn-primary'
                  : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${navBtn} gap-1 border-slate-200 text-gray-600 bg-white
            hover:bg-slate-50 hover:border-slate-300 shadow-xs
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
