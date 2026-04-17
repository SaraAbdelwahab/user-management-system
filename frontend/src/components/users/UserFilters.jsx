import { Search, SlidersHorizontal, X } from 'lucide-react';

const UserFilters = ({ filters, onFilterChange, onSearch }) => {
  const hasActiveFilters = filters.search || filters.status;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  const clearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('status', '');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card px-5 py-4">
      <div className="flex flex-wrap items-end gap-3">

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <p className="label-caps mb-1.5">Search</p>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-400 pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Name or email…"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                w-full pl-9 pr-4 py-2.5 text-[13.5px] border border-slate-200 rounded-xl bg-white
                placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                transition-all duration-150
              "
            />
          </div>
        </div>

        {/* Status */}
        <div className="w-40">
          <p className="label-caps mb-1.5">Status</p>
          <div className="relative">
            <SlidersHorizontal
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-400 pointer-events-none"
              strokeWidth={2}
            />
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="
                w-full pl-9 pr-4 py-2.5 text-[13.5px] border border-slate-200 rounded-xl bg-white
                text-gray-900 appearance-none
                focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                transition-all duration-150
              "
            >
              <option value="">All users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            onClick={onSearch}
            className="
              flex items-center gap-2 px-4 py-2.5
              text-[13.5px] font-semibold text-white
              bg-primary-500 hover:bg-primary-600 active:bg-primary-700
              rounded-xl shadow-btn-primary
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
          >
            <Search className="w-[14px] h-[14px]" strokeWidth={2.5} />
            Search
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="
                flex items-center gap-1.5 px-3.5 py-2.5
                text-[13px] font-medium text-gray-500
                border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-gray-700
                transition-all duration-150 shadow-xs
              "
              title="Clear filters"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
