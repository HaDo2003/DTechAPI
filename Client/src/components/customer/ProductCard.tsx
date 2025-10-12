import React, { useEffect, useState } from "react";
import { priceFormatter } from "../../utils/priceFormatter";
import { type Product } from "../../types/Product";
import DOMPurify from "../../utils/santitizeConfig";
import { Link, useNavigate } from "react-router-dom";
import { addToRecentlyViewed } from "../../utils/recentlyViewed";
import ProductPreview from "./ProductPreview";
import { useAuth } from "../../context/AuthContext";
import { customerService } from "../../services/CustomerService";
import AlertForm from "./AlertForm";

interface ProductCardProps {
    product: Product;
    wishlists: number[];
    onWishlistChange: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, wishlists, onWishlistChange }) => {
    const { token } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isPreviewOpen, setPreviewOpen] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const navigate = useNavigate();
    const formattedFinalPrice = priceFormatter(product.priceAfterDiscount);
    const formattedOriginalPrice = priceFormatter(product.price);
    const discountPercent =
        product.discount && product.discount > 0
            ? Math.round(product.discount)
            : 0;
    const categorySlug = product.category.slug;
    const brandSlug = product.brand.slug;

    useEffect(() => {
        setIsWishlisted(wishlists.includes(product.productId));
    }, [wishlists, product.productId]);

    const handleView = () => {
        addToRecentlyViewed(product.productId);
    };

    const toggleWishlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token === null) {
            setAlert({ message: "Please login to add to cart", type: "error" });
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        if (isWishlisted) {
            try {
                const res = await customerService.removeWishlist(token, product.productId);
                if (res.success) {
                    setIsWishlisted(false);
                    onWishlistChange();
                    setAlert({ message: res.message || "Removed wishlist!", type: "success" });
                } else {
                    setAlert({ message: res.message || "Removed wishlist failed!", type: "error" });
                }
            } catch (err) {
                setAlert({ message: "Removed wishlist failed, please try again.", type: "error" });
            }
        } else {
            try {
                const res = await customerService.addWishlist(token, product.productId);
                if (res.success) {
                    setIsWishlisted(true);
                    onWishlistChange();
                    setAlert({ message: res.message || "Added to wishlist!", type: "success" });
                } else {
                    setAlert({ message: res.message || "Add to wishlist failed!", type: "error" });
                }
            } catch (err) {
                setAlert({ message: "Add to wishlist failed, please try again.", type: "error" });
            }
        }
    };

    return (
        <>
            <div
                className="card h-100 product-card position-relative border-0"
                onClick={handleView}
            >
                {product.discount > 0 && (
                    <div className="position-absolute end-0 top-0 m-2">
                        <span className="badge bg-danger rounded-pill py-1">
                            -{discountPercent}%
                        </span>
                    </div>
                )}

                <Link
                    to={`/${categorySlug}/${brandSlug}/${product.slug}`}
                    className="text-decoration-none"
                >
                    <div className="custom-container-img">
                        <img
                            src={product.photo}
                            className="card-img-top p-1 w-100 mx-auto d-block"
                            alt={product.name}
                        />
                    </div>

                    <div className="overlay-buttons d-flex flex-column gap-2">
                        <button
                            className="btn-preview"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPreviewOpen(true);
                            }}
                        >
                            <i className="fas fa-eye"></i>
                        </button>

                        <button
                            className={`btn-wishlist-card
                                ${isWishlisted ? "btn-wishlist-card-red" : "btn-wishlist-card-white"}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(e);
                            }}
                        >
                            <i className="fas fa-heart"></i>
                        </button>
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
                </Link>
            </div>
            <ProductPreview
                isOpen={isPreviewOpen}
                onClose={() => setPreviewOpen(false)}
                product={product}
            />
            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>
    );
};

export default ProductCard;