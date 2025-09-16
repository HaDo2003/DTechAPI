import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/ProductService";
import { type Product } from "../../types/Product";
import { priceFormatter } from "../../utils/priceFormatter";
import DOMPurify from "dompurify";
import NotFound from "./NotFound";

// Components
import ProductGrid from "../../components/customer/ProductGrid";
import SpecificationsWindow from "../../components/customer/productDetail/SpecificationsWindow";
import ProductCommentForm from "../../components/customer/productDetail/ProductCommentForm";
import ProductInfoItem from "../../components/customer/productDetail/ProductInfoItem";
import Loading from "../../components/shared/Loading";
import AlertForm from "../../components/customer/AlertForm";

// Service
import { cartService } from "../../services/CartService";

import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import type { ProductCommentRequest, ProductCommentResponse } from "../../types/ProductComment";
import { useAuth } from "../../context/AuthContext";
import { checkOutService } from "../../services/CheckOutService";

const ProductDetail: React.FC = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { categorySlug, brandSlug, slug } = useParams<{ categorySlug: string; brandSlug: string; slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // State
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState<string>("");
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentList, setCommentList] = useState<ProductCommentResponse[]>(product?.productComments ?? [])
    const [isSpecOpen, setIsSpecOpen] = useState(false);
    const RVData = useRecentlyViewed();

    useEffect(() => {
        document.title = "DTech - Product Detail";
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductData(categorySlug!, brandSlug!, slug!);
                setProduct(data);
                setMainImage(data.photo ?? "");
                setCommentList(data.productComments ?? []);
            } catch (error) {
                console.error("Failed to fetch product data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [categorySlug, brandSlug, slug]);

    if (!product) {
        return <NotFound />;
    }
    // Price calculations
    const savePrice = product.price - product.priceAfterDiscount;
    const discountPercent = product.discount?.toFixed(0);
    const formattedPriceAfterDiscount = priceFormatter(product.priceAfterDiscount);
    const formattedOriginalPrice = priceFormatter(product.price);
    const formattedSavePrice = priceFormatter(savePrice);
    let statusText;
    if (product.statusProduct) {
        statusText = "In Stock";
    } else {
        statusText = "Out of Stock";
    }

    // Description preview
    const preview = product.description?.length > 150
        ? product.description.substring(0, 1000) + "..."
        : product.description;

    // Comment calculations
    const ratedComments = product.productComments.filter(c => c.rate !== null);
    const totalRatings = ratedComments.length;
    const average = totalRatings > 0
        ? ratedComments.reduce((sum, c) => sum + (c.rate || 0), 0) / totalRatings
        : 0;

    const starCounts = Array.from({ length: 5 }, (_, i) => ({
        Star: 5 - i,
        Count: ratedComments.filter(c => c.rate === (5 - i)).length
    }));

    // Event handlers
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
                navigate("/check-out", {state: res});
            } else {
                setAlert({ message: res.message || "Buy now failed!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Buy now failed, please try again.", type: "error" });
        }
    };
    
    const handleImageClick = (imageSrc: string) => setMainImage(imageSrc);
    const handleToggleDescription = () => setShowFullDescription(!showFullDescription);
    const handleRateNow = () => setShowCommentForm(!showCommentForm);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={i < Math.round(rating) ? "star-filled" : "star-empty"}
            >
                ★
            </span>
        ));
    };

    const renderCommentStars = (rating: number | null) => {
        if (!rating) return null;
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'fa fa-star text-warning' : 'fa fa-star text-secondary'}></span>
        ));
    };

    const handleSubmit = async (data: ProductCommentRequest) => {
        try {
            const res = await productService.postComment(data);
            if (res.success) {
                setAlert({ message: res.message || "Post Comment Successful!", type: "success" });
                setCommentList(prev => [
                    ...prev,
                    { ...data, commentId: res.commentId },
                ]);
            } else {
                setAlert({ message: res.message || "Post Comment Fail!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "An error occurred during post comment", type: "error" });
        }
    }

    return (
        <>
            <div className="container">
                <div className="row g-4 align-items-start">
                    {/* LEFT: Product Image */}
                    <div className="col-12 col-lg-5 d-flex flex-column justify-content-center position-relative">
                        {product.discount > 0 && (
                            <div className="position-absolute end-0 top-0 mx-3 my-2">
                                <span className="badge bg-danger rounded-pill fs-5 px-3 py-2">-{discountPercent}%</span>
                            </div>
                        )}
                        <div className="border rounded shadow-sm p-2 mb-2 bg-white d-flex justify-content-center align-items-center main-div-img-size">
                            <img
                                id="mainProductImage"
                                src={mainImage}
                                className="img-fluid rounded main-img"
                                alt={product.name}
                            />
                        </div>

                        {product.productImages && product.productImages.length > 0 && (
                            <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                                <div className="border rounded p-1 sub-div-img">
                                    <img
                                        src={product.photo}
                                        alt={product.name}
                                        className="rounded thumbnail-img cursor-pointer"
                                        onClick={() => handleImageClick(product.photo)}
                                    />
                                </div>
                                {product.productImages.map((image) => (
                                    <div key={image.imageId} className="border rounded p-1 sub-div-img">
                                        <img
                                            src={image.image}
                                            alt={`Image ${image.imageId}`}
                                            className="rounded thumbnail-img cursor-pointer"
                                            onClick={() => handleImageClick(image.image)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="col-12 col-lg-7">
                        <h3>{product.name}</h3>

                        {/* Product Info Row */}
                        <div className="row gy-2 gx-3 text-start">
                            <ProductInfoItem label="Comment" value={product.productComments.length} sizexl="col-xl-2" />
                            <ProductInfoItem label="Views" value={product.views} sizexl="col-xl-2" />
                            <ProductInfoItem label="Warranty" value={`${product.warranty} months`} sizexl="col-xl-3" />
                            <ProductInfoItem label="Status" value={statusText} sizexl="col-xl-3" />
                            <ProductInfoItem label="Date of Manufacture" value={product.dateOfManufacture} sizexl="col-xl-5" />
                            <ProductInfoItem label="Made In" value={product.madeIn} sizexl="col-xl-4" />
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

                        {/* Promotion */}
                        {product.promotionalGift && (
                            <div className="card promotion-card mt-4">
                                <div className="card-header bg-danger text-white">
                                    <h2 className="mb-0">
                                        <i className="fas fa-gift me-2"></i>
                                        Promotion
                                    </h2>
                                </div>
                                <div className="card-body bg-light">
                                    <div dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(product.promotionalGift)
                                    }}
                                    />
                                </div>
                            </div>
                        )}

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

            {/* Related Products */}
            {product?.relatedProducts?.length > 0 && (
                <div className="related-products">
                    <ProductGrid products={product.relatedProducts} Title="Related Products" />
                </div>
            )}

            <div className="container mt-3">
                <div className="box-product-information">
                    <div className="row">
                        {/* LEFT COLUMN */}
                        <div className="col-lg-7 d-flex flex-column">
                            {/* DESCRIPTION */}
                            <div className="card rounded-3 order-1">
                                <div className="card-header">
                                    <h4 className="mb-0">Introducing {product.name}</h4>
                                </div>
                                <div className="card-body">
                                    <div
                                        className={`description-container ${showFullDescription ? "expanded" : ""}`}
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    showFullDescription ? product.description : preview
                                                )
                                            }}
                                        />
                                    </div>

                                    {product.description && product.description.length > 150 && (
                                        <div className="mt-3 d-flex justify-content-center">
                                            <button
                                                className="btn btn-outline-primary rounded-3 d-flex align-items-center justify-content-center"
                                                type="button"
                                                onClick={handleToggleDescription}
                                            >
                                                <span>{showFullDescription ? "See Less" : "See More"}</span>
                                                <span className="ms-1">
                                                    {showFullDescription ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-chevron-up"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-chevron-down"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PRODUCT COMMENT */}
                            <div className="card mt-4 rounded-3 order-3 order-lg-2">
                                <div className="card-header">
                                    <h4 className="mb-0">Product Comment</h4>
                                </div>
                                <div className="card-body">
                                    {/* Comment content */}
                                    <div className="row border rounded-3 p-3 rate-border-size">
                                        {/* Average & Total */}
                                        <div className="col-md-4 text-center align-content-center">
                                            <h2>{Math.round(average * 10) / 10}/5</h2>
                                            <div>
                                                {renderStars(average)}
                                            </div>
                                            <p className="mt-2">{totalRatings} comments</p>
                                        </div>

                                        {/* Breakdown */}
                                        <div className="col-md-8">
                                            {starCounts.map((star) => {
                                                const percentage = totalRatings > 0 ? (star.Count * 100 / totalRatings) : 0;
                                                const barColor = star.Star === 5 ? "bg-danger" : "bg-secondary";
                                                return (
                                                    <div key={star.Star} className="d-flex align-items-center mb-2">
                                                        <div className="w-30-star">{star.Star}
                                                            <span className="star-filled">★</span>
                                                        </div>
                                                        <div className="progress flex-grow-1 mx-2 h-8-progress">
                                                            <div
                                                                className={`progress-bar ${barColor}`}
                                                                role="progressbar"
                                                                style={{ width: `${percentage}%` }}
                                                                aria-valuenow={percentage}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            ></div>
                                                        </div>
                                                        <div className="w-60-star">{star.Count} rate</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center flex-column">
                                        <p className="mt-3 d-flex justify-content-center">
                                            How do you rate this product?
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-outline-primary rounded-3 d-flex align-items-center justify-content-center"
                                                onClick={handleRateNow}
                                            >
                                                Rate Now
                                            </button>
                                        </div>
                                    </div>


                                    <div className={`comment-fade ${showCommentForm ? 'show' : 'hide'}`}>
                                        <ProductCommentForm
                                            productId={product.productId}
                                            name={user?.name}
                                            email={user?.email}
                                            onSubmit={async (data: ProductCommentRequest) => {
                                                console.log("Comment submitted:", data);
                                                await handleSubmit(data);
                                                setShowCommentForm(false);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        {commentList.map((cmt, index) => (
                                            <div key={index} className="mb-2">
                                                <div className="row">
                                                    <div className="col-md-6 text-start">
                                                        {cmt.name}
                                                    </div>
                                                    <div className="col-md-6 text-end">
                                                        {cmt.cmtDate
                                                            ? new Date(cmt.cmtDate).toLocaleDateString("en-GB")
                                                            : "No date"}                                                    </div>
                                                </div>
                                                <div className="cmt-custom px-3 py-2 mb-3">
                                                    <div className="row">
                                                        <div className="col-md-2">
                                                            <label className="fw-bold">Rate: </label>
                                                        </div>
                                                        <div className="col-md-9 d-flex align-items-center mb-2">
                                                            {cmt.rate && (
                                                                <div>
                                                                    {renderCommentStars(cmt.rate)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-2">
                                                            <label className="fw-bold">Comment:</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <p className="mb-1">{cmt.detail}</p>
                                                        </div>
                                                        <div className="col-md-2 text-end reply">
                                                            <i className="fa fa-comments"></i>
                                                            Reply
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="col-lg-5 order-2 order-lg-3 mt-4 mt-lg-0">
                            <div className="card rounded-3">
                                <div className="card-header">
                                    <h4 className="mb-0">Specification</h4>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped mb-0">
                                        <tbody>
                                            {product.specifications.length > 0 ? (
                                                product.specifications.slice(0, 5).map((spec, index) => (
                                                    <tr key={index} className="specification-item d-flex text-start row">
                                                        <th className="col-3">{spec.specName}</th>
                                                        <td className="col-9">{spec.detail}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={2}>No specifications available.</td></tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {product.specifications.length > 5 && (
                                        <div className="mt-3 d-flex justify-content-center">
                                            <button
                                                className="btn btn-outline-primary rounded-3 d-flex align-items-center justify-content-center"
                                                onClick={() => setIsSpecOpen(true)}
                                            >
                                                View full specifications
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Viewed Products */}
            {RVData.length > 0 && (
                <div className="recently-view-products">
                    <ProductGrid products={RVData} Title="Recently Viewed Products" />
                </div>
            )}

            {/* Overlay Component */}
            <SpecificationsWindow
                specifications={product.specifications}
                isOpen={isSpecOpen}
                onClose={() => setIsSpecOpen(false)}
            />

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <Loading />
                </div>
            )}
        </>
    );
};


export default ProductDetail;