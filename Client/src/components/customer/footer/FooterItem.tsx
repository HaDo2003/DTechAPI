import React from "react";

interface FooterItemProps {
    label: string;
    onClick: () => void;
}

const FooterItem: React.FC<FooterItemProps> = ({ 
    label, 
    onClick 
}) => {
    return (
        <li className="mb-2">
            <a
                className="text-light text-decoration-none cursor-pointer"
                onClick={(e) => { e.preventDefault(); onClick; }}
            >
                {label}
            </a>
        </li>
    );
};

export default FooterItem;