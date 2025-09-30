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
import RouteLink from "./routes/routeLink";
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
          {/* Admin Page */}
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
          {/* Advertisement Page */}
      {RouteLink({ path: "advertisement", element: <ManagementPage /> })}
      {RouteLink({ path: "advertisement/create", element: <AdvertisementFormPage /> })}
      {RouteLink({ path: "advertisement/edit/:id", element: <AdvertisementFormPage /> })}
      {RouteLink({ path: "advertisement/delete/:id", element: <AdvertisementDelete /> })}

      {/* Brand Page */}
      {RouteLink({ path: "brand", element: <ManagementPage /> })}
      {RouteLink({ path: "brand/create", element: <ManagementPage /> })}
      {RouteLink({ path: "brand/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "brand/delete/:id", element: <ManagementPage /> })}

      {/* Category Page */}
      {RouteLink({ path: "category", element: <ManagementPage /> })}
      {RouteLink({ path: "category/create", element: <ManagementPage /> })}
      {RouteLink({ path: "category/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "category/delete/:id", element: <ManagementPage /> })}

      {/* Coupon Page */}
      {RouteLink({ path: "coupon", element: <ManagementPage /> })}
      {RouteLink({ path: "coupon/create", element: <ManagementPage /> })}
      {RouteLink({ path: "coupon/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "coupon/delete/:id", element: <ManagementPage /> })}

      {/* Customer Page */}
      {RouteLink({ path: "customer", element: <ManagementPage /> })}
      {RouteLink({ path: "customer/edit/:id", element: <ManagementPage /> })}

      {/* Feedback Page */}
      {RouteLink({ path: "feedback", element: <ManagementPage /> })}
      {RouteLink({ path: "feedback/edit/:id", element: <ManagementPage /> })}

      {/* Order Page */}
      {RouteLink({ path: "order", element: <ManagementPage /> })}
      {RouteLink({ path: "order/edit/:id", element: <ManagementPage /> })}

      {/* Payment Method Page */}
      {RouteLink({ path: "payment-method", element: <ManagementPage /> })}
      {RouteLink({ path: "payment-method/create", element: <ManagementPage /> })}
      {RouteLink({ path: "payment-method/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "payment-method/delete/:id", element: <ManagementPage /> })}

      {/* Post Page */}
      {RouteLink({ path: "post", element: <ManagementPage /> })}
      {RouteLink({ path: "post/create", element: <ManagementPage /> })}
      {RouteLink({ path: "post/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "post/delete/:id", element: <ManagementPage /> })}

      {/* Post Category Page */}
      {RouteLink({ path: "post-category", element: <ManagementPage /> })}
      {RouteLink({ path: "post-category/create", element: <ManagementPage /> })}
      {RouteLink({ path: "post-category/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "post-category/delete/:id", element: <ManagementPage /> })}

      {/* Product Page */}
      {RouteLink({ path: "product", element: <ManagementPage /> })}
      {RouteLink({ path: "product/create", element: <ManagementPage /> })}
      {RouteLink({ path: "product/edit/:id", element: <ManagementPage /> })}
      {RouteLink({ path: "product/delete/:id", element: <ManagementPage /> })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
