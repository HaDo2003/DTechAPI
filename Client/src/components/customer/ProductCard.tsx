import React from "react";
import { priceFormatter } from "../../utils/priceFormatter";
import { type Product } from "../../types/Product";
import DOMPurify from "../../utils/santitizeConfig";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const formattedFinalPrice = priceFormatter(product.finalPrice);
    const formattedOriginalPrice = priceFormatter(product.price);
    const discountPercent = product.discount?.toFixed(1).replace(/\.0$/, "");
    const categorySlug = product.category.slug;
    const brandSlug = product.brand.slug;

    return (
        <div className="card h-100 product-card position-relative border-0">
            {product.discount > 0 && (
                <div className="position-absolute end-0 top-0 m-2">
                    <span className="badge bg-danger rounded-pill">
                        -{discountPercent}%
                    </span>
                </div>
            )}

            <a
                href={`/product/${categorySlug}/${brandSlug}/${product.slug}`}
                className="text-decoration-none"
            >
                <div className="custom-container-img">
                    <img
                        src={product.photo}
                        className="card-img-top p-1 w-100 mx-auto d-block"
                        alt={product.name}
                    />
                </div>

                <div className="card-body p-2">
                    <p className="text-start small fw-semibold mb-1 text-dark">
                        {product.name.length > 40
                            ? product.name.substring(0, 40) + "..."
                            : product.name}
                    </p>

                    <div className="d-flex flex-column text-start">
                        {product.discount > 0 ? (
                            <>
                                <p className="mb-0">
                                    <del className="text-muted small">
                                        {formattedOriginalPrice}
                                    </del>
                                </p>
                                <p className="text-danger fw-bold mb-1">
                                    {formattedFinalPrice}
                                </p>
                            </>
                        ) : (
                            <>
                                <br />
                                <p className="text-dark fw-bold mb-1">
                                    {formattedOriginalPrice}
                                </p>
                            </>
                        )}
                    </div>

                    {product.promotionalGift && (
                        <div
                            className="custom-text"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    product.promotionalGift.length > 50
                                        ? product.promotionalGift.substring(0, 50) + "..."
                                        : product.promotionalGift
                                ),
                            }}
                        />
                    )}
                </div>
            </a>
        </div>
    );
};

export default ProductCard;