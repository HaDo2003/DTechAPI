import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types/Product";
import { customerService } from "../../services/CustomerService";
import ProductCard from "../../components/customer/ProductCard";
import SkeletonWishlist from "../../components/customer/skeleton/SkeletonWishlist";
import AlertForm from "../../components/customer/AlertForm";

interface Wishlist {
    wishListId: number;
    productId: number;
    product: Product | null;
}

const Wishlist: React.FC = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState<Wishlist[]>([]);
    const [wishlists, setWishlists] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const fetchWishlists = async () => {
        if (!token) {
            setAlert({ message: "Please login to view your wishlists", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await customerService.getWishlists<Wishlist>(token);
            if (res.success && res.data) {
                setProducts(res.data);
                setWishlists(res.data.map((w) => w.productId));
            } else {
                setProducts([]);
                setWishlists([]);
            }
        } catch (err) {
            console.error(err);
            setProducts([]);
            setWishlists([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, [token]);

    return (
        <>
            {loading ? (
                <SkeletonWishlist />
            ) : (
                <div className="bg-gray-50 min-h-screen px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Favorite Products</h2>

                        {products.length === 0 ? (
                            <p className="text-gray-500">You have no items in your wishlist.</p>
                        ) : (
                            <div className="position-relative">
                                <div
                                    id="product-list"
                                    className="ps-lg-3 row row-cols-3 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-5 g-md-1 g-lg-0 g-xxl-2"
                                >
                                    {products.map((product) => (
                                        product.product ? (
                                            <div className="col" key={product.productId}>
                                                <ProductCard
                                                    key={product.productId}
                                                    product={product.product}
                                                    wishlists={wishlists}
                                                    onWishlistChange={fetchWishlists}
                                                />
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>
    );
};

export default Wishlist;
