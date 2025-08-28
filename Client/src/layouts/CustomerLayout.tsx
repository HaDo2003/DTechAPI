import React from "react";
import { Outlet } from "react-router-dom";
import DesktopHeader from "../components/customer/header/desktop/DesktopHeader";
import MobileHeader from "../components/customer/header/mobile/MobileHeader";
import Footer from "../components/customer/footer/Footer";
import Breadcrumb from "../components/customer/Breadcrumb";
// import ChatBox from "../components/customer/ChatBox";

const CustomerLayout: React.FC = () => {
  return (
    <div className="customer-layout">
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
    </div>
  );
};

export default CustomerLayout;