import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonSlider: React.FC = () => {
  return (
    <div className="carousel slide mb-0">
      <div className="carousel-inner">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`carousel-item ${i === 0 ? "active" : ""} c-item`}
          >
            <Skeleton
              height={400}
              width="100%"
              borderRadius={0}
            />
          </div>
        ))}
      </div>

      {/* Optional placeholder buttons */}
      <div className="carousel-control-prev disabled">
        <span className="carousel-control-prev-icon opacity-25" />
      </div>
      <div className="carousel-control-next disabled">
        <span className="carousel-control-next-icon opacity-25" />
      </div>
    </div>
  );
};

export default SkeletonSlider;
