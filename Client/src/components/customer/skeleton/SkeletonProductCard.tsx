import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="card h-100 product-card position-relative border-0">
      <div className="custom-container-img">
        <Skeleton height={180} />
      </div>

      <div className="card-body p-2">
        <p className="text-start small fw-semibold mb-1">
          <Skeleton width="90%" />
        </p>

        <div className="d-flex flex-column text-start">
          <Skeleton width="60%" height={15} />
          <Skeleton width="40%" height={18} />
        </div>

        <div className="mt-2">
          <Skeleton width="80%" height={14} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
