import React from "react";
import type { CartProductEdit } from "../../../types/CartProduct";
import { priceFormatter } from "../../../utils/priceFormatter";

type CartItemProps = {
    cartProduct: CartProductEdit;
    onUpdateQuantity: (id: number, change: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ cartProduct, onUpdateQuantity, onRemove }) => {

    const finalPrice = cartProduct.priceAfterDiscount ? cartProduct.priceAfterDiscount : cartProduct.price;
    const formattedFinalPrice = priceFormatter(finalPrice);
    const priceTotal = finalPrice * cartProduct.quantity;
    const formattedPriceTotal = priceFormatter(priceTotal);

    return (
        <div
            className="row py-2 align-items-center border-bottom cart-item-row"
            data-cart-product-id={cartProduct.id}
        >
            {/* Product info */}
            <div className="col-4 d-flex align-items-center">
                <img
                    src={cartProduct.photo}
                    alt={cartProduct.name}
                    className="cart-img-custom me-2"
                />
                <div className="d-flex flex-column">
                    <div className="cart-product-name">{cartProduct.name}</div>
                    {cartProduct.color && (
                        <div className="d-flex align-items-center mt-1">
                            <div
                                className="cart-product-color-circle me-2"
                                style={{
                                    backgroundColor: cartProduct.color.colorCode,
                                }}
                            ></div>
                            <small className="text-muted">{cartProduct.color.colorName}</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Unit price */}
            <div className="col-2 text-center">
                <span className="fw-bold fs-5">{formattedFinalPrice}</span>
            </div>

            {/* Quantity controls */}
            <div className="col-3 d-flex justify-content-center">
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

            {/* Total price */}
            <div className="col-2 text-center">
                <span className="fw-semibold fs-5 cart-total-price">
                    {formattedPriceTotal}
                </span>
            </div>

            {/* Remove button */}
            <div className="col-1 d-flex align-items-end justify-content-end">
                <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    onClick={() => onRemove(cartProduct.id)}
                >
                    <i className="fa-solid fa-trash fa-sm text-muted mb-1 me-1"></i>
                </button>
            </div>
        </div>
    );
};

export default CartItem;
