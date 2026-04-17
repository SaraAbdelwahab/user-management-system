import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full ${className}`}>{children}</table>
  </div>
);

export const TableHeader = ({ columns, sortConfig, onSort }) => {
  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortConfig?.key !== col.key)
      return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
    return sortConfig.direction === 'ASC'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary-500" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary-500" />;
  };

  return (
    <thead>
      <tr className="border-b border-gray-100">
        {columns.map((col) => (
          <th
            key={col.key}
            onClick={() => col.sortable && onSort(col.key)}
            className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
              ${col.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''}`}
          >
            <div className="flex items-center gap-1.5">
              {col.label}
              <SortIcon col={col} />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-50">{children}</tbody>
);

export const TableRow = ({ children, onClick, className = '' }) => (
  <tr
    onClick={onClick}
    className={`hover:bg-slate-50 transition-colors duration-100 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-5 py-4 text-sm text-gray-900 ${className}`}>{children}</td>
);
