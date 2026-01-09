import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { type Product } from "../../types/Product";
import { Link } from "react-router-dom";
import { customerService } from "../../services/CustomerService";
import { useAuth } from "../../context/AuthContext";

interface ProductGridProps {
    products: Product[];
    Title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, Title }) => {
    const { token } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    const sliderId = `slider_${crypto.randomUUID().replace(/-/g, "")}`;
    const sliderRef = useRef<HTMLDivElement>(null);

    const slug = (Title ?? "").toLowerCase().replace(/ /g, "-");
    const isHotSales = Title === "Hot Sales";
    const isRVProducts = Title === "Recently Viewed Products";

    const sectionClass = isHotSales
        ? "category-section my-xl-4 my-lg-4 my-2 bg-hot-sales"
        : "category-section my-xl-4 my-lg-4 my-md-1 my-sm-0 my-1";

    const hotSalesTitle = isHotSales
        ? "text-uppercase fw-bold mb-1 hot-sales-title-custom"
        : "text-uppercase fw-bold mb-1";

    const slideLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const slideRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    const fetchWishlist = async () => {
        if (!token) return;
        try {
            const res = await customerService.getWishlists<{ productId: number }>(token);
            if (res.success && res.data) {
                setWishlistIds(res.data.map((w) => w.productId));
            } else {
                setWishlistIds([]);
            }
        } catch {
            setWishlistIds([]);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    return (
        <div className={sectionClass}>
            <div className="row">
                <div className="col-6 d-flex align-items-center">
                    <h3 className={hotSalesTitle}>{Title}</h3>
                </div>
                {!isRVProducts && (
                    <div className="col-6 d-flex align-items-center justify-content-end p-1 pe-3">
                        <Link to={`/${slug}`} className="a-custom mb-0">
                            View All <i className="fa-solid fa-caret-right"></i>
                        </Link>
                    </div>
                )}

            </div>

            <div className="position-relative">
                {/* Left Arrow */}
                <button className="slider-btn slider-btn-left" onClick={slideLeft}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>

                {/* Right Arrow */}
                <button className="slider-btn slider-btn-right" onClick={slideRight}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>

                {/* Scrollable Slider */}
                <div
                    id={sliderId}
                    ref={sliderRef}
                    className="product-slider d-flex overflow-auto hide-scrollbar"
                >
                    {(products || []).slice(0, 10).map((product) => (
                        <div key={product.productId} className="slider-item flex-shrink-0">
                            <ProductCard
                                product={product}
                                wishlists={wishlistIds}
                                onWishlistChange={fetchWishlist}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;