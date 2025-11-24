import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const [cartData, setCartData] = useState<Cart | null>(cart);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        if (!token) {
            setAlert({ message: "Please login to view your cart", type: "error" });
            return;
        }

        const loadCart = async () => {
            const data = await fetchCart();
            if (data) {
                setCartData(data);
            }
            setLoading(false);
        };

        loadCart();
    }, [token]);

    const handleUpdateQuantity = async (id: number, change: number) => {
        try {
            if (!token) {
                setAlert({ message: "Please login to view your cart", type: "error" });
                return;
            }
            const res = await cartService.updateProductQuantity(token, id, change);
            if (res.success) {
                setAlert({ message: "Update quantity successfully!", type: "success" });
                setCartData(res);
                await fetchCart();
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
                            <div className="card-header px-2 d-none d-md-block">
                                <div className="row g-0 text-center">
                                    <div className="col-md-4">Product Information</div>
                                    <div className="col-md-2">Unit Price</div>
                                    <div className="col-md-3">Quantity</div>
                                    <div className="col-md-2">Total amount</div>
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

                        <div className="row mt-3 g-3">
                            <div className="col-12 col-md-3 d-flex align-items-end">
                                <Link to="/" className="btn btn-primary w-100 w-md-auto">
                                    Continue Shopping
                                </Link>
                            </div>
                            <div className="col-12 col-md-5 d-md-block d-sm-none"></div>
                            <div className="col-12 col-md-4">
                                <div className="row g-2">
                                    <div className="col-6 col-md-12 d-flex align-items-center justify-content-start justify-content-md-between">
                                        <span className="fw-bold fs-5 fs-md-3 me-2">Grand Total:</span>
                                        <span id="grand-total" className="fw-bold fs-5 fs-md-3 text-end">{formatGrandTotal}</span>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <Link to="/check-out" className="btn btn-danger w-100">
                                            Check Out
                                        </Link>
                                    </div>
                                </div>
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
            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <Loading />
                </div>
            )}
        </>
    );
};

export default CartPage;
