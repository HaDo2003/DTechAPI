import React from "react";
import { Link } from 'react-router-dom';

interface MenuItemProps {
    label: string;
    path: string;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    label,
    path,
    onClick,
}) => {
    return (
        <li className="nav-item">
            <Link
                to={path}
                className="nav-link text-light"
                onClick={onClick}
            >
                {label}
            </Link>
        </li>
    );
};


export default MenuItem;