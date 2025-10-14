import React, { useEffect, useState } from "react";
import { type OrderDetailResponse } from "../../../types/Order";
import { customerService } from "../../../services/CustomerService";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../shared/Loading";
import { priceFormatter } from "../../../utils/priceFormatter";
import AlertForm from "../AlertForm";

type OrderDetailProps = {
    orderId: string;
    onClose?: () => void;
    onRefresh?: () => Promise<void>;
};

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onClose, onRefresh }) => {
    const { token } = useAuth();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await customerService.getOrderDetail(token ?? "", orderId);
                setOrder(data);
            } catch (err) {
                console.error("Failed to fetch order detail:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const onCancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
            try {
                setLoading(true);
                const data = await customerService.cancelOrder(token ?? "", orderId);
                if (data.success) {
                    setOrder(data);
                    setAlert({ message: "Cancel order successfully", type: "success" });
                }
            } catch (err) {
                setAlert({ message: "Fail to cancel order", type: "error" });
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <Loading />;
    if (!order) return <p>No order detail found.</p>;

    return (
        <>
            <div className="container py-4">
                <div className="row">
                    <div className="col-12 col-xl-12">
                        <div className="row">
                            <div className="col-6 mb-3 text-start">
                                <h1>Order detail of #{order.orderId}</h1>
                            </div>
                            <div className="col-6 mb-3 pt-2 text-end">
                                <span className="text-muted">Order Date: {order.orderDate}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 mb-2 text-start">
                                <span className="fw-bold">Payment Status: </span>
                                {order.payment?.status === 1 ? (
                                    <span className="text-success fw-bold">Paid</span>
                                ) : (
                                    <span className="text-danger fw-bold">Unpaid</span>
                                )}
                            </div>
                            <div className="mb-4 col-6 text-start">
                                <span className="fw-bold">Order Status: </span>
                                <span className="text-dark">{order.statusName}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12 mb-4">
                                <div className="border rounded p-3">
                                    <h5 className="fw-bold">Shipping Address</h5>
                                    <p>
                                        <strong>{order.nameReceive ?? order.name}</strong>
                                    </p>
                                    <p>
                                        Address:{" "}
                                        {order.shippingAddress ?? order.address}
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4 h-100">
                                <div className="border rounded p-3">
                                    <h5 className="fw-bold">Payment</h5>
                                    <p>{order.payment?.paymentMethodName}</p>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4 h-100">
                                <div className="border rounded p-3">
                                    <h5 className="fw-bold">Note</h5>
                                    <p>{order.note?.trim() || "Empty Note"}</p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="table-responsive mb-3">
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="text-center">Product</th>
                                                <th className="text-center">Price</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-center">Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderProducts?.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={item.photo}
                                                                className="me-2 rounded"
                                                                width="60"
                                                                height="60"
                                                                alt={item.name}
                                                            />
                                                            <div>
                                                                <a className="product-name-custom" href="#">
                                                                    {item.name}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center align-content-center">
                                                        {priceFormatter(item.price ?? 0)}
                                                    </td>
                                                    <td className="text-center align-content-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="text-center align-content-center">
                                                        {priceFormatter(item.costAtPurchase ?? 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <table className="table">
                                    <tfoot>
                                        <tr>
                                            <td>Discount</td>
                                            <td className="text-end">
                                                -{priceFormatter(order.costDiscount ?? 0)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Shipping Cost</td>
                                            <td className="text-end">
                                                +{priceFormatter(order.shippingCost ?? 0)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Grand Total</strong>
                                            </td>
                                            <td className="text-end">
                                                <strong className="text-danger" style={{ fontSize: "19px" }}>
                                                    {priceFormatter(order.finalCost ?? 0)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <div className="text-end mt-3">
                        {!["Order Canceled", "Order Returned", "Order Completed", "Delivered"].includes(
                            order.statusName ?? ""
                        ) && (
                                <button className="btn btn-danger me-2" onClick={onCancelOrder}>
                                    Cancel Order
                                </button>
                            )}
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                )}
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

export default OrderDetail;
