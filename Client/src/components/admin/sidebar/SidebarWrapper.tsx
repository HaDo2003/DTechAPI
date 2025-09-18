import React, { useEffect, useRef, type ReactNode } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

interface SidebarWrapperProps {
  children: ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const osInstance = OverlayScrollbars(sidebarRef.current, {
      scrollbars: {
        theme: "os-theme-light",
        autoHide: "leave",
        clickScroll: true,
      },
    });

    // Clean up on unmount
    return () => {
      osInstance.destroy();
    };
  }, []);

  return (
    <div className="sidebar-wrapper" ref={sidebarRef}>
      {children}
    </div>
  );
};

export default SidebarWrapper;
