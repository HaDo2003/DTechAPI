import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { type Product } from "../../types/Product";
import { type Brand } from "../../types/Brand";
import { getCategoryProducts, getCategoryBrandProducts, getAllProducts } from "../../services/CategoryService";
import NotFound from "./NotFound";
import SkeletonCategoryGrid from "../../components/customer/skeleton/SkeletonCategoryGrid";
import { useAuth } from "../../context/AuthContext";
import { customerService } from "../../services/CustomerService";

const CategoryPage: React.FC = () => {
    const { token } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const navigate = useNavigate();
    const { categorySlug, brandSlug } = useParams<{ categorySlug: string; brandSlug?: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [title, setTitle] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("newest");
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(15);
    const [totalPages, setTotalPages] = useState<number>(1);

    const sortOptions: { label: string; value: string }[] = [
        { label: "Newest", value: "newest" },
        { label: "Discount", value: "discount" },
        { label: "Name ↑", value: "name_asc" },
        { label: "Name ↓", value: "name_desc" },
        { label: "Price ↑", value: "price_asc" },
        { label: "Price ↓", value: "price_desc" },
    ];

    const fetchWishlist = async () => {
        if (!token) return;
        try {
            const res = await customerService.getWishlists<{ productId: number }>(token);
            if (res.success && res.data) {
                setWishlistIds(res.data.map((w) => w.productId));
            } else {
                setWishlistIds([]);
            }
        } catch {
            setWishlistIds([]);
        }
    };

    useEffect(() => {
        setSortOrder("newest");
        setCurrentPage(1);
    }, [brandSlug]);

    useEffect(() => {
        if (!categorySlug) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const fetchData = async () => {
            try {
                let data;

                if (categorySlug === "all-products") {
                    data = await getAllProducts(currentPage, pageSize, sortOrder);
                } else {
                    data = brandSlug
                        ? await getCategoryBrandProducts(categorySlug, brandSlug, sortOrder)
                        : await getCategoryProducts(categorySlug, sortOrder);
                }


                if (!data) {
                    setProducts([]);
                    setTitle("");
                    return;
                }
                setProducts(data.products);
                setBrands(data.brands ?? []);
                setTitle(data.title ?? (categorySlug === "all-products" ? "All Products" : ""));
                setTotalPages(data.totalPages ?? 1);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug, brandSlug, sortOrder, currentPage]);

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    if (!loading && products.length === 0) {
        return <NotFound />;
    }

    const handleSortChange = (value: string) => {
        setSortOrder(value);
        setCurrentPage(1);

        if (brandSlug) {
            navigate(`/${categorySlug}/${brandSlug}?sortOrder=${value}`);
        } else {
            navigate(`/${categorySlug}?sortOrder=${value}`);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {loading ? (
                <SkeletonCategoryGrid />
            ) : (
                <div className="container">
                    <div className="d-flex align-items-center justify-content-center">
                        <h2>{title}</h2>
                    </div>

                    {brands.length > 0 && (
                        <div className="container my-4">
                            <div className="category-nav">
                                <div className="row text-center">
                                    {brands.map((brand) => (
                                        <div className="col" key={brand.slug}>
                                            <Link
                                                to={`/${categorySlug}/${brand.slug}`}
                                                className="category-item"
                                            >
                                                <div className="icon-container">
                                                    <img
                                                        src={brand.logo}
                                                        className="card-img-top p-1 w-100 mx-auto d-block"
                                                        alt={brand.name}
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-2 px-3 mb-4">
                        <h4>Sort By: </h4>
                        {sortOptions.map(({ label, value }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleSortChange(value)}
                                className={`btn btn-custom ${sortOrder === value ? "btn-active" : "btn-outline-secondary"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="position-relative">
                        <div
                            id="product-list"
                            className="ps-lg-3 row row-cols-3 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-5 g-md-1 g-lg-0 g-xxl-2"
                        >
                            {products.map((product) => (
                                <div className="col" key={product.productId}>
                                    <ProductCard
                                        product={product}
                                        wishlists={wishlistIds}
                                        onWishlistChange={fetchWishlist}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    {categorySlug === "all-products" && totalPages > 1 && (
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
                </div>
            )}
        </>
    );
};

export default CategoryPage;
