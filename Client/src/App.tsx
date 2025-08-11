// import { useState } from 'react'
import './App.css'
import './styles/site.css'
import './styles/responsive.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/customer/Home';
import NotFound from './pages/customer/NotFound';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer side */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
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
