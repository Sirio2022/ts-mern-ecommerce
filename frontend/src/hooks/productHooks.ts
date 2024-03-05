import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { Product } from '../types/Products';

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

