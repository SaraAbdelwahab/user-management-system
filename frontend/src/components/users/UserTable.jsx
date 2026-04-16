import { useState } from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import Button from '../common/Button';
import { format } from 'date-fns';

const UserTable = ({ users, loading, onEdit, onDelete, onSort, sortConfig }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const columns = [
    { key: 'fullName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader 
          columns={columns} 
          sortConfig={sortConfig}
          onSort={onSort}
        />
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="text-gray-600">User</span>
              </TableCell>
              <TableCell>{getStatusBadge(user.isActive)}</TableCell>
              <TableCell>
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;