import React from "react";
import DesktopHeader from "../components/customer/header/desktop/DesktopHeader";
import MobileHeader from "../components/customer/header/mobile/MobileHeader";
import Footer from "../components/customer/footer/Footer";
// import Breadcrumb from "../components/customer/Breadcrumb";
// import ChatBox from "../components/customer/ChatBox";

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      {/* <Breadcrumb /> */}
      <main className="container padding-custom">{children}</main>
      <div className="">
        <Footer />
      </div>

      {/* <ChatBox /> */}
    </div>
  );
};

export default CustomerLayout;