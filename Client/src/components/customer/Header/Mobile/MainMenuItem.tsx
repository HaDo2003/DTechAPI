import React from 'react';

interface MainMenuItemProps {
    label: string;
    onClick?: () => void;
}

const MainMenuItem: React.FC<MainMenuItemProps> = ({
    label,
    onClick
}) => {
    return (
        <li>
            <a
                className="nav-link text-light"
                href="#"
                style={{ cursor: 'pointer' }}
                onClick={onClick}
            >
                {label}
            </a>
        </li>
    );
};

export default MainMenuItem;