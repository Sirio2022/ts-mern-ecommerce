import { ApiError } from '../types/ApiError';
import { CartItem } from '../types/Cart';
import { Product } from '../types/Products';

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
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    qty: 1,
  };
  return cartItem;
};
