import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/common/Button';
import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import UserModal from '../components/users/UserModal';
import Pagination from '../components/ui/Pagination';

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/useUsers';

const Users = () => {
  // UI state only (NOT server state)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'DESC',
  });

  // 🔥 React Query (server state)
  const { data, isLoading, error } = useUsers({
    ...pagination,
    ...filters,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = data?.users || [];
  const paginationData = data?.pagination || {};

  
  // HANDLERS


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ASC'
        ? 'DESC'
        : 'ASC';

    setSortConfig({ key, direction });

    setFilters(prev => ({
      ...prev,
      sortBy: key,
      sortOrder: direction,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCreateUser = () => {
    setModalState({ isOpen: true, user: null });
  };

  const handleEditUser = (user) => {
    setModalState({ isOpen: true, user });
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalState.user) {
        await updateUserMutation.mutateAsync({
          id: modalState.user.id,
          data: formData,
        });
        toast.success('User updated successfully');
      } else {
        await createUserMutation.mutateAsync(formData);
        toast.success('User created successfully');
      }

      setModalState({ isOpen: false, user: null });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Operation failed'
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Users
        </h1>

        <Button onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* FILTERS */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* TABLE */}
      <UserTable
        users={users}
        loading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* PAGINATION */}
      {paginationData.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={paginationData.page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* MODAL */}
      <UserModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, user: null })
        }
        onSubmit={handleModalSubmit}
        user={modalState.user}
        title={
          modalState.user ? 'Edit User' : 'Create New User'
        }
      />
    </div>
  );
};

export default Users;