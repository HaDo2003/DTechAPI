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
                className="dropdown-item btn border-0 bg-transparent text-start"
                style={{ cursor: 'pointer' }}
            >
                {label}
            </button>
        </li>
    );
};

export default AccountItem;