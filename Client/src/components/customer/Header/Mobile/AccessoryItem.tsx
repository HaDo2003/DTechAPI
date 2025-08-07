import React from "react";

interface AccessoryItemProps {
    label: string;
    id?: string;
    subItems?: SubAccessoryItemProps[];
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    activeSubDropdown: string | null;
}

interface SubAccessoryItemProps {
    label: string;
    onClick: () => void;
}

const AccessoryItem: React.FC<AccessoryItemProps> = ({
    label,
    id,
    subItems = [],
    onClick,
    onMouseEnter,
    onMouseLeave,
    activeSubDropdown,
}) => {
    return (
        <li className="dropdown-submenu">
            <a
                onClick={onClick}
                id={id}
                className={`dropdown-item ${label.toLowerCase()}-custom`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {label}
            </a>
            {activeSubDropdown === label.toLowerCase() && (
                <ul
                    id={`${label.toLowerCase()}list1`}
                    className="dropdown-menu"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {subItems.map((subItem, idx) => (
                        <li key={subItem.label + idx}>
                            <a
                                onClick={subItem.onClick}
                                className="dropdown-item"
                                style={{ cursor: 'pointer' }}
                            >
                                {subItem.label}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default AccessoryItem;