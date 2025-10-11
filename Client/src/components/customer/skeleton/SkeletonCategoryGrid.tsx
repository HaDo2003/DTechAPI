import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCategoryGrid: React.FC = () => {
  return (
    <div className="container">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-center my-3">
        <h2><Skeleton width={200} height={30} /></h2>
      </div>

      {/* Brand Logos (optional section) */}
      <div className="container my-4">
        <div className="category-nav">
          <div className="row text-center">
            {[...Array(5)].map((_, i) => (
              <div className="col" key={i}>
                <div className="icon-container p-2">
                  <Skeleton circle height={60} width={60} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="d-flex flex-wrap gap-2 px-3 mb-4">
        <h4><Skeleton width={100} height={25} /></h4>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width={90} height={35} borderRadius={8} />
        ))}
      </div>

      {/* Product Grid */}
      <div className="position-relative">
        <div
          id="product-list"
          className="ps-lg-3 row row-cols-3 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-5 g-md-1 g-lg-0 g-xxl-2"
        >
          {[...Array(10)].map((_, i) => (
            <div className="col mb-3" key={i}>
              <div className="card h-100 border-0">
                <Skeleton height={180} />
                <div className="card-body p-2">
                  <Skeleton width="90%" height={18} />
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="40%" height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCategoryGrid;
