import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartService } from "../../services/CartService";
import { useAuth } from "../../context/AuthContext";
import CartItem from "../../components/customer/cart/CartItem";
import { priceFormatter } from "../../utils/priceFormatter";
import type { Cart } from "../../types/Cart";
import Loading from "../../components/shared/Loading";
import AlertForm from "../../components/customer/AlertForm";
import { useCart } from "../../context/CartContext";

const CartPage: React.FC = () => {
    const { token } = useAuth();
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<Cart | null>(cart);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        if (!token) {
            setAlert({ message: "Please login to view your cart", type: "error" });
            navigate("/login");
            return;
        }
        fetchCart();
        setLoading(false);
    }, [token]);

    const handleUpdateQuantity = async (id: number, change: number) => {
        try {
            if (!token) {
                setAlert({ message: "Please login to view your cart", type: "error" });
                navigate("/login");
                return;
            }
            const res = await cartService.updateProductQuantity(token, id, change);
            if (res.success) {
                setAlert({ message: "Update quantity successfully!", type: "success" });
                setCartData(res);
            } else {
                setAlert({ message: res.message || "Fail to update quantity!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Fail to update quantity", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (id: number) => handleUpdateQuantity(id, 0);

    if (loading) return <Loading />;
    if (!cartData?.cartProducts?.length) {
        return <div className="alert alert-info">Your cart is empty.</div>;
    }

    const grandTotal = cartData.cartProducts.reduce((acc, cp) => {
        let finalPrice = cp.priceAfterDiscount ? cp.priceAfterDiscount : cp.price;
        return acc + finalPrice * cp.quantity;
    }, 0);
    const formatGrandTotal = priceFormatter(grandTotal);

    return (
        <>
            <div className="container">
                <h3 className="ps-2">Your Cart</h3>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header px-2">
                                <div className="row g-0 text-center">
                                    <div className="col-4">Product Information</div>
                                    <div className="col-2">Unit Price</div>
                                    <div className="col-3">Quantity</div>
                                    <div className="col-2">Total amount</div>
                                </div>
                            </div>
                            <div className="card-body">
                                {!cartData || cartData.cartProducts.length === 0 ? (
                                    <div className="alert alert-info">Your cart is empty.</div>
                                ) : (
                                    cartData.cartProducts.map((item) => (
                                        <CartItem
                                            key={item.productId}
                                            cartProduct={item}
                                            onRemove={handleRemove}
                                            onUpdateQuantity={handleUpdateQuantity}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-8 d-flex align-items-end">
                                <Link to="/" className="btn btn-primary">
                                    Continue Shopping
                                </Link>
                            </div>
                            <div className="col-4 text-start">
                                <div className="row">
                                    <div className="col-6 text-start fw-bold fs-3">
                                        Grand Total:
                                    </div>
                                    <div id="grand-total" className="col-6 text-end fw-bold fs-3">
                                        {formatGrandTotal}
                                    </div>
                                </div>

                                <Link to="/checkout" className="btn btn-danger col-12">
                                    Check Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

export default CartPage;
