import React from "react";
import type { CartProductEdit } from "../../../types/CartProduct";
import { priceFormatter } from "../../../utils/priceFormatter";

type CartItemProps = {
    cartProduct: CartProductEdit;
    onUpdateQuantity: (id: number, change: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ cartProduct, onUpdateQuantity, onRemove }) => {

    const finalPrice = cartProduct.priceAfterDiscount || cartProduct.price;
    const formattedFinalPrice = priceFormatter(finalPrice);
    const priceTotal = finalPrice * cartProduct.quantity;
    const formattedPriceTotal = priceFormatter(priceTotal);

    return (
        <div
            className="cart-item-row border-bottom py-3"
            data-cart-product-id={cartProduct.id}
        >
            <div className="row align-items-center">

                {/* PRODUCT (image + name) */}
                <div className="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0">
                    <img
                        src={cartProduct.photo}
                        alt={cartProduct.name}
                        className="cart-img-custom me-2"
                    />

                    <div>
                        <div className="cart-product-name fw-semibold small">
                            {cartProduct.name}
                        </div>

                        {cartProduct.color && (
                            <div className="d-flex align-items-center mt-1 small">
                                <div
                                    className="cart-product-color-circle me-2"
                                    style={{
                                        backgroundColor: cartProduct.color.colorCode,
                                    }}
                                ></div>
                                <span className="text-muted">{cartProduct.color.colorName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* PRICE */}
                <div className="col-4 col-md-2 text-start text-md-center mb-2 mb-md-0">
                    <span className="fw-bold">{formattedFinalPrice}</span>
                </div>

                {/* QUANTITY */}
                <div className="col-4 col-md-3 d-flex justify-content-start justify-content-md-center mb-2 mb-md-0">
                    <div className="cart-quantity-control">
                        <button
                            type="button"
                            className="cart-btn-quantity-adjust decreaseQuantity"
                            onClick={() => onUpdateQuantity(cartProduct.id, -1)}
                        >
                            -
                        </button>

                        <input
                            type="text"
                            className="cart-quantity-input quantity"
                            value={cartProduct.quantity}
                            readOnly
                        />

                        <button
                            type="button"
                            className="cart-btn-quantity-adjust increaseQuantity"
                            onClick={() => onUpdateQuantity(cartProduct.id, +1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* TOTAL + REMOVE */}
                <div className="col-4 col-md-3 d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{formattedPriceTotal}</span>

                    <button
                        type="button"
                        className="btn p-0 border-0 bg-transparent"
                        onClick={() => onRemove(cartProduct.id)}
                    >
                        <i className="fa-solid fa-trash text-muted"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
