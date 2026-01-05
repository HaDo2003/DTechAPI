import '../../styles/site.css'
import '../../styles/responsive.css'
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/customer/footer/Footer";
import Breadcrumb from "../components/customer/Breadcrumb";
import ChatBox from "../components/customer/ChatBox";
import DesktopHeader from "../components/customer/DesktopHeader";
import MobileHeader from "../components/customer/MobileHeader";
import { visitorDataService } from '../services/VisitorDataService';
import { useAuth } from '../context/AuthContext';
import ZaloBox from '../components/customer/ZaloBox';
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