import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { type Product } from "../../types/Product";
import { type Brand } from "../../types/Brand";
import { getCategoryProducts, getCategoryBrandProducts, getAllProducts, getFilteredProducts } from "../../services/CategoryService";
import NotFound from "./NotFound";
import SkeletonCategoryGrid from "../../components/customer/skeleton/SkeletonCategoryGrid";
import { useAuth } from "../../context/AuthContext";
import { customerService } from "../../services/CustomerService";
import { filterOptions } from "../../utils/filterConfig";

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
    const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);

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

    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 100000,
        inStock: false,
        rating: null as number | null,
        selectedOptions: {} as Record<string, string[]>,
    });

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
                        ? await getCategoryBrandProducts(categorySlug, brandSlug, currentPage, pageSize, sortOrder)
                        : await getCategoryProducts(categorySlug, currentPage, pageSize, sortOrder);
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

    useEffect(() => {
        if (showFilterPanel) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showFilterPanel]);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleOptionChange = (groupLabel: string, option: string, checked: boolean) => {
        setFilters((prev) => {
            const prevOptions = prev.selectedOptions[groupLabel] || [];
            return {
                ...prev,
                selectedOptions: {
                    ...prev.selectedOptions,
                    [groupLabel]: checked
                        ? [...prevOptions, option]
                        : prevOptions.filter((opt) => opt !== option),
                },
            };
        });
    };

    const handleRatingChange = (value: number) => {
        setFilters((prev) => ({ ...prev, rating: value }));
    };

    const handleApplyFilters = async () => {
        if (!categorySlug) return;

        const requestBody: any = {
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            inStock: filters.inStock || undefined,
            rating: filters.rating || undefined,
            page: 1,
            pageSize: pageSize,
            sortOrder: sortOrder,
        };

        for (const [key, values] of Object.entries(filters.selectedOptions)) {
            requestBody[key.toLowerCase().replace(/\s+/g, "")] = values;
        }

        try {
            setLoading(true);
            const data = await getFilteredProducts(categorySlug, requestBody, brandSlug);

            if (data && data.products) {
                setProducts(data.products);
                setTotalPages(data.totalPages ?? 1);
                setCurrentPage(1);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching filtered products:", error);
        } finally {
            setLoading(false);
            setShowFilterPanel(false);
        }
    };

    const handleClearFilters = async () => {
        setFilters({
            minPrice: 0,
            maxPrice: 100000,
            inStock: false,
            rating: null,
            selectedOptions: {},
        });

        // Reload default data
        if (categorySlug) {
            setLoading(true);
            try {
                const data = brandSlug
                    ? await getCategoryBrandProducts(categorySlug, brandSlug, currentPage, pageSize, sortOrder)
                    : await getCategoryProducts(categorySlug, currentPage, pageSize, sortOrder);

                setProducts(data.products);
                setTotalPages(data.totalPages ?? 1);
            } catch (error) {
                console.error("Error clearing filters:", error);
                setProducts([]);
            } finally {
                setLoading(false);
                setShowFilterPanel(false);
            }
        }
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

                    <div className="container my-4">
                        <div className="d-flex flex-wrap align-items-start gap-2 justify-content-start">
                            {/* Filter Button */}
                            <button
                                type="button"
                                onClick={() => setShowFilterPanel(true)}
                                className="btn border border-primary text-primary d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                                style={{ fontWeight: 500 }}
                            >
                                <i className="bi bi-funnel"></i>
                                Filter
                            </button>
                            {/* Brand Buttons */}
                            {brands.length > 0 && (
                                <>
                                    {brands.map((brand) => (
                                        <Link
                                            key={brand.slug}
                                            to={`/${categorySlug}/${brand.slug}`}
                                            className="d-flex align-items-center border bg-white rounded-3 px-3 py-2 text-decoration-none"
                                            style={{
                                                transition: "0.2s",
                                                borderColor: "#e0e0e0",
                                                fontWeight: 500,
                                            }}
                                        >
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                style={{ height: "20px", marginRight: "8px" }}
                                            />
                                            <span style={{ color: "#555" }}>{brand.name}</span>
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

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
                </div>
            )}

            {showFilterPanel && (
                <div
                    className="filter-overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-end z-2000"
                    onClick={() => setShowFilterPanel(false)}
                    style={{ overflowY: "hidden" }}
                >
                    <div
                        className="filter-panel bg-white p-4 shadow-lg h-100"
                        style={{ width: "320px", overflowY: "auto" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Filters</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowFilterPanel(false)}
                            ></button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleApplyFilters();
                                setShowFilterPanel(false);
                            }}
                        >
                            {/* Common filter options */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Price Range</label>
                                <div className="d-flex gap-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Min"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Max"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Category-Specific Filters */}
                            {filterOptions[categorySlug ?? ""] &&
                                filterOptions[categorySlug ?? ""].map((filterGroup) => (
                                    <div key={filterGroup.label} className="mb-3">
                                        <label className="form-label fw-bold">{filterGroup.label}</label>
                                        {filterGroup.options.map((opt) => (
                                            <div key={opt} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`${filterGroup.label}-${opt}`}
                                                    checked={filters.selectedOptions[filterGroup.label]?.includes(opt) || false}
                                                    onChange={(e) =>
                                                        handleOptionChange(filterGroup.label, opt, e.target.checked)
                                                    }
                                                />
                                                <label className="form-check-label" htmlFor={`${filterGroup.label}-${opt}`}>
                                                    {opt}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ))}

                            {/* Rating Filter */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Rating</label>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="rating"
                                            id={`rating-${rating}`}
                                            checked={filters.rating === rating}
                                            onChange={() => handleRatingChange(rating)}
                                        />
                                        <label className="form-check-label" htmlFor={`rating-${rating}`}>
                                            {rating} stars & up
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Availability */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Availability</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="inStock"
                                        name="inStock"
                                        checked={filters.inStock}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="inStock">In Stock</label>
                                </div>
                            </div>

                            <div className="d-flex align-item-center justify-content-center mt-3 gap-3">
                                <button type="submit" className="btn btn-primary w-75">
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning w-75"
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CategoryPage;
