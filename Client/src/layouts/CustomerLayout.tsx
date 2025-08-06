import React from "react";
import LargeHeader from "../components/customer/Header/LargeHeader";
import SmallHeader from "../components/customer/Header/SmallHeader";
// import Footer from "../components/customer/Footer";
// import Breadcrumb from "../components/customer/Breadcrumb";
// import ChatBox from "../components/customer/ChatBox";

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="customer-layout">
      <div className="d-none d-lg-block fixed-top">
        <LargeHeader />
      </div>
      <div className="d-block d-lg-none fixed-top">
        <SmallHeader />
      </div>
      {/* <Breadcrumb /> */}
      <main>{children}</main>
      {/* <Footer />
      <ChatBox /> */}
    </div>
  );
};

export default CustomerLayout;