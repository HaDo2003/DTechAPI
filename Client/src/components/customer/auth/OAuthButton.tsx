import React from "react";

interface OAuthButtonProps {
    btncolor: string;
    icon: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ btncolor, icon }) => {
    return (
        <button className={`flex-fill text-center border border-1 p-2 btn btn-${btncolor}`}>
            <i className={`fa-brands fa-${icon}`}></i> Google
        </button>
    );
};

export default OAuthButton;