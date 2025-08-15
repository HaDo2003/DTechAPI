import React from "react";

interface ProductInfoItemProps {
    label: string;
    value: string | number | boolean | null;
    sizexl: string
}

const ProductInfoItem: React.FC<ProductInfoItemProps> = ({ label, value, sizexl }) => {
    return (
        <div className={`col-6 ${sizexl}`}>
            <p className="product-information mb-0">
                {label}: {value}
            </p>
        </div>
    );
};

export default ProductInfoItem;