import React, { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import { priceFormatter } from "../../utils/priceFormatter";
import InnerImageZoom from 'react-inner-image-zoom';
import ProductInfoItem from "./productDetail/ProductInfoItem";
import { useAuth } from "../../context/AuthContext";
import AlertForm from "./AlertForm";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../shared/Loading";
import { cartService } from "../../services/CartService";
import { checkOutService } from "../../services/CheckOutService";
import { useCart } from "../../context/CartContext";

interface ProductPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ product, isOpen, onClose }) => {
    const { token } = useAuth();
    const { fetchCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const savePrice = product.price - product.priceAfterDiscount;
    const formattedPriceAfterDiscount = priceFormatter(product.priceAfterDiscount);
    const formattedOriginalPrice = priceFormatter(product.price);
    const formattedSavePrice = priceFormatter(savePrice);
    const [mainImage, setMainImage] = useState<string>("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const discountPercent =
        product.discount && product.discount > 0
            ? Math.round(product.discount)
            : 0;

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                setMainImage(product.photo);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [product]);

    const handleQuantityIncrease = () => setQuantity(prev => prev + 1);
    const handleQuantityDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const handleAddToCart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token === null) {
            setAlert({ message: "Please login to add to cart", type: "error" });
            setTimeout(() => {
                navigate("/login");
            }, 5000);
            return;
        }

        try {
            const res = await cartService.addToCart(token, {
                productId: product.productId,
                quantity: quantity
            });
            if (res.success) {
                setAlert({ message: res.message || "Added to cart!", type: "success" });
                setQuantity(1);
                await fetchCart();
            } else {
                setAlert({ message: res.message || "Add to cart failed!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Add to cart failed, please try again.", type: "error" });
        }
    };

    const handleBuyNow = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token === null) {
            setAlert({ message: "Please login to add to cart", type: "error" });
            setTimeout(() => {
                navigate("/login");
            }, 5000);
            return;
        }
        try {
            setLoading(true);
            const res = await checkOutService.buyNow(token, product.productId, quantity);
            if (res.success) {
                setLoading(false);
                setQuantity(1);
                navigate("/check-out", { state: res });
            } else {
                setAlert({ message: res.message || "Buy now failed!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Buy now failed, please try again.", type: "error" });
        }
    };
    return (
        <>
            {isOpen && (
                <div
                    className={`overlay-preview d-flex align-items-center justify-content-center`}
                    onClick={onClose}
                >
                    <div
                        className="overlay-preview-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-circle fw-bold close-btn position-absolute top-0 end-0 m-1"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            X
                        </button>

                        <div className="row g-4 align-items-start">
                            {/* LEFT: Product Image */}
                            <div className="col-12 col-lg-5 d-flex flex-column justify-content-center position-relative">
                                {product.discount > 0 && (
                                    <div className="position-absolute end-0 top-0 mx-3 my-1">
                                        <span className="badge bg-danger rounded-pill py-1">
                                            -{discountPercent}%
                                        </span>
                                    </div>
                                )}
                                <div className="border rounded shadow-sm p-2 mb-2 bg-white d-flex justify-content-center align-items-center main-div-img-size">
                                    <InnerImageZoom
                                        src={mainImage}
                                        zoomSrc={mainImage}
                                        zoomType="hover"
                                        zoomScale={1.8}
                                        className="main-img rounded"
                                        hideHint={true}
                                        hasSpacer={true}
                                    />
                                </div>
                            </div>

                            {/* RIGHT: Product Details */}
                            <div className="col-12 col-lg-7">
                                <Link
                                    to={`/${product.category.slug}/${product.brand.slug}/${product.slug}`}
                                    className="text-decoration-none text-dark"
                                >
                                    <h3>{product.name}</h3>
                                </Link>


                                {/* Product Info Row */}
                                <div className="row gy-2 gx-3 text-start">
                                    <ProductInfoItem
                                        label="Views"
                                        value={product.views ?? 0}
                                        sizexl="col-xl-4"
                                    />
                                    <ProductInfoItem
                                        label="Warranty"
                                        value={`${product.warranty ?? 0} months`}
                                        sizexl="col-xl-8"
                                    />
                                    <ProductInfoItem
                                        label="Status"
                                        value={product.statusProduct ? "In Stock" : "Out of Stock"}
                                        sizexl="col-xl-4"
                                    />
                                    <ProductInfoItem
                                        label="Date of Manufacture"
                                        value={product.dateOfManufacture ?? "N/A"}
                                        sizexl="col-xl-8"
                                    />
                                    <ProductInfoItem
                                        label="Made In"
                                        value={product.madeIn ?? "N/A"}
                                        sizexl="col-xl-4"
                                    />
                                </div>

                                {/* Price */}
                                <div className="bg-light border rounded px-4 py-3 d-flex flex-wrap align-items-center gap-4 mt-3">
                                    {product.discount > 0 ? (
                                        <>
                                            <p className="text-danger fw-bold mb-0 product-price1 fs-4">
                                                {formattedPriceAfterDiscount}
                                            </p>
                                            <p className="text-muted text-decoration-line-through mb-0 product-price2">
                                                {formattedOriginalPrice}
                                            </p>
                                            <p className="text-danger mb-0 product-price2">
                                                Save {formattedSavePrice}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-dark fw-bold fs-2 mb-0 product-price1">
                                            {formattedOriginalPrice}
                                        </p>
                                    )}
                                </div>

                                <div className="product-purchase-area">
                                    <div className="quantity-section">
                                        <label htmlFor="quantity" className="quantity-label">Quantity:</label>
                                        <div className="quantity-control">
                                            <button type="button" className="btn-quantity-adjust" onClick={handleQuantityDecrease}>−</button>
                                            <input
                                                type="text"
                                                className="quantity-input"
                                                id="quantity"
                                                name="quantity"
                                                value={quantity}
                                                readOnly
                                            />
                                            <button type="button" className="btn-quantity-adjust" onClick={handleQuantityIncrease}>+</button>
                                        </div>

                                        <button type="button" className="btn-add-to-cart" onClick={handleAddToCart}>
                                            <i className="fas fa-shopping-cart"></i> Add to Cart
                                        </button>

                                        <button type="button" className="btn-wishlist" onClick={() =>
                                            setAlert({ message: "Added to wishlist!", type: "success" })
                                        }>
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>

                                    <div className="buy-now-section">
                                        <button type="button" className="btn-buy-now" onClick={handleBuyNow}>
                                            BUY NOW
                                            <br />
                                            <span className="delivery-note">
                                                Fast Delivery
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            {loading && <Loading />}
        </>
    );
};

export default ProductPreview;