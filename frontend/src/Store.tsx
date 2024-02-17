import React from 'react';
import { Cart, CartItem } from './types/Cart';

type AppState = {
    mode: string;
    cart: Cart;
};

const initialState: AppState = {
    mode: localStorage.getItem('mode')
        ? localStorage.getItem('mode')!
        : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(
                localStorage.getItem('cartItems')!)
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(
                localStorage.getItem('shippingAddress')!)
            : {},
        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')!
            : 'PayPal',
        cartPrices: localStorage.getItem('cartPrices') ? JSON.parse(
            localStorage.getItem('cartPrices')!)
            : {
                itemsPrice: 0,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: 0,
            },
        isPaid: false,
        paidAt: '',
        isDelivered: false,
        deliveredAt: '',
        createdAt: '',
        updatedAt: '',
    }
};

type Action =
    | { type: 'TOGGLE_MODE' }
    | { type: 'ADD_TO_CART', payload: CartItem };

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'TOGGLE_MODE': {
            const newMode = state.mode === 'dark' ? 'light' : 'dark';
            localStorage.setItem('mode', newMode);
            return { ...state, mode: newMode };
        }
        case 'ADD_TO_CART': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item: CartItem) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item: CartItem) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems))

            const itemsPrice = cartItems
                .reduce((acc, item) => acc + item.price * item.qty, 0);

            const shippingPrice = itemsPrice > 100 ? 10 : 0;

            const taxPrice = 0.15 * itemsPrice;

            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            localStorage.setItem('cartPrices', JSON.stringify({
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }))
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems,
                    cartPrices: {
                        itemsPrice,
                        shippingPrice,
                        taxPrice,
                        totalPrice,
                    },
                },
            };
        }
        default:
            return state;
    }
};

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const AppStateContext = React.createContext({
    state: initialState,
    dispatch: defaultDispatch,
});

function StoreProvider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
        reducer,
        initialState
    )

    return <AppStateContext.Provider value={{ state, dispatch }} {...props} />
}

export { AppStateContext, StoreProvider };
