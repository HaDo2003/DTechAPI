import React from "react";

interface PaymentItemProps {
    src: string;
    alt: string;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ src, alt }) => {
    return (
        <div className="p-2 bg-white rounded shadow-sm payment-custom cursor-pointer">
            <img src={src} alt={alt} className='payment-img' />
        </div>
    );
};

export default PaymentItem;