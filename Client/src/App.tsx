// import { useState } from 'react'
import './App.css'
import './styles/site.css'
import './styles/responsive.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from './layouts/CustomerLayout';

//Pages
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

//Utils
import ScrollToTop from './utils/scrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Customer side */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          {/*Page Fetch product*/}
          <Route path=":categorySlug/:brandSlug/:slug" element={<ProductDetail />} />
          <Route path=":categorySlug" element={<CategoryPage />} />
          <Route path=":categorySlug/:brandSlug" element={<CategoryPage />} />

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Customer Account */}
          <Route path="/profile" element={<CustomerAccount />} />

          <Route path="/cart" element={<CartPage />} />

          {/* Static pages */}
          <Route path="contact" element={<ContactPage />} />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />

        </Route>

        {/* You can add AdminLayout here later */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
