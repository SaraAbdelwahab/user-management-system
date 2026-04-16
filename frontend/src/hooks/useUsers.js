import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import toast from 'react-hot-toast';

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    select: (data) => ({
      users: data.data,
      pagination: data.pagination,
    }),
    keepPreviousData: true,
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically update
      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(user => 
            user.id === id ? { ...user, ...data } : user
          ),
        };
      });
      
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previousUsers);
      toast.error('Failed to update user');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.deleteUser,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      const previousUsers = queryClient.getQueryData(['users']);
      
      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter(user => user.id !== id),
        };
      });
      
      return { previousUsers };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
      toast.error('Failed to delete user');
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: userService.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};