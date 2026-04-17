import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import UserModal from '../components/users/UserModal';
import Pagination from '../components/ui/Pagination';

import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';

const Users = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [filters, setFilters] = useState({ search: '', status: '', sortBy: 'created_at', sortOrder: 'DESC' });
  const [modalState, setModalState] = useState({ isOpen: false, user: null });
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'DESC' });

  const { data, isLoading } = useUsers({ ...pagination, ...filters });
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = data?.users || [];
  const paginationData = data?.pagination || {};

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ASC' ? 'DESC' : 'ASC';
    setSortConfig({ key, direction });
    setFilters((p) => ({ ...p, sortBy: key, sortOrder: direction }));
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalState.user) {
        await updateMutation.mutateAsync({ id: modalState.user.id, data: formData });
        toast.success('User updated');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('User created');
      }
      setModalState({ isOpen: false, user: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            {paginationData.total != null
              ? `${paginationData.total} users in your system`
              : 'Manage and monitor platform users'}
          </p>
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, user: null })}
          className="
            flex items-center gap-2 px-4 py-2.5 flex-shrink-0
            text-[13.5px] font-semibold text-white
            bg-primary-500 hover:bg-primary-600 active:bg-primary-700
            rounded-xl shadow-btn-primary
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add User
        </button>
      </div>

      {/* ── Filters ── */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={() => setPagination((p) => ({ ...p, page: 1 }))}
      />

      {/* ── Table ── */}
      <UserTable
        users={users}
        loading={isLoading}
        onEdit={(user) => setModalState({ isOpen: true, user })}
        onDelete={handleDelete}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* ── Pagination ── */}
      {paginationData.totalPages > 1 && (
        <Pagination
          currentPage={paginationData.page}
          totalPages={paginationData.totalPages}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        />
      )}

      {/* ── Modal ── */}
      <UserModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, user: null })}
        onSubmit={handleModalSubmit}
        user={modalState.user}
        title={modalState.user ? 'Edit User' : 'Create New User'}
      />
    </div>
  );
};

export default Users;
