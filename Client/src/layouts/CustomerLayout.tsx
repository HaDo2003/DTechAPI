import '../styles/site.css'
import '../styles/responsive.css'
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DesktopHeader from "../components/customer/header/desktop/DesktopHeader.tsx";
import MobileHeader from "../components/customer/header/mobile/MobileHeader.tsx";
import Footer from "../components/customer/footer/Footer.tsx";
import Breadcrumb from "../components/customer/Breadcrumb.tsx";
import ChatBox from "../components/customer/ChatBox.tsx";
import { visitorDataService } from '../services/VisitorDataService.ts';
import { useAuth } from '../context/AuthContext.ts';
import ZaloBox from '../components/customer/ZaloBox.tsx';
// import { AuthDebugger } from "../context/AuthContext";

const CustomerLayout: React.FC = () => {
  const {token} = useAuth();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      const recordVisit = async () => {
        await visitorDataService.updateVisitorCount();
        sessionStorage.setItem("hasVisited", "true");
      };
      recordVisit();
    }
  }, []);

  return (
    <div className="customer-layout">
      {/* <AuthDebugger /> */}
      <div className="">
        <div className="d-none d-lg-block fixed-top">
          <DesktopHeader />
        </div>
        <div className="d-block d-lg-none fixed-top">
          <MobileHeader />
        </div>
      </div>

      <main className="container padding-custom">
        <Breadcrumb />
        <Outlet /> {/* Renders child route components here */}
      </main>
      <div className="">
        <Footer />
      </div>

      {/* <ChatBox /> */}
      {token && <ChatBox />}

      <ZaloBox />
    </div>
  );
};

export default CustomerLayout;