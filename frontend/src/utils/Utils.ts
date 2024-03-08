import { ApiError } from '../types/ApiError';
import { CartItem } from '../types/Cart';
import { Product } from '../types/Products';
import { format } from '@formkit/tempo';

export const formatearFecha = (fecha: string) => {
  const l = 'en';
  const t = new Date(fecha);

  const fechaFormateada = format(t, 'MMMM D, YYYY h:mm a', l);

  return fechaFormateada;
};

export function formatoMoneda(cantidad: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cantidad);
}

export const getError = (error: ApiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const convertProductToCartItem = (product: Product) => {
  const cartItem: CartItem = {
    _id: product._id as string,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    qty: 1,
  };
  return cartItem;
};
