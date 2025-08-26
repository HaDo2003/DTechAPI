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

//Utils
import ScrollToTop from './utils/ScrollToTop';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Customer side */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path=":categorySlug/:brandSlug/:slug" element={<ProductDetail />} />
          <Route path=":categorySlug" element={<CategoryPage />} />
          <Route path=":categorySlug/:brandSlug" element={<CategoryPage />} />
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
