import React from 'react';
import { Cart, CartItem, ShippingAddress } from './types/Cart';
import { UserInfo } from './types/UserInfo';

type AppState = {
    mode: string;
    cart: Cart;
    userInfo?: UserInfo;
};

const initialState: AppState = {

    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : undefined,

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
    | { type: 'ADD_TO_CART', payload: CartItem }
    | { type: 'REMOVE_FROM_CART', payload: CartItem }
    | { type: 'USER_SIGNIN', payload: UserInfo }
    | { type: 'USER_SIGNOUT' }
    | { type: 'SAVE_SHIPPING_ADDRESS', payload: ShippingAddress }
    | { type: 'SAVE_PAYMENT_METHOD', payload: string }
    | { type: 'CART_CLEAR' };

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
        case 'REMOVE_FROM_CART': {
            const cartItems = state.cart.cartItems.filter(
                (item: CartItem) => item._id !== action.payload._id
            );
            const cartPrices = state.cart.cartPrices;
            (cartPrices.itemsPrice = cartItems.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
            )),
                (cartPrices.shippingPrice = cartPrices.itemsPrice > 100 ? 10 : 0),
                (cartPrices.taxPrice = 0.15 * cartPrices.itemsPrice),
                (cartPrices.totalPrice =
                    cartPrices.itemsPrice +
                    cartPrices.shippingPrice +
                    cartPrices.taxPrice);
            localStorage.setItem('cartPrices', JSON.stringify(cartPrices));
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return {
                ...state,
                cart: { ...state.cart, cartItems },
            };
        }
        case 'USER_SIGNIN': {
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            return { ...state, userInfo: action.payload };
        }
        case 'USER_SIGNOUT': {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartPrices');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');
            return {
                ...state,
                mode:
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light',
                cart: {
                    cartItems: [],
                    cartPrices: {
                        itemsPrice: 0,
                        shippingPrice: 0,
                        taxPrice: 0,
                        totalPrice: 0,
                    },
                    shippingAddress: {
                        fullName: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: '',
                    },
                    paymentMethod: 'PayPal',
                    isPaid: false,
                    paidAt: '',
                    isDelivered: false,
                    deliveredAt: '',
                    createdAt: '',
                    updatedAt: '',
                },
            };
        }
        case 'SAVE_SHIPPING_ADDRESS': {
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
            return {
                ...state,
                cart: { ...state.cart, shippingAddress: action.payload },
            };
        }
        case 'SAVE_PAYMENT_METHOD': {
            localStorage.setItem('paymentMethod', action.payload);
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
        }
        case 'CART_CLEAR': {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartPrices');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');
            return {
                ...state,
                cart: {
                    cartItems: [],
                    cartPrices: {
                        itemsPrice: 0,
                        shippingPrice: 0,
                        taxPrice: 0,
                        totalPrice: 0,
                    },
                    shippingAddress: {
                        fullName: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: '',
                    },
                    paymentMethod: 'PayPal',
                    isPaid: false,
                    paidAt: '',
                    isDelivered: false,
                    deliveredAt: '',
                    createdAt: '',
                    updatedAt: '',
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
