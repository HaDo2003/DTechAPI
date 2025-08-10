import React, { useRef } from "react";
import ProductCard from "./ProductCard";
import { type Product } from "../../types/Product";

interface ProductGridProps {
    products: Product[];
    Title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, Title }) => {

    const sliderId = `slider_${crypto.randomUUID().replace(/-/g, "")}`;
    const sliderRef = useRef<HTMLDivElement>(null);

    const slug = (Title ?? "").toLowerCase().replace(/ /g, "-");
    const isHotSales = Title === "Hot Sales";

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

    return (
        <div className={sectionClass}>
        <div className="row">
            <div className="col-6 d-flex align-items-center">
            <h3 className={hotSalesTitle}>{Title}</h3>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-end p-1 pe-3">
            <a href={`/product/category/${slug}`} className="a-custom mb-0">
                View All <i className="fa-solid fa-caret-right"></i>
            </a>
            </div>
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
            {products.slice(0, 10).map((product) => (
                <div key={product.id} className="slider-item flex-shrink-0">
                <ProductCard product={product} />
                </div>
            ))}
            </div>
        </div>
        </div>
    );
};

export default ProductGrid;