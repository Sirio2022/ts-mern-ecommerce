import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import './index.css'
import HomePage from './pages/HomePage.tsx';
import ProductPage from './pages/ProductPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from './Store';
import CartPage from './pages/CartPage.tsx';
import SigninPage from './pages/SigninPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ShippingAddressPage from './pages/ShippingAddressPage.tsx';
import PaymentMethodPage from './pages/PaymentMethodPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.tsx';
import PlaceOrderPage from './pages/PlaceOrderPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import OrderHistoryPage from './pages/OrderHistoryPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import SearchCategoryPage from './pages/SearchCategoryPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import AdminProductsPage from './pages/AdminProductsPage.tsx';

import CreateProductPage from './pages/CreateProductPage.tsx';
import AdminUpdateProductPage from './pages/AdminUpdateProductPage.tsx';
import AdminUsersPage from './pages/AdminUsersPage.tsx';
import AdminUsersEditPage from './pages/AdminUsersEditPage.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path='product/:slug' element={<ProductPage />} />
      <Route path='cart' element={<CartPage />} />
      <Route path='signin' element={<SigninPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route path='search/category' element={<SearchCategoryPage />} />
      <Route path='search' element={<SearchPage />} />



      {/* Protected Routes */}
      <Route path='' element={<ProtectedRoute />} >
        <Route path='shipping' element={<ShippingAddressPage />} />
        <Route path='payment' element={<PaymentMethodPage />} />
        <Route path='placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:orderId' element={<OrderPage />} />
        <Route path='/orderhistory' element={<OrderHistoryPage />} />
        <Route path='/userprofile' element={<ProfilePage />} />
      </Route>

      <Route path='' element={<ProtectedAdminRoute />} >
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/adminorders' element={<OrdersPage />} />
        <Route path='/adminproduct/:id/edit' element={<AdminUpdateProductPage />} />
        <Route path='/adminproducts' element={<AdminProductsPage />} />
        <Route path='/admincreateproduct' element={<CreateProductPage />} />
        <Route path='/adminuser/:id/edit' element={<AdminUsersEditPage />} />
        <Route path='/adminusers' element={<AdminUsersPage />} />

      </Route>



      {/*</*Route path="dashboard" element={<Dashboard />} >*/}
      {/* ... etc. */}
    </Route>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider options={{ 'clientId': 'sb' }} deferLoading={true}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>,
)
