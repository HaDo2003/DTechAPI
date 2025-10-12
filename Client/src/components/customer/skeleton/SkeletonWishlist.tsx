import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonProductCard from "./SkeletonProductCard";

const SkeletonWishlist: React.FC = () => {
    return (
        <div className="container my-5">
            {/* Title */}
            <div className="d-flex align-items-center justify-content-center my-3">
                <h2><Skeleton width={220} height={32} /></h2>
            </div>

            {/* Wishlist Product Grid */}
            <div className="position-relative">
                <div
                    className="ps-lg-3 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
                >
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="slider-item flex-shrink-0 me-2">
                            <SkeletonProductCard />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonWishlist;
