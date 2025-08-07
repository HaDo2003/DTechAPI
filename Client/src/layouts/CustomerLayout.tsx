import React from "react";
import DesktopHeader from "../components/customer/Header/Desktop/DesktopHeader";
import MobileHeader from "../components/customer/Header/Mobile/MobileHeader";
// import Footer from "../components/customer/Footer";
// import Breadcrumb from "../components/customer/Breadcrumb";
// import ChatBox from "../components/customer/ChatBox";

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="customer-layout">
      <div className="d-none d-lg-block fixed-top">
        <DesktopHeader />
      </div>
      <div className="d-block d-lg-none fixed-top">
        <MobileHeader />
      </div>
      {/* <Breadcrumb /> */}
      <main>{children}</main>
      {/* <Footer />
      <ChatBox /> */}
    </div>
  );
};

export default CustomerLayout;