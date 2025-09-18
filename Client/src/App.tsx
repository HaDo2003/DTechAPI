// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/customer/Home';
import NotFound from './pages/customer/NotFound';
import ProductDetail from './pages/customer/ProductDetail';
import CategoryPage from './pages/customer/CategoryPage';
import ContactPage from './pages/customer/Contact';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import CustomerAccount from './pages/customer/CustomerAccount';
import CartPage from './pages/customer/Cart';
import OrderSuccess from './pages/customer/OrderSuccess';
import OrderFail from './pages/customer/OrderFail';
import SearchPage from './pages/customer/SearchPage';

// Admin Pages
import AdminRoute from './routes/adminRoute';

//Utils
import ScrollToTop from './utils/scrollToTop';
import Checkout from './pages/customer/CheckOut';
import AccessDenied from './pages/customer/AccessDenied';
import Dashboard from './pages/admin/Dashboard';
import PrivateRoute from './routes/privateRoute';



function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Customer side */}
        <Route element={<CustomerLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="order-success" element={<NotFound />} />
          <Route path="order-fail" element={<OrderFail />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="access-denied" element={<AccessDenied />} />
          <Route path="not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
          <Route path=":categorySlug/:brandSlug/:slug" element={<ProductDetail />} />
          <Route path=":categorySlug" element={<CategoryPage />} />
          <Route path=":categorySlug/:brandSlug" element={<CategoryPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<CustomerAccount />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="check-out" element={<Checkout />} />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          {/* <Route path="products" element={<ProductManagement />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
