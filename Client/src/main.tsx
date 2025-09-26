import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Bootrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import $ from "jquery";

// DataTable
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

// AdminLTE
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";

// Apex Chart
import "apexcharts/dist/apexcharts.css";

//Provider
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.ts';
import { CartProvider } from './context/CartContext.ts';

// make jQuery available globally
window.$ = $;
window.jQuery = $;
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <CartProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
