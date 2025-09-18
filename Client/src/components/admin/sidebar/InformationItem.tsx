import React from "react";
import { Link } from "react-router-dom";

interface InformationItemProps {
    to: string;
    label: string;
    isActive: boolean;
}

const InformationItem: React.FC<InformationItemProps> = ({
    to,
    label,
    isActive
}) => {
    const activeClass = (
        isActive: boolean,
        baseClass = "nav-link",
        activeClass = "active"
    ) => (isActive ? `${baseClass} ${activeClass}` : baseClass);

    const iconClass = (isActive: boolean) =>
        `nav-icon bi ${isActive ? "bi-record-circle" : "bi-circle"}`;

    return (
        <li className="nav-item">
            <Link to={to} className={activeClass(isActive)}>
                <i className={iconClass(isActive)} />
                <p>{label}</p>
            </Link>
        </li>
    );
};

export default InformationItem;