import React from "react";
import SkeletonProductCard from "./SkeletonProductCard";
import Skeleton from "react-loading-skeleton";

const SkeletonProductGrid: React.FC = () => {
  return (
    <div className="category-section my-xl-4 my-lg-4 my-2">
      <div className="row">
        <div className="col-6 d-flex align-items-center">
          <h3 className="text-uppercase fw-bold mb-1">
            <Skeleton width={120} />
          </h3>
        </div>
      </div>

      <div className="position-relative">
        <div className="product-slider d-flex overflow-auto hide-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="slider-item flex-shrink-0 me-2">
              <SkeletonProductCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductGrid;
