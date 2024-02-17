export type CartItem = {
  _id: string;
  name: string;
  slug: string;
  image: string | undefined;
  price: number;
  countInStock: number;
  qty: number;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Cart = {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  cartPrices: {
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  };
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
};
