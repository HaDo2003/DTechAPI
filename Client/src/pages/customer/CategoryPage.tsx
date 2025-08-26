import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { type Product } from "../../types/Product";
import { type Brand } from "../../types/Brand";
import { getCategoryProducts } from "../../services/CategoryService";
import Loading from "../../components/shared/Loading";

const CategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { categorySlug } = useParams<{ categorySlug: string }>();

    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [title, setTitle] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("newest");
    const [loading, setLoading] = useState<boolean>(true);

    const sortOptions: { label: string; value: string }[] = [
        { label: "Newest", value: "newest" },
        { label: "Discount", value: "discount" },
        { label: "Name ↑", value: "name_asc" },
        { label: "Name ↓", value: "name_desc" },
        { label: "Price ↑", value: "price_asc" },
        { label: "Price ↓", value: "price_desc" },
    ];

    useEffect(() => {
        if (!categorySlug) return;
        setLoading(true);

        getCategoryProducts(categorySlug, sortOrder)
            .then((data) => {
                setProducts(data.products);
                setBrands(data.brands ?? []);
                setTitle(data.title);
            })
            .finally(() => setLoading(false));
    }, [categorySlug, sortOrder]);

    if (loading) return <Loading />;

    const handleSortChange = (value: string) => {
        setSortOrder(value);
        navigate(`/${categorySlug}?sortOrder=${value}`);
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-center">
                <h2>{title}</h2>
            </div>

            {/* Brand Logos */}
            {brands.length > 0 && (
                <div className="container my-4">
                    <div className="category-nav">
                        <div className="row text-center">
                            {brands.map((brand) => (
                                <div className="col" key={brand.slug}>
                                    <Link
                                        to={`/product/${categorySlug}/${brand.slug}`}
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

            {/* Sort Options */}
            <div className="d-flex flex-wrap gap-2 px-3 mb-4">
                <h4>Sort By: </h4>
                {sortOptions.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleSortChange(value)}
                        className={`btn btn-custom ${sortOrder === value ? "btn-active" : "btn-outline-secondary"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Products */}
            <div className="position-relative">
                <div
                    id="product-list"
                    className="ps-lg-3 row row-cols-3 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-5 g-md-1 g-lg-0 g-xxl-2"
                >
                    {products.map((product) => (
                        <div className="col" key={product.productId}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
