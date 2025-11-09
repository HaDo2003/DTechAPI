import React, { useEffect, useState } from "react";
import NewsLayout from "../../layouts/NewsLayout";
import type { Post } from "../../types/Post";
import DOMPurify from "../../utils/santitizeConfig";
import { timeFormatter } from "../../utils/timeFormatter";
import ArticlesGrid from "../../components/customer/news/ArticlesGrid";
import { Link } from "react-router-dom";

const NewsInitial: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mainPosts, setMainPosts] = useState<Post[]>([]);
  const [sidebarPosts, setSidebarPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news/get-initial-page");
        const data = await response.json();
        setPosts(data.posts || []);
        setMainPosts(data.mainPosts || []);
        setSidebarPosts(data.sidebarPosts || []);
      } catch (error) {
        console.error("Failed to fetch initial news page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <NewsLayout isContentLoading={loading}>
      <h2 className="fw-bold mb-4">ALL NEWS</h2>
      {/* Main Article */}
      {mainPosts.length > 0 && (
        <div className="row mb-4">
          <div className="col-lg-8">
            <Link
              to={`/news/${mainPosts[0].postCategorySlug}/${mainPosts[0].slug}`}
              className="text-decoration-none"
            >
              <div className="card border-0 shadow-sm">
                <img
                  src={mainPosts[0].image}
                  className="card-img-top"
                  alt="Featured"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <div className="card-body p-4">
                  <p className="text-muted small mb-1">
                    <span className="d-inline-flex align-items-center">
                      <svg
                        width="16"
                        height="16"
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
                      {timeFormatter(mainPosts[0].postDate || "")}
                    </span>
                  </p>
                  <h3 className="fw-bold mb-2" style={{ fontSize: "24px" }}>
                    {mainPosts[0].name}
                  </h3>
                  <div className="text-muted" style={{ lineHeight: "1.6" }}>
                    <div dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        mainPosts[0].description && mainPosts[0].description.length > 200
                          ? mainPosts[0].description.substring(0, 200) + "..."
                          : mainPosts[0].description || ""
                      ),
                    }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-4">
            <div
              className="d-flex flex-column h-100"
              style={{
                height: "200px",
                overflow: "hidden",
                justifyContent: "space-between",
              }}
            >
              {sidebarPosts.map((news) => (
                <Link
                  key={news.postId}
                  to={`/news/${news.postCategorySlug}/${news.slug}`}
                  className="text-decoration-none flex-grow-1"
                  style={{
                    minHeight: "90px",
                    maxHeight: "90px",
                  }}
                >
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="col-5">
                      <img
                        src={news.image}
                        alt={news.name}
                        className="img-fluid h-100"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px 0 0 8px",
                        }}
                      />
                    </div>
                    <div className="col-7 d-flex flex-column justify-content-between">
                      <div className="card-body p-2">
                        <h6
                          className="fw-bold mb-1"
                          style={{
                            fontSize: "13px",
                            lineHeight: "1.3",
                            maxHeight: "2.6em",
                            overflow: "hidden",
                          }}
                        >
                          {news.name}
                        </h6>
                      </div>
                      <div className="card-footer bg-white border-0 p-2 pt-0">
                        <small
                          className="text-muted d-flex align-items-center"
                          style={{ fontSize: "11.5px" }}
                        >
                          <svg
                            width="11"
                            height="11"
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
                          {timeFormatter(news.postDate || "")}
                        </small>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Articles */}
      <ArticlesGrid posts={posts} />
    </NewsLayout>
  );
};

export default NewsInitial;
