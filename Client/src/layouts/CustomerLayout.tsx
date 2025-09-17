import React from "react";
import { Outlet } from "react-router-dom";
import DesktopHeader from "../components/customer/header/desktop/DesktopHeader";
import MobileHeader from "../components/customer/header/mobile/MobileHeader";
import Footer from "../components/customer/footer/Footer";
import Breadcrumb from "../components/customer/Breadcrumb";
import ChatBox, { type ChatMessage } from "../components/customer/ChatBox";
// import { AuthDebugger } from "../context/AuthContext";

const CustomerLayout: React.FC = () => {
  const currentUserId = "123";
  const messages: ChatMessage[] = [
    {
      id: "1",
      senderId: "support",
      message: "Welcome! Need any help?",
      timestamp: new Date().toISOString(),
    },
  ];
  
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
      <ChatBox currentUserId={currentUserId} messages={messages} />
    </div>
  );
};

export default CustomerLayout;