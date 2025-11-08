import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonNewsPage: React.FC = () => {
    return (
        <div style={{ backgroundColor: "#f8f9fa" }}>
            <div className="container py-2">
                {/* Category Navigation */}
                <div className="mb-4">
                    <nav
                        className="d-flex gap-4 overflow-auto border-bottom pb-3"
                        style={{ fontSize: "15px" }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                width={80}
                                height={16}
                                baseColor="#e0e0e0"
                                highlightColor="#f0f0f0"
                            />
                        ))}
                    </nav>
                </div>

                {/* News Grid */}
                <div className="row g-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <Skeleton
                                    height={180}
                                    baseColor="#e0e0e0"
                                    highlightColor="#f5f5f5"
                                    style={{
                                        borderRadius: "8px 8px 0 0",
                                    }}
                                />
                                <div className="card-body p-3">
                                    <Skeleton width="90%" height={14} className="mb-2" />
                                    <Skeleton count={2} height={12} className="mb-2" />
                                    <Skeleton width="40%" height={10} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-dark text-white fw-bold py-3">
                        <Skeleton width={120} height={18} baseColor="#3d3d3d" />
                    </div>
                    <div className="card-body p-0">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`p-3 border-bottom`}
                            >
                                <div className="row g-2 align-items-center">
                                    <div className="col-4">
                                        <Skeleton
                                            height={70}
                                            baseColor="#e0e0e0"
                                            highlightColor="#f5f5f5"
                                            style={{ borderRadius: "6px" }}
                                        />
                                    </div>
                                    <div className="col-8">
                                        <Skeleton width="90%" height={12} className="mb-1" />
                                        <Skeleton width="60%" height={10} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
  );
};

export default SkeletonNewsPage;
