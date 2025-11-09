import React from "react";

const SkeletonNewsDetail: React.FC = () => {
  return (
    <div className="container py-4" style={{ maxWidth: "850px" }}>
      {/* Title */}
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-8"></span>
      </div>

      {/* Author & Date */}
      <div className="placeholder-glow mb-3">
        <span className="placeholder col-2 me-2"></span>
        <span className="placeholder col-3"></span>
      </div>

      {/* Highlight Line */}
      <div className="placeholder-glow mb-4">
        <span className="placeholder col-10"></span>
      </div>

      {/* Image */}
      <div
        className="bg-light placeholder-wave rounded mb-4"
        style={{ height: "350px", width: "100%" }}
      ></div>

      {/* Company Info */}
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-6"></span>
      </div>
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-9"></span>
      </div>
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-8"></span>
      </div>
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-7"></span>
      </div>

      {/* Bullet points */}
      <ul className="list-unstyled mt-3">
        <li className="placeholder-glow mb-2">
          <span className="placeholder col-10"></span>
        </li>
        <li className="placeholder-glow mb-2">
          <span className="placeholder col-8"></span>
        </li>
        <li className="placeholder-glow mb-2">
          <span className="placeholder col-9"></span>
        </li>
      </ul>
    </div>
  );
};

export default SkeletonNewsDetail;
