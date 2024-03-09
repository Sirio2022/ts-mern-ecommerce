import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { UserInfo } from '../types/UserInfo';
import { User } from '../types/User';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
    mutationFn: async (id: string) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      });

      if (result.isConfirmed) {
        await apiClient.delete(`api/admin/users/deleteuser/${id}`);
        toast.success('User removed successfully');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
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
      (
        await apiClient.put<User>(
          `api/admin/users/updateuser/${user._id}`,
          user
        )
      ).data,
    onSettled: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};
