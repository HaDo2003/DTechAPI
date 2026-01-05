import React, { useRef, useState } from 'react';
import DTechLogoSmall from '../../assets/DTechlogosmall.png';
import MainMenuItem from './head/mobile/MainMenuItem';
import AccessoryItem from './head/mobile/AccessoryItem';
import AccountItem from './head/AccountItem';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface MobileHeaderProps {
    searchQuery?: string;
    onSearch?: (query: string) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
    searchQuery = '',
    onSearch = () => { },
}) => {
    const { token, user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [isSearchHistoryVisible] = useState(false);
    const [searchHistory] = useState<string[]>([]);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
    const navigate = useNavigate();

    const onNavigate = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);

        // Uncheck the checkbox
        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
    };
    const handleOverlayClick = () => {
        setIsMenuOpen(false);

        // Uncheck the checkbox
        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
    };
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            onSearch(searchInput.trim());
        }
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    };

    const clearSearchHistory = () => {
        // Clear search history logic
    };

    const handleSubDropdownMouseEnter = (subDropdownName: string) => {
        setActiveSubDropdown(subDropdownName);
    };

    return (
        <>
            <input
                type="checkbox"
                id="check-small"
                ref={checkboxRef}
            />

            <div className="header clearfix bg-main">
                <div className="container-fluid py-2">
                    <div className="row align-items-center">
                        <div className="col-1">
                            <label htmlFor="check-small">
                                <i className="fas fa-bars" onClick={() => setIsMenuOpen(true)} id="btnsmall"></i>
                                <i className="fas fa-times" onClick={() => setIsMenuOpen(false)} id="cancelsmall"></i>
                            </label>
                        </div>

                        <div className="col-3 mx-auto padding-logo">
                            <a onClick={() => onNavigate('/')} className='cursor-pointer'>
                                <img src={DTechLogoSmall} alt="DTech Logo" className="img-logo-small" />
                            </a>
                        </div>

                        <div id="searchHistory" className={`search-history ${isSearchHistoryVisible ? '' : 'd-none'}`}>
                            <div className="search-history-header">
                                <span className="text-muted small">Recent Searches</span>
                                <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={clearSearchHistory}>
                                    <i className="fa-solid fa-trash fa-xs"></i> Clear
                                </button>
                            </div>
                            <div id="historyList" className="search-history-list">
                                {searchHistory.map((item, index) => (
                                    <div key={index} className="search-history-item">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-8 d-flex justify-content-end">
                            <ul className="nav justify-content-start">
                                <li className="nav-item me-2 mt-2">
                                    <a
                                        onClick={() => onNavigate('/cart')}
                                        className="nav-link active d-flex align-items-center text-light text-decoration-none cursor-pointer"
                                    >
                                        <div className="position-relative me-2">
                                            <i className="fas fa-shopping-cart"></i>
                                            {cartItemCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-light">
                                            <p className="mb-0 fontsize">Shopping Cart</p>
                                        </div>
                                    </a>
                                </li>

                                <li className="nav-item dropdown mt-2">
                                    <a
                                        className="nav-link dropdown-toggle active d-flex align-items-center text-light text-decoration-none"
                                        data-bs-toggle="dropdown"
                                        href="#"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        <div className="me-1">
                                            <i className="fa-solid fa-user fa-xl"></i>
                                        </div>
                                        <div className="text-light">
                                            <p className="mb-0 fontsize">Account</p>
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu">
                                        {token ? (
                                            <>
                                                {(user?.roles === "Admin" || user?.roles === "Seller") && (
                                                    <AccountItem label='Admin Panel' onClick={() => onNavigate('/admin')} />
                                                )}
                                                <AccountItem label='Profile' onClick={() => onNavigate('/profile')} />
                                                <AccountItem label='Logout' onClick={logout} />
                                            </>
                                        ) : (
                                            <>
                                                <AccountItem label='Login' onClick={() => onNavigate('/login')} />
                                                <AccountItem label='Register' onClick={() => onNavigate('/register')} />
                                            </>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="row my-2">
                            <div className="col-12 search-box">
                                <div onSubmit={handleSearch}>
                                    <div className="input-group form-container">
                                        <input
                                            type="text"
                                            name="query"
                                            id="searchInput"
                                            className="form-control search-input"
                                            placeholder="Search"
                                            autoComplete="off"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                        />
                                        <span className="input-group-btn">
                                            <button className="btn btn-search" type="button" onClick={handleSearch}>
                                                <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`mainmenu clearfix bg-main ${isMenuOpen ? 'd-block' : 'd-none'}`}>
                <div className="sidebar-small">
                    <header>
                        <a onClick={() => onNavigate('/')} className="nav-link active text-light cursor-pointer" aria-current="page">
                            Home
                        </a>
                    </header>

                    <ul className="list-unstyled">
                        <MainMenuItem label="All Products" onClick={() => onNavigate('/all-products')} />
                        <MainMenuItem label="Laptop" onClick={() => onNavigate('/laptop')} />
                        <MainMenuItem label="Smart Phone" onClick={() => onNavigate('/smart-phone')} />
                        <MainMenuItem label="Tablet" onClick={() => onNavigate('/tablet')} />
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle text-light"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                onClick={() => onNavigate('/accessory')}>
                                Accessory
                            </a>
                            <ul className="dropdown-menu">
                                <AccessoryItem
                                    label="Mouse"
                                    id="mouse1"
                                    onClick={() => onNavigate('/mouse')}
                                    onMouseEnter={() => handleSubDropdownMouseEnter('mouse')}
                                    onMouseLeave={() => setActiveSubDropdown(null)}
                                    activeSubDropdown={activeSubDropdown}
                                    subItems={[
                                        { label: 'Wired Mouse', onClick: () => onNavigate('/wired-mouse') },
                                        { label: 'Wireless Mouse', onClick: () => onNavigate('/wireless-mouse') }
                                    ]}
                                />
                                <AccessoryItem
                                    label="Keyboard"
                                    id="keyboard1"
                                    onClick={() => onNavigate('/category/keyboard')}
                                    onMouseEnter={() => handleSubDropdownMouseEnter('keyboard')}
                                    onMouseLeave={() => setActiveSubDropdown(null)}
                                    activeSubDropdown={activeSubDropdown}
                                    subItems={[
                                        { label: 'Wired Keyboard', onClick: () => onNavigate('/wired-keyboard') },
                                        { label: 'Wireless Keyboard', onClick: () => onNavigate('/wireless-keyboard') }
                                    ]}
                                />
                                <AccessoryItem
                                    label="Headphone"
                                    id="headphone1"
                                    onClick={() => onNavigate('/headphone')}
                                    onMouseEnter={() => handleSubDropdownMouseEnter('headphone')}
                                    onMouseLeave={() => setActiveSubDropdown(null)}
                                    activeSubDropdown={activeSubDropdown}
                                    subItems={[
                                        { label: 'Wired Headphone', onClick: () => onNavigate('/wired-headphone') },
                                        { label: 'Wireless Headphone', onClick: () => onNavigate('/wireless-headphone') }
                                    ]}
                                />
                            </ul>
                        </li>
                        <MainMenuItem label="Policy" onClick={() => onNavigate('/')} />
                        <MainMenuItem label="Contact" onClick={() => onNavigate('/contact')} />
                    </ul>
                </div>
            </div>

            <div
                className={`overlay1 ${isMenuOpen ? 'd-block' : 'd-none'}`}
                onClick={handleOverlayClick}
            ></div>
        </>
    );
};

export default MobileHeader;