import React, { useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import type { OrderSuccessModel } from "../../types/OrderSuccess";
import NotFound from "./NotFound";

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { orderId } = useParams<{ orderId: string }>();

  // Get order data from location state or query parameters
  const order: OrderSuccessModel = useMemo(() => {
    if (location.state) {
      return location.state;
    }
    
    // If no state, construct from query parameters (VNPay redirect)
    return {
      success: true,
      orderId: orderId || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      totalCost: parseFloat(searchParams.get("totalCost") || "0"),
      shippingCost: parseFloat(searchParams.get("shippingCost") || "0"),
      finalCost: parseFloat(searchParams.get("finalCost") || "0"),
      paymentMethod: {
        description: searchParams.get("paymentMethod") || "VNPay"
      }
    };
  }, [location.state, searchParams, orderId]);

  if (orderId === undefined) {
    return <NotFound />
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container">
        {/* Success Message */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="success-icon">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="col">
                <h2 className="text-success mb-2">Thank you for your order</h2>
                <p className="text-muted mb-1">
                  A confirmation email has been sent to {order?.email}
                </p>
                <p className="text-muted mb-0">
                  Please check your email for details
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Purchase Information */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Purchase Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted d-block">Phone</small>
                  <span className="fw-medium">{order?.phone}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Email</small>
                  <span className="fw-medium">{order?.email}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Payment Method</small>
                  <span className="fw-medium">
                    {order?.paymentMethod?.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Delivery Information</h5>
              </div>
              <div className="card-body">
                {order?.shippingAddress ? (
                  <>
                    <div className="mb-3">
                      <small className="text-muted d-block">Address</small>
                      <span className="fw-medium">{order.shippingAddress}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <small className="text-muted d-block">Address</small>
                      <span className="fw-medium">{order?.address}</span>
                    </div>
                  </>
                )}
                <div className="mb-3">
                  <small className="text-muted d-block">Shipping Method</small>
                  <span className="fw-medium">Home Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Order #{order?.orderId}</h5>
              </div>
              <div className="card-body overflow-auto" style={{ maxHeight: "150px" }}>
                {order?.orderProducts?.map((product) => (
                  <div
                    key={product.id}
                    className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  >
                    <div
                      className="product-image-placeholder me-3 position-relative rounded overflow-hidden shadow-sm"
                      style={{ width: "150px", height: "100px" }}
                    >
                      <div className="position-absolute end-0 top-0">
                        <span className="bg-primary quantity-display badge-size">
                          {product.quantity}
                        </span>
                      </div>
                      <img
                        src={product.photo}
                        alt={product.name}
                        className="img-fluid object-fit-cover rounded"
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <div className="flex-grow-1 fw-semibold mb-1">
                        {product.name}
                      </div>
                      {product.color && (
                        <div className="d-flex align-items-center mt-1">
                          <div
                            className="cart-product-color-circle me-2"
                            style={{
                              backgroundColor: product.color.colorCode,
                            }}
                          ></div>
                          <small className="text-muted">{product.color.colorName}</small>
                        </div>
                      )}
                    </div>
                    <div className="text-end fw-semibold">
                      ${product?.costAtPurchase?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer bg-white">
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${order?.totalCost?.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping Fee</span>
                    <span>${order?.shippingCost?.toLocaleString()}</span>
                  </div>
                  {order?.costDiscount && order.costDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Discount</span>
                      <span className="text-danger">
                        - ${order.costDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold text-primary fs-5">
                    <span>Total</span>
                    <span>${order?.finalCost?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="/" className="btn btn-primary btn-lg px-4">
              <i className="fas fa-shopping-cart me-2"></i>Continue Shopping
            </a>
            <button className="btn btn-outline-primary btn-lg px-4">
              <i className="fas fa-print me-2"></i>View Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
