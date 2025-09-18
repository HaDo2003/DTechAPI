import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InformationItem from "./InformationItem";
import { informationMenu } from "../../../utils/menuConfig";
import type { Admin } from "../../../types/Admin";
import SidebarWrapper from "./SidebarWrapper";

interface AdminSidebarProps {
  user: Admin | null;
  mainPage?: string;
  page?: string;
}

const Sidebar: React.FC<AdminSidebarProps> = ({
  user,
  mainPage = "",
  page = "",
}) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = useState(mainPage === "information");

  const activeClass = (
    isActive: boolean,
    baseClass = "nav-link",
    activeClass = "active"
  ) => (isActive ? `${baseClass} ${activeClass}` : baseClass);

  const menuItemClass = (isOpen: boolean) =>
    `nav-item ${isOpen ? "menu-open" : ""}`;

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      {/* Sidebar Brand */}
      <div className="sidebar-brand">
        <Link to="/" className="brand-link">
          <img
            src={user?.avatar}
            alt={user?.userName}
            className="brand-image opacity-75 shadow rounded-circle"
          />
          <span className="brand-text fw-light">{user?.userName}</span>
        </Link>
      </div>

      {/* Sidebar Wrapper */}
      <div className="sidebar-wrapper" ref={sidebarRef}>
        <SidebarWrapper>
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              data-lte-toggle="treeview"
              data-accordion="false"
            >
              {/* Dashboard */}
              <li className={menuItemClass(mainPage === "dashboard")}>
                <Link to="/admin/dashboard" className={activeClass(mainPage === "dashboard")}>
                  <i className="nav-icon bi bi-speedometer"></i>
                  <p>Dashboard</p>
                </Link>
              </li>

              {/* Customer Support */}
              <li className={menuItemClass(mainPage === "customer-support")}>
                <Link to="/admin/chat" className={activeClass(mainPage === "customer-support")}>
                  <i className="nav-icon bi bi-chat-dots-fill"></i>
                  <p>Customer Support</p>
                </Link>
              </li>

              {/* Information Menu */}
              <li className={`nav-item ${infoOpen ? "menu-open" : ""}`}>
                <a
                  href="#"
                  className={activeClass(mainPage === "information")}
                  onClick={(e) => {
                    e.preventDefault();
                    setInfoOpen((prev) => !prev);
                  }}
                >
                  <i className="nav-icon bi bi-table"></i>
                  <p>
                    Information <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </a>
                {infoOpen && (
                  <ul className="nav nav-treeview">
                    {informationMenu.map((item) => (
                      <InformationItem
                        key={item.key}
                        to={item.to}
                        label={item.label}
                        isActive={page === item.key}
                      />
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </SidebarWrapper>
      </div>
    </aside>
  );
};

export default Sidebar;
