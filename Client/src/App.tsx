// import { useState } from 'react'
import './App.css'
import './styles/site.css'
import './styles/responsive.css'
import CustomerLayout from './layouts/CustomerLayout';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <CustomerLayout>
        <Routes>
          <Route path="/" />
          {/* Add more routes here */}
        </Routes>
      </CustomerLayout>
    </BrowserRouter>
  );
}

export default App
