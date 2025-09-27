// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Admin Pages
import AdminRoute from './routes/adminRoute';

//Utils
import ScrollToTop from './utils/scrollToTop';
import Checkout from './pages/customer/CheckOut';
import AccessDenied from './pages/customer/AccessDenied';
import Dashboard from './pages/admin/Dashboard';
import PrivateRoute from './routes/privateRoute';

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
import ManagementPage from "./pages/admin/ManagementPage";
import AdminAccountFormPage from "./pages/admin/admin/AdminAccountFormPage";
import AdminDelete from "./pages/admin/admin/AdminDelete";
import AdvertisementFormPage from "./pages/admin/advertisement/AdvertisementFormPage";
import AdvertisementDelete from "./pages/admin/advertisement/AdvertisementDelete";


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
        <Route
          path="/admin"
          element={
            <AdminRoute allowedRoles={["Admin", "Seller"]}>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Only for ADMIN routes */}
          <Route
            path="admin"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <ManagementPage />
              </AdminRoute>
            }
          />

          <Route
            path="admin/create"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <AdminAccountFormPage />
              </AdminRoute>
            }
          />

          <Route
            path="admin/edit/:id"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <AdminAccountFormPage />
              </AdminRoute>
            }
          />

          <Route
            path="admin/delete/:id"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <AdminDelete />
              </AdminRoute>
            }
          />

          {/* Admin and seller routes */}
          <Route
            path="advertisement"
            element={
              <AdminRoute allowedRoles={["Admin", "Seller"]}>
                <ManagementPage />
              </AdminRoute>
            }
          />

          <Route
            path="advertisement/create"
            element={
              <AdminRoute allowedRoles={["Admin", "Seller"]}>
                <AdvertisementFormPage />
              </AdminRoute>
            }
          />

          <Route
            path="advertisement/edit/:id"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <AdvertisementFormPage />
              </AdminRoute>
            }
          />

          <Route
            path="advertisement/delete/:id"
            element={
              <AdminRoute allowedRoles={["Admin"]}>
                <AdvertisementDelete />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
