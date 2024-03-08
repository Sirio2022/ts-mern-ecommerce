import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { UserInfo } from '../types/UserInfo';
import { User } from '../types/User';
import { toast } from 'react-toastify';
import { getError } from '../utils/Utils';
import { ApiError } from '../types/ApiError';

export const useSignInMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (await apiClient.post<UserInfo>('api/users/signin', { email, password }))
        .data,
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>('api/users/register', {
          name,
          email,
          password,
        })
      ).data,
  });

export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.put<UserInfo>('api/users/profile', {
          name,
          email,
          password,
        })
      ).data,
  });

export const useAdminUsersQuery = () =>
  useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => (await apiClient.get<User[]>('api/admin/users')).data,
  });

export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete(`api/admin/users/${id}`)).data,
    onError: (error) => {
      toast.error(getError(error as ApiError));
    },
    onSuccess: (data) => {
      if (data.message === 'User removed successfully') {
        toast.success('User deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      }
    },
  });
};

export const useGetAdminUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: ['adminUser', id],
    queryFn: async () =>
      (await apiClient.get<User>(`api/admin/users/${id}`)).data,
  });

export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) =>
      (await apiClient.put<User>(`api/admin/users/${user._id}`, user)).data,
    onSettled: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};
