import React from "react";
import { useNavigate } from 'react-router-dom';

interface DropDownItemProps {
    label: string;
    path?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    subItems: SubDropDownItemProps[];
    activeSubDropdown: string | null;
}

interface SubDropDownItemProps {
    label: string;
    path: string;
}

const DropDownItem: React.FC<DropDownItemProps> = ({
    label,
    path,
    onClick,
    onMouseEnter,
    subItems,
    activeSubDropdown,
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
        <li className="dropdown-item-container">
            <button
                onClick={handleClick}
                className="dropdown-item btn border-0 bg-transparent text-start w-100"
                onMouseEnter={onMouseEnter}
            >
                {label}
            </button>

            {activeSubDropdown === label.toLowerCase() && (
                <ul className="dropdown-menu show position-absolute" style={{ left: '100%', top: 0 }}>
                    {subItems.map((subItem, idx) => (
                        <li key={subItem.label + idx}>
                            <button
                                onClick={() => navigate(subItem.path)}
                                className="dropdown-item btn border-0 bg-transparent text-start"
                            >
                                {subItem.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default DropDownItem;