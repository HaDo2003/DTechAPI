import React from "react";
import { type Post } from "../../../types/Post";
import { timeFormatter } from "../../../utils/timeFormatter";
import DOMPurify from "../../../utils/santitizeConfig";
import { Link } from "react-router-dom";

interface ArticlesGridProps {
    posts: Post[];
}

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ posts }) => {
    return (
        <div className="row g-3">
            {posts.map((article) => (
                <div key={article.postId} className="col-md-4">
                    <Link
                        to={`/news/${article.postCategorySlug}/${article.slug}`}
                        className="text-decoration-none"
                    >
                        <div className="card news-card h-100 border-0 shadow-sm d-flex flex-column">
                            <img
                                src={article.image}
                                className="card-img-top"
                                alt={article.name}
                                style={{
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "8px 8px 0 0",
                                }}
                            />
                            <div className="card-body p-3 d-flex flex-column flex-grow-1">
                                <h5
                                    className="fw-bold mb-2"
                                    style={{ fontSize: "16px", lineHeight: "1.4" }}
                                >
                                    {article.name}
                                </h5>
                                <div
                                    className="text-muted small mb-3"
                                    style={{ fontSize: "13px", lineHeight: "1.5" }}
                                >
                                    <div dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            article.description && article.description.length > 150
                                                ? article.description.substring(0, 150) + "..."
                                                : article.description || ""
                                        ),
                                    }}
                                    />
                                </div>
                                <p className="mb-0 mt-auto">
                                    <small className="text-muted d-flex align-items-center">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="me-1"
                                        >
                                            <circle
                                                cx="8"
                                                cy="8"
                                                r="7"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                fill="none"
                                            />
                                            <path
                                                d="M8 4v4l3 2"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                fill="none"
                                            />
                                        </svg>
                                        {timeFormatter(article.postDate || "")}
                                    </small>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div >
    );
};

export default ArticlesGrid;