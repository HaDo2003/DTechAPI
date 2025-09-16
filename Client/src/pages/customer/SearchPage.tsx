import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../../types/Product";
import ProductCard from "../../components/customer/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { searchService } from "../../services/SearchService";

const SearchPage: React.FC = () => {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") ?? "";
    const [sortOrder, setSortOrder] = useState("newest");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Discount", value: "discount" },
        { label: "Name ↑", value: "name_asc" },
        { label: "Name ↓", value: "name_desc" },
        { label: "Price ↑", value: "price_asc" },
        { label: "Price ↓", value: "price_desc" },
    ];

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await searchService.searchProduct(query, sortOrder, token ?? "");
                if (res.success && res.products) {
                    setProducts(res.products);
                }
            } catch (err) {
                console.error("error: " + err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [query, sortOrder]);

    return (
        <div>
            {/* Title */}
            <div className="d-flex align-items-center justify-content-center">
                <h2>Search results for "{query}"</h2>
            </div>

            {/* Sort Options */}
            <div className="my-4">
                <div className="d-flex flex-wrap gap-2 px-3">
                    <h4>Sort By:</h4>
                    {sortOptions.map(({ label, value }) => {
                        const isActive = sortOrder === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setSortOrder(value)}
                                className={`btn btn-custom ${isActive ? "btn-active" : "btn-outline-secondary"
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Product List */}
            <div className="position-relative">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div
                        id="product-list"
                        className="ps-lg-3 row row-cols-3 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-5 g-md-1 g-lg-0 g-xxl-2"
                    >
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div className="col" key={product.productId}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-3">No products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;