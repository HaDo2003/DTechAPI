import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DTechLogo from '../../../../assets/DTechlogo.png';
import NavItem from './NavItem';
import MenuItem from './MenuItem';
import DropDownItem from './DropDownItem';
import AccountItem from '../AccountItem';

import { useAuth } from '../../../../context/AuthContext';
import { useCart } from '../../../../context/CartContext';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

const DesktopHeader: React.FC<HeaderProps> = ({
    onSearch,
}) => {
    const { token, user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [isMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
    const navigate = useNavigate();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchHistoryRef = useRef<HTMLDivElement>(null);

    // Load search history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save search history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    // Handle clicks outside search history to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchHistoryRef.current && !searchHistoryRef.current.contains(event.target as Node) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setShowSearchHistory(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Add to search history
            const newHistoryItem: SearchHistoryItem = {
                query: searchQuery.trim(),
                timestamp: Date.now()
            };

            // Remove duplicate and add to beginning, keep only last 10
            const updatedHistory = [
                newHistoryItem,
                ...searchHistory.filter(item => item.query !== searchQuery.trim())
            ].slice(0, 10);

            setSearchHistory(updatedHistory);
            setShowSearchHistory(false);

            if (onSearch) {
                onSearch(searchQuery.trim());
            }

            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchInputFocus = () => {
        if (searchHistory.length > 0) {
            setShowSearchHistory(true);
        }
    };

    const handleHistoryItemClick = (query: string) => {
        setSearchQuery(query);
        setShowSearchHistory(false);
        if (onSearch) {
            onSearch(query);
        }
    };

    const clearSearchHistory = () => {
        setSearchHistory([]);
        setShowSearchHistory(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleDropdownMouseLeave = () => {
        // Add delay to prevent dropdown from closing when moving to submenu
        setTimeout(() => {
            setActiveDropdown(null);
            setActiveSubDropdown(null);
        }, 200);
    };

    const handleSubDropdownMouseEnter = (subDropdownName: string) => {
        setActiveSubDropdown(subDropdownName);
    };

    return (
        <>
            {/* Main Header */}
            <div className="header clearfix bg-main">
                <div className="container py-2">
                    <div className="row align-items-center">
                        {/* Logo */}
                        <div className="col-2 col-lg-3 col-xl-2">
                            <Link to="/" className="d-inline-block">
                                <img
                                    src={DTechLogo}
                                    className="img-logo"
                                    alt="DTech logo"
                                    style={{ cursor: "pointer" }}
                                />
                            </Link>
                        </div>

                        {/* Search Box */}
                        <div className="col-3 col-lg-2 col-xl-4 mx-0 mx-md-auto my-auto search-box position-relative">
                            <form onSubmit={handleSearch}>
                                <div className="input-group form-container">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        name="query"
                                        id="searchInput"
                                        className="form-control search-input"
                                        placeholder="Search"
                                        autoComplete="off"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={handleSearchInputFocus}
                                    />
                                    <button className="btn btn-search" type="submit">
                                        <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                                    </button>
                                </div>
                            </form>

                            {/* Search History Dropdown */}
                            {showSearchHistory && searchHistory.length > 0 && (
                                <div
                                    ref={searchHistoryRef}
                                    className="search-history position-absolute w-100 bg-white border rounded shadow-sm mt-1"
                                >
                                    <div className="search-history-header d-flex justify-content-between align-items-center p-2 border-bottom">
                                        <span className="text-muted small">Recent Searches</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-danger p-0"
                                            onClick={clearSearchHistory}
                                        >
                                            <i className="fa-solid fa-trash fa-xs"></i> Clear
                                        </button>
                                    </div>
                                    <div className="search-history-list">
                                        {searchHistory.map((item, index) => (
                                            <button
                                                key={index}
                                                className="btn btn-link text-start w-100 p-2 border-0 text-decoration-none"
                                                onClick={() => handleHistoryItemClick(item.query)}
                                            >
                                                {item.query}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Items */}
                        <div className="col-6 col-lg-7 col-xl-6">
                            <ul className="nav justify-content-start">
                                {/* Phone */}
                                <NavItem
                                    icon="fa-phone"
                                    labelFull="Call to order"
                                    labelShort="Call to..."
                                    phone={true}
                                />

                                {/* Location */}
                                <NavItem
                                    icon="fa-location-dot"
                                    labelFull="Location"
                                    labelShort="Loca..."
                                />

                                {/* Shopping Cart */}
                                <NavItem
                                    icon="fa-shopping-cart"
                                    labelFull="Shopping Cart"
                                    labelShort="Cart"
                                    showBadge={cartItemCount > 0}
                                    badgeCount={cartItemCount}
                                    onClick={() => handleNavigation('/cart')}
                                />

                                {/* News */}
                                <NavItem
                                    icon="fa-newspaper"
                                    labelFull="News"
                                    labelShort="News"
                                    onClick={() => handleNavigation('/news')}
                                />

                                {/* User Account */}
                                <div
                                    onMouseEnter={() => setActiveDropdown('account')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <NavItem
                                        icon="fa-user"
                                        labelFull="Account"
                                        labelShort="Acc..."
                                        isDropdownOpen={activeDropdown === 'account'}
                                        dropdownContent={
                                            <ul className="list-unstyled">
                                                {token ? (
                                                    <>
                                                        {(user?.roles === "Admin" || user?.roles === "Seller") && (
                                                            <AccountItem label='Admin Panel' onClick={() => handleNavigation('/admin')} />
                                                        )}
                                                        <AccountItem label='Profile' onClick={() => handleNavigation('/profile')} />
                                                        <AccountItem label='Logout' onClick={logout} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <AccountItem label='Login' onClick={() => handleNavigation('/login')} />
                                                        <AccountItem label='Register' onClick={() => handleNavigation('/register')} />
                                                    </>
                                                )}
                                            </ul>
                                        }
                                    />
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu */}
            <div className="mainmenu clearfix bg-main">
                <div className="container">
                    <nav className="navbar navbar-expand-lg py-1 ps-xl-4">
                        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100 flex-nowrap d-flex gap-custom">
                                <MenuItem label="Home" path="/" />
                                <MenuItem label="All Products" path="/all-products" />
                                <MenuItem label="Laptop" path="/laptop" />
                                <MenuItem label="Mobile" path="/smart-phone" />
                                <MenuItem label="Tablet" path="/tablet" />

                                {/* Accessory Dropdown */}
                                <li
                                    className="nav-item dropdown"
                                    onMouseEnter={() => setActiveDropdown('accessory')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        className="nav-link dropdown-toggle text-light btn border-0 bg-transparent"
                                        onClick={() => navigate('/accessory')}
                                    >
                                        Accessory
                                    </button>

                                    {activeDropdown === 'accessory' && (
                                        <ul
                                            className="dropdown-menu show position-absolute"
                                            onMouseEnter={() => setActiveDropdown('accessory')}
                                            onMouseLeave={handleDropdownMouseLeave}
                                        >
                                            <DropDownItem
                                                label='Mouse'
                                                path="/mouse"
                                                activeSubDropdown={activeSubDropdown}
                                                subItems={[
                                                    { label: "Wired Mouse", path: "/wired-mouse" },
                                                    { label: "Wireless Mouse", path: "/wireless-mouse" },
                                                ]}
                                                onMouseEnter={() => handleSubDropdownMouseEnter('mouse')}
                                            />

                                            <DropDownItem
                                                label='Keyboard'
                                                path="/keyboard"
                                                activeSubDropdown={activeSubDropdown}
                                                subItems={[
                                                    { label: "Wired Keyboard", path: "/wired-keyboard" },
                                                    { label: "Wireless Keyboard", path: "/wireless-keyboard" },
                                                ]}
                                                onMouseEnter={() => handleSubDropdownMouseEnter('keyboard')}
                                            />

                                            <DropDownItem
                                                label='Headphone'
                                                path="/headphone"
                                                activeSubDropdown={activeSubDropdown}
                                                subItems={[
                                                    { label: "Wired Headphone", path: "/wired-headphone" },
                                                    { label: "Wireless Headphone", path: "/wireless-headphone" },
                                                ]}
                                                onMouseEnter={() => handleSubDropdownMouseEnter('headphone')}
                                            />
                                        </ul>
                                    )}
                                </li>
                                <MenuItem label="Policy" path="/" />
                                <MenuItem label="Contact" path="/contact" />
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default DesktopHeader;