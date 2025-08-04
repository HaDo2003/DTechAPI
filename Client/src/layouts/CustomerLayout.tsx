import React from "react";
import Header from "../components/customer/Header";
// import Footer from "../components/customer/Footer";
// import Breadcrumb from "../components/customer/Breadcrumb";
// import ChatBox from "../components/customer/ChatBox";

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="customer-layout">
      <Header />
      {/* <Breadcrumb /> */}
      <main>{children}</main>
      {/* <Footer />
      <ChatBox /> */}
    </div>
  );
};

export default CustomerLayout;