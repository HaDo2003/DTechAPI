import React from "react";
import type { OrderSummary } from "../../../types/Order";
import Loading from "../../shared/Loading";
import { Link } from "react-router-dom";

interface OrderSummaryProps {
  orderSummary?: OrderSummary;
  reductionCode: string;
  onReductionCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyDiscount: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  orderSummary,
  reductionCode,
  onReductionCodeChange,
  onApplyDiscount,
  onSubmit
}) => {
  if (!orderSummary) {
    return <Loading />;
  }

  return (
    <>
      <div className="col-lg-4">
        <div className="card card-order sticky-top">
          <div className="card-header card-header-order">
            <h5 className="mb-0">Order ({orderSummary.itemCount} products)</h5>
          </div>
          <div className="card-body card-body-order">
            {/* Product List */}
            {orderSummary.items.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center mb-3 pb-3 border-bottom"
              >
                <div className="position-relative me-3">
                  <img
                    src={item.photo}
                    alt={item.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    className="rounded"
                  />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                    {item.quantity}
                  </span>
                </div>
                <div className="d-flex flex-column">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                  </div>
                  {item.color && (
                    <div className="d-flex align-items-center mt-1">
                      <div
                        className="cart-product-color-circle me-2"
                        style={{
                          backgroundColor: item.color.colorCode,
                        }}
                      ></div>
                      <small className="text-muted">{item.color.colorName}</small>
                    </div>
                  )}
                </div>
                <div className="text-end">
                  <strong>{item?.price?.toLocaleString()}</strong>
                </div>
              </div>
            ))}

            {/* Discount Code */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Input Coupon"
                  value={reductionCode}
                  onChange={onReductionCodeChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={onApplyDiscount}
                >
                  Apply
                </button>
              </div>
              <div id="discount-message" className="mt-2"></div>
            </div>

            {/* Order Summary */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Price:</span>
                <span id="subtotal">{orderSummary.subTotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping Fee:</span>
                <span id="shipping-fee">
                  {orderSummary.shippingFee > 0
                    ? orderSummary.shippingFee.toLocaleString()
                    : "Free Ship"}
                </span>
              </div>
              {orderSummary.discountAmount && orderSummary.discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2" id="discount-row">
                  <span>Discount:</span>
                  <span id="discount-amount" className="text-success">
                    -{orderSummary.discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Final Price:</strong>
                <strong className="text-primary" id="total-price">
                  {orderSummary.total.toLocaleString()}
                </strong>
              </div>

              <button
                type="submit"
                form="checkoutForm"
                className="btn btn-primary w-100 mb-2"
                onClick={onSubmit}>
                <i className="fas fa-shopping-cart me-2"></i>Order
              </button>
              <Link to="/cart" className="btn btn-outline-secondary w-100">
                <i className="fas fa-arrow-left me-2"></i>Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
      {!orderSummary && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Loading />
        </div>
      )}
    </>
  );
};

export default OrderSummaryComponent;
