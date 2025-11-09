import React, { useState } from "react";
import { type Post, type PostCategory } from "../types/Post";
import { postService } from "../services/PostService";
import { useEffect } from "react";
import SkeletonNewsPage from "../components/customer/skeleton/SkeletonNewsPage";
import { timeFormatter } from "../utils/timeFormatter";
import { Link, useLocation } from "react-router-dom";

interface NewsLayoutProps {
    children: React.ReactNode;
    isContentLoading?: boolean;
}

const NewsLayout: React.FC<NewsLayoutProps> = ({
    children,
    isContentLoading,
}) => {
    const location = useLocation();
    const [categories, setCategories] = useState<PostCategory[]>([]);
    const [featuredNews, setFeaturedNews] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLayout = async () => {
            setLoading(true);
            try {
                const response = await postService.getPostCategories();
                setCategories(response.categories || []);
                setFeaturedNews(response.featuredNews || []);
            } catch (error) {
                console.error("Failed to fetch post categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLayout();
    }, []);

    return (
        <>
            {loading || isContentLoading ? (
                <SkeletonNewsPage />
            ) : (
                <div>
                    {/* Category Navigation */}
                    <div className="mb-4">
                        <nav className="d-flex gap-4 overflow-auto border-bottom pb-3" style={{ fontSize: '15px' }}>
                            <Link
                                to="/news"
                                className={`text-decoration-none fw-medium text-nowrap ${location.pathname === '/news'
                                    ? 'text-primary border-bottom border-primary border-2'
                                    : 'text-dark'
                                    }`}
                                style={{ paddingBottom: '0.75rem' }}
                            >
                                ALL NEWS
                            </Link>
                            {categories.map(category => {
                                const isActive = location.pathname === `/news/${category.slug}`;
                                return (
                                    <Link
                                        key={category.categoryId}
                                        to={`/news/${category.slug}`}
                                        className={`text-decoration-none fw-medium text-nowrap ${isActive
                                            ? 'text-primary border-bottom border-primary border-2'
                                            : 'text-dark'
                                            }`}
                                        style={{ paddingBottom: '0.75rem' }}
                                    >
                                        {category.name.toUpperCase()}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="row g-5">
                        {/* Left Column */}
                        <div className="col-lg-8">
                            {children}
                        </div>

                        {/* Right Sidebar */}
                        <div className="col-lg-4">
                            {/* Featured News */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-dark text-white fw-bold py-3">
                                    FEATURED NEWS
                                </div>
                                <div className="card-body p-0">
                                    {featuredNews.map((news, index) => (
                                        <div
                                            key={news.postId}
                                            className={`p-3 ${index !== featuredNews.length - 1 ? 'border-bottom' : ''}`}
                                        >
                                            <Link
                                                to={`/news/${news.postCategorySlug}/${news.slug}`}
                                                className="text-decoration-none"
                                            >
                                                <div className="row g-2 align-items-center">
                                                    <div className="col-4">
                                                        <img
                                                            src={news.image}
                                                            className="img-fluid rounded"
                                                            alt={news.name}
                                                            style={{ height: '70px', width: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="col-8">
                                                        <h6 className="mb-1 fw-bold" style={{ fontSize: '13px', lineHeight: '1.3' }}>
                                                            {news.name}
                                                        </h6>
                                                        <small className="text-muted" style={{ fontSize: '11px' }}>{timeFormatter(news.postDate || "")}</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
                </div >
            )}
        </>
    );
};

export default NewsLayout;