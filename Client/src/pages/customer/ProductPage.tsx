import React, { useEffect } from "react";
import { type Product } from "../../types/Product";
import ProductDetail from "../../components/customer/productDetail/ProductDetail";
import { productService } from "../../services/ProductService";
import { useParams } from "react-router-dom";
import SkeletonProductDetail from "../../components/customer/skeleton/SkeletonProductDetail";
import NotFound from "./NotFound";

const ProductPage: React.FC = () => {
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const { categorySlug, brandSlug, slug } = useParams<{ categorySlug: string; brandSlug: string; slug: string }>();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductData(categorySlug!, brandSlug!, slug!);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [categorySlug, brandSlug, slug]);

    if (loading) {
        return <SkeletonProductDetail />;
    }

    if (!product) {
        return <NotFound />;
    }

    return <ProductDetail key={product.productId} product={product} />;
}

export default ProductPage;
