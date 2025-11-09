import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { postService } from "../../services/PostService";
import NewsLayout from "../../layouts/NewsLayout";
import type { Post } from "../../types/Post";
import DOMPurify from "../../utils/santitizeConfig";
import { timeFormatter } from "../../utils/timeFormatter";
import SkeletonNewsDetail from "../../components/customer/skeleton/SkeletonNewsDetail";

const NewsDetail: React.FC = () => {
    const { categorySlug, postSlug } = useParams<{ categorySlug: string; postSlug: string }>();
    const [post, setPost] = React.useState<Post | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [relatedPosts, setRelatedPosts] = React.useState<Post[]>([]);

    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true);
            try {
                const data = await postService.getPostData(postSlug!);
                setPost(data);
                setRelatedPosts(data.relatedPosts || []);
            } catch (error) {
                console.error("Failed to fetch post detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [categorySlug, postSlug]);

    if (!loading && !post) {
        return <NotFound />;
    }

    return loading ? (
        <SkeletonNewsDetail />
    ) : (
        <NewsLayout>
            <div className="container py-4" style={{ maxWidth: "850px" }}>
                {/* Post Header */}
                <h2 className="fw-bold mb-2 text-uppercase">
                    {post?.name}
                </h2>
                <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
                    <span className="fw-semibold text-dark">{post?.postBy}</span>{" "}
                    <span className="ms-2">{timeFormatter(post?.postDate || "")}</span>
                </div>

                {/* Main Image */}
                {post?.image && (
                    <div className="mb-4 text-center">
                        <img
                            src={post.image}
                            alt={post.name}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                        />
                    </div>
                )}

                {/* Post Content */}
                <div
                    className="post-content"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post?.description || "")
                    }}
                />

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-5">
                        <h4 className="fw-bold mb-4">Related Posts</h4>
                        <div className="row g-3">
                            {relatedPosts.map((relatedPost) => (
                                <div key={relatedPost.postId} className="col-md-6">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img
                                            src={relatedPost.image}
                                            className="card-img-top"
                                            alt={relatedPost.name}
                                            style={{
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div className="card-body">
                                            <h6 className="fw-bold">{relatedPost.name}</h6>
                                            <small className="text-muted">
                                                {timeFormatter(relatedPost.postDate || "")}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </NewsLayout>
    );
};

export default NewsDetail;