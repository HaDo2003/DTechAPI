import React from "react";

interface AccountItemProps {
    label: string;
    onClick?: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ label, onClick }) => {
    return (
        <li>
            <button
                onClick={onClick}
                className="dropdown-item btn border-0 bg-transparent text-start cursor-pointer"
                style={{ borderBottom: 'none', boxShadow: 'none' }}
            >
                {label}
            </button>
        </li>
    );
};

export default AccountItem;