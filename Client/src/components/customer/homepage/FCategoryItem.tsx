import React from "react";
import { Link } from "react-router-dom";

interface FCategoryItemProps {
    label: string;
    iconlink: string;
    path: string;
}

const FCategory: React.FC<FCategoryItemProps> = ({
    label,
    iconlink,
    path
}) => {
    return (
        <div className="col-xl-2 col-lg-4 col-md-4 col-4">
            <Link to={path} className="category-item">
                <div className="icon-container">
                    <i className={`fa-solid fa-${iconlink}`}></i>
                </div>
                <div className="category-name">{label}</div>
            </Link>
        </div>
    );
};

export default FCategory;