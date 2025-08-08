import React from "react";

interface ConnectItemProps {
    title: string;
    falink: string;
    className: string;
}

const ConnectItem: React.FC<ConnectItemProps> = ({ 
    title, 
    falink, 
    className 
}) => {
    return (
        <a href="#" className="text-white a-custom" title={title}>
            <div className={`rounded-circle d-flex justify-content-center align-items-center icon-custom ${className}`}>
                <i className={`fab fa-${falink}`}></i>
            </div>
        </a>
    );
}

export default ConnectItem;