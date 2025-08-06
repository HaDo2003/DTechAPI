import React, { useState, useEffect, useRef } from 'react';
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
const SmallHeader: React.FC<HeaderProps> = (props) => {
    return (
        <div className="header-small">
            
        </div>
    );
};

export default SmallHeader;