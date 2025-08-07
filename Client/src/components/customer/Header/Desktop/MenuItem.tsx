import React from "react";
import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
    label: string;
    path?: string;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    label,
    path,
    onClick,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
    };
    return (
        <li className="nav-item text-light">
            <button
                onClick={handleClick}
                className={`nav-link text-light btn border-0 bg-transparent`}
            >
                {label}
            </button>
        </li>
    );
};

export default MenuItem;