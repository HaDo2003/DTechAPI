// src/components/NavItem.tsx
import React from 'react';

interface NavItemProps {
  icon: string;
  labelFull: string;
  labelShort: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeCount?: number;
  phone?: boolean;
  dropdownContent?: React.ReactNode;
  isDropdownOpen?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  labelFull,
  labelShort,
  onClick,
  showBadge = false,
  badgeCount = 0,
  phone = false,
  dropdownContent,
  isDropdownOpen = false,
}) => {
  return (
    <li className="nav-item me-2 mt-2">
      <button
        onClick={onClick}
        className={`nav-link active d-flex align-items-center text-light text-decoration-none btn border-0 bg-transparent 
          ${labelFull === 'Account' ? 'dropdown-toggle' : ''}`} 
          style={{ minHeight: '50px' }}
      >
        <div className="me-1 position-relative">
          <i className={`fa-solid ${icon} fa-xl`}></i>
          {showBadge && badgeCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {badgeCount}
            </span>
          )}
        </div>
        <div className="text-light d-flex flex-column justify-content-center">
          <p className="mb-0 fontsize d-none d-xxl-block">{labelFull}</p>
          <p className="mb-0 fontsize d-block d-xxl-none">{labelShort}</p>
          {phone && (
            <>
              <strong className="fontsize d-none d-xxl-block">1800.1234</strong>
              <strong className="fontsize d-block d-xxl-none">1800...</strong>
            </>
          )}
        </div>
      </button>
      {isDropdownOpen && dropdownContent && (
        <ul className="dropdown-menu show position-absolute">
          {dropdownContent}
        </ul>
      )}
    </li>
  );
};

export default NavItem;