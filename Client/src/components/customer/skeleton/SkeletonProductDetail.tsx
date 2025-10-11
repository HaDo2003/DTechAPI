import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonProductDetail: React.FC = () => {
  return (
    <div className="container">
      <div className="row g-4 align-items-start">
        {/* LEFT SIDE: Image Skeleton */}
        <div className="col-12 col-lg-5 d-flex flex-column justify-content-center">
          <Skeleton height={400} borderRadius={10} />
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} width={80} height={80} borderRadius={10} />
              ))}
          </div>
        </div>

        {/* RIGHT SIDE: Info Skeleton */}
        <div className="col-12 col-lg-7">
          <Skeleton height={35} width="70%" />
          <div className="mt-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={20} width={`${80 - i * 10}%`} className="mb-2" />
              ))}
          </div>

          <div className="mt-4">
            <Skeleton height={40} width="50%" />
            <Skeleton height={20} width="30%" />
          </div>

          <div className="mt-5">
            <Skeleton height={150} borderRadius={10} />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-5">
        <Skeleton height={30} width="30%" />
        <div className="d-flex gap-3 mt-3 flex-wrap">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-6 col-md-3">
                <Skeleton height={250} borderRadius={10} />
              </div>
            ))}
        </div>
      </div>

      {/* Recently Viewed Products Skeleton */}
      <div className="mt-5">
        <Skeleton height={30} width="40%" />
        <div className="d-flex gap-3 mt-3 flex-wrap">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-6 col-md-3">
                <Skeleton height={250} borderRadius={10} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductDetail;
