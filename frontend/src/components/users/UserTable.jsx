import { Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Users } from 'lucide-react';
import { format } from 'date-fns';

/* ── Sort icon ── */
const SortIcon = ({ columnKey, sortConfig }) => {
  if (sortConfig?.key !== columnKey)
    return <ChevronsUpDown className="w-3 h-3 text-gray-300" strokeWidth={2} />;
  return sortConfig.direction === 'ASC'
    ? <ChevronUp   className="w-3 h-3 text-primary-500" strokeWidth={2.5} />
    : <ChevronDown className="w-3 h-3 text-primary-500" strokeWidth={2.5} />;
};

/* ── Status badge ── */
const StatusBadge = ({ isActive }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
      bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
      bg-slate-100 text-slate-500 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );

/* ── Avatar ── */
const AVATAR_COLORS = [
  'bg-primary-100 text-primary-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

const Avatar = ({ name }) => {
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const color = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
};

/* ── Column definitions ── */
const COLUMNS = [
  { key: 'fullName',  label: 'User',    sortable: true  },
  { key: 'email',     label: 'Email',   sortable: true  },
  { key: 'role',      label: 'Role',    sortable: false },
  { key: 'status',    label: 'Status',  sortable: true  },
  { key: 'createdAt', label: 'Joined',  sortable: true  },
  { key: 'actions',   label: '',        sortable: false },
];

const UserTable = ({ users, loading, onEdit, onDelete, onSort, sortConfig }) => {

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-20 flex items-center justify-center">
        <div className="w-7 h-7 border-[2.5px] border-slate-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`
                    px-5 py-3 text-left
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-100/80 select-none' : ''}
                    ${col.key === 'actions' ? 'w-24' : ''}
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="label-caps">{col.label}</span>
                    {col.sortable && <SortIcon columnKey={col.key} sortConfig={sortConfig} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/70 transition-colors duration-100 group"
              >
                {/* User */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.fullName} />
                    <p className="text-[13.5px] font-semibold text-gray-900 truncate">{user.fullName}</p>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-3.5">
                  <p className="text-[13px] text-gray-500 truncate max-w-[200px]">{user.email}</p>
                </td>

                {/* Role */}
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold
                    bg-slate-100 text-slate-600 border border-slate-200">
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <StatusBadge isActive={user.isActive} />
                </td>

                {/* Joined */}
                <td className="px-5 py-3.5">
                  <p className="text-[13px] text-gray-500">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => onEdit(user)}
                      title="Edit"
                      className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-gray-400 hover:text-primary-600 hover:bg-primary-50
                        transition-all duration-150"
                    >
                      <Edit2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-gray-400 hover:text-red-600 hover:bg-red-50
                        transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Empty state ── */}
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
          </div>
          <p className="text-[14px] font-semibold text-gray-900">No users found</p>
          <p className="text-[13px] text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
