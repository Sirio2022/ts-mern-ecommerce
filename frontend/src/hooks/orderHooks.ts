import { useMutation, useQuery } from '@tanstack/react-query';
import { CartItem, ShippingAddress } from '../types/Cart';
import apiClient from '../apiClient';
import { Order } from '../types/Order';

export const useOrderDetailsQuery = (orderId: string) =>
  useQuery({
    queryKey: ['order', orderId],
    queryFn: async () =>
      (await apiClient.get<Order>(`/api/orders/${orderId}`)).data,
  });

export const usePaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>('/api/keys/paypal')).data,
  });

export const usePaypalPaymentMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `/api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  });

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      cartPrices: {
        itemsPrice: number;
        shippingPrice: number;
        taxPrice: number;
        totalPrice: number;
      };
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          '/api/orders',
          order
        )
      ).data,
  });
