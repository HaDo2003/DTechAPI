import React, { useState, useEffect, useRef } from 'react';
import DTechLogo from '../../assets/DTechlogo.png';
import NavItem from './NavItem';

interface CartItem {
    id: string;
    quantity: number;
}

interface User {
    isAuthenticated: boolean;
    name?: string;
}

interface HeaderProps {
    user?: User;
    cartItems?: CartItem[];
    onSearch?: (query: string) => void;
    onNavigate?: (path: string) => void;
    onLogin?: () => void;
    onRegister?: () => void;
    onLogout?: () => void;
}

interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

const Header: React.FC<HeaderProps> = ({
    user = { isAuthenticated: false },
    cartItems = [],
    onSearch,
    onNavigate,
    onLogin,
    onRegister,
    onLogout
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeSubDropdown] = useState<string | null>(null);

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
        if (onNavigate) {
            onNavigate(path);
        }
    };

    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="d-none d-lg-block fixed-top">
            {/* Main Header */}
            <div className="header clearfix bg-main">
                <div className="container py-2">
                    <div className="row align-items-center">
                        {/* Logo */}
                        <div className="col-2 col-lg-3 col-xl-2">
                            <button
                                onClick={() => handleNavigation('/')}
                                className="btn p-0 border-0 bg-transparent"
                            >
                                <img
                                    src={DTechLogo}
                                    className="img-logo"
                                    alt="DTech logo"
                                />
                            </button>
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
                                    <span className="input-group-btn">
                                        <button className="btn btn-search" type="submit">
                                            <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                                        </button>
                                    </span>
                                </div>
                            </form>

                            {/* Search History Dropdown */}
                            {showSearchHistory && searchHistory.length > 0 && (
                                <div
                                    ref={searchHistoryRef}
                                    className="search-history position-absolute w-100 bg-white border rounded shadow-sm mt-1"
                                    style={{ zIndex: 1000 }}
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
                                />

                                {/* User Account */}
                                <NavItem
                                    icon="fa-user"
                                    labelFull="Account"
                                    labelShort="Acc..."
                                    onClick={() => toggleDropdown('account')}
                                    isDropdownOpen={activeDropdown === 'account'}
                                    dropdownContent={
                                        user.isAuthenticated ? (
                                            <>
                                                <li>
                                                    <button
                                                        onClick={() => handleNavigation('/profile')}
                                                        className="dropdown-item btn border-0 bg-transparent text-start"
                                                    >
                                                        Profile
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item btn border-0 bg-transparent text-start">
                                                        Settings
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={onLogout} className="dropdown-item btn border-0 bg-transparent text-start">
                                                        Logout
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <button onClick={onLogin} className="dropdown-item btn border-0 bg-transparent text-start">
                                                        Log in
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={onRegister} className="dropdown-item btn border-0 bg-transparent text-start">
                                                        Register
                                                    </button>
                                                </li>
                                            </>
                                        )
                                    }
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu */}
            <div className="mainmenu clearfix bg-main">
                <div className="container">
                    <nav className="navbar navbar-expand-lg py-1 ps-xl-4">
                        <button
                            className="navbar-toggler"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <i className="fa-solid fa-list" style={{ color: '#ffffff' }}></i>
                        </button>

                        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100 flex-nowrap d-flex gap-custom">
                                <li className="nav-item">
                                    <button
                                        onClick={() => handleNavigation('/')}
                                        className="nav-link active text-light btn border-0 bg-transparent"
                                    >
                                        Home
                                    </button>
                                </li>

                                <li className="nav-item text-light">
                                    <button className="nav-link text-light btn border-0 bg-transparent">
                                        Introduce
                                    </button>
                                </li>

                                <li className="nav-item text-light">
                                    <button
                                        onClick={() => handleNavigation('/category/laptop')}
                                        className="nav-link text-light btn border-0 bg-transparent"
                                    >
                                        Laptop
                                    </button>
                                </li>

                                <li className="nav-item text-light">
                                    <button
                                        onClick={() => handleNavigation('/category/smart-phone')}
                                        className="nav-link text-light btn border-0 bg-transparent"
                                    >
                                        Smart Phone
                                    </button>
                                </li>

                                <li className="nav-item text-light">
                                    <button
                                        onClick={() => handleNavigation('/category/tablet')}
                                        className="nav-link text-light btn border-0 bg-transparent"
                                    >
                                        Tablet
                                    </button>
                                </li>

                                {/* Accessory Dropdown */}
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle text-light btn border-0 bg-transparent"
                                        onClick={() => toggleDropdown('accessory')}
                                    >
                                        Accessory
                                    </button>

                                    {activeDropdown === 'accessory' && (
                                        <ul className="dropdown-menu show position-absolute">
                                            <li className="dropdown-item-container">
                                                <button
                                                    onClick={() => handleNavigation('/category/mouse')}
                                                    className="dropdown-item mouse-custom btn border-0 bg-transparent text-start w-100"
                                                    onMouseEnter={() => toggleDropdown('mouse')}
                                                >
                                                    Mouse
                                                </button>

                                                {activeSubDropdown === 'mouse' && (
                                                    <ul className="dropdown-menu show position-absolute" style={{ left: '100%', top: 0 }}>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wired-mouse')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wired Mouse
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wireless-mouse')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wireless Mouse
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li>
                                                <button
                                                    onClick={() => handleNavigation('/category/keyboard')}
                                                    className="dropdown-item btn border-0 bg-transparent text-start w-100"
                                                    onMouseEnter={() => toggleDropdown('keyboard')}
                                                >
                                                    Keyboard
                                                </button>

                                                {activeSubDropdown === 'keyboard' && (
                                                    <ul className="dropdown-menu show position-absolute" style={{ left: '100%', top: 0 }}>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wired-keyboard')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wired Keyboard
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wireless-keyboard')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wireless Keyboard
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li>
                                                <button
                                                    onClick={() => handleNavigation('/category/headphone')}
                                                    className="dropdown-item btn border-0 bg-transparent text-start w-100"
                                                    onMouseEnter={() => toggleDropdown('headphone')}
                                                >
                                                    Headphone
                                                </button>

                                                {activeSubDropdown === 'headphone' && (
                                                    <ul className="dropdown-menu show position-absolute" style={{ left: '100%', top: 0 }}>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wired-headphone')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wired Headphone
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleNavigation('/category/wireless-headphone')}
                                                                className="dropdown-item btn border-0 bg-transparent text-start"
                                                            >
                                                                Wireless Headphone
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>
                                        </ul>
                                    )}
                                </li>

                                <li className="nav-item text-light">
                                    <button className="nav-link text-light btn border-0 bg-transparent">
                                        Policy
                                    </button>
                                </li>

                                <li className="nav-item text-light">
                                    <button
                                        onClick={() => handleNavigation('/contact')}
                                        className="nav-link text-light btn border-0 bg-transparent"
                                    >
                                        Contact
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;