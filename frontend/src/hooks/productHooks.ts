import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { Product } from '../types/Products';
import { toast } from 'react-toastify';

export const useGetProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>('api/products')).data,
  });
};

export const useGetProductDetailsBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });
};

export const useGetProductCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await apiClient.get<string[]>('api/products/categories')).data,
  });
};

export const useGetSearchProductsQuery = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`api/products/search/?query=${query}`))
        .data,
  });
};

export const useGetSearchCategoryProductsQuery = (query: string) => {
  return useQuery({
    queryKey: ['searchCategory', query],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`api/products/search/category/${query}`))
        .data,
  });
};

export const useGetAdminProductsQuery = () => {
  return useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () =>
      (await apiClient.get<Product[]>('api/products/admin')).data,
  });
};

export const useCreateAdminProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) =>
      (
        await apiClient.post<Product>(
          'api/products/admin/createproduct',
          product
        )
      ).data,
    onSettled: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const useUpdateAdminProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) =>
      (
        await apiClient.put<Product>(
          `api/products/admin/updateproduct/${product._id}`,
          product
        )
      ).data,
    onSettled: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const useDeleteAdminProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete(`api/products/admin/deleteproduct/${id}`)).data,
    onSettled: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const useGetProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/admin/${id}`)).data,
  });
};
