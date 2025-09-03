import React, { useState, type ReactNode } from "react";

export interface Tab {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActive?: string;
  fullName?: string;
  onLogout?: () => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActive, fullName, onLogout}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActive || tabs[0].key
  );

  return (
    <div className="row">
      {/* Sidebar */}
      <div className="col-xs-12 col-sm-12 col-lg-3">
        <h4 className="text-center">Customer Account</h4>
        <p className="text-center">Hello, {fullName}</p>
        <ul className="no-bullets" id="menu">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              className={`m-3 li-custom cursor-pointer ${activeTab === tab.key ? "active" : ""
                }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </li>
          ))}
          <li className="m-3">
            <a href="" className="a-custom" onClick={(e) => { e.preventDefault(); onLogout && onLogout(); }}>
              Log Out
            </a>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="col-xs-12 col-sm-12 col-lg-9 py-1" id="content">
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;