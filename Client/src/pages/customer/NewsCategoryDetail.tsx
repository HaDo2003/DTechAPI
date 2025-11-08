import React, { useEffect, useState } from "react";
import NewsLayout from "../../layouts/NewsLayout";
import type { Post } from "../../types/Post";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { postService } from "../../services/PostService";
import ArticlesGrid from "../../components/customer/news/ArticlesGrid";
import SkeletonNewsCategory from "../../components/customer/skeleton/SkeletonNewsCategory";

const NewsCategoryDetail: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(6);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (!categorySlug) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await postService.getPostsByCategory(categorySlug, currentPage, pageSize);
                setPosts(response.posts || []);
                setTotalPages(response.totalPages || 1);
                setTitle(response.title || "");
            } catch (error) {
                console.error("Failed to fetch posts by category:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug, currentPage, pageSize]);

    if (!loading && posts.length === 0) {
        return <NotFound />;
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {loading ? (
                <SkeletonNewsCategory />
            ) : (
                <NewsLayout>
                    <h2 className="fw-bold mb-4">{title || ''}</h2>
                    {/* Grid Articles */}
                    <ArticlesGrid posts={posts} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 my-5">
                            <button
                                className="btn btn-outline-secondary px-3 py-2"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                ←
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`btn ${currentPage === i + 1 ? "btn-primary text-white" : "btn-outline-secondary"} rounded-circle`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="btn btn-outline-secondary px-3 py-2"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                →
                            </button>
                        </div>
                    )}
                </NewsLayout>
            )}
        </>
    );
};

export default NewsCategoryDetail;
