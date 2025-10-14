import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../../../components/admin/CardWrapped";
import InputField from "../../../components/admin/InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type OrderForm } from "../../../types/Order";
import { priceFormatter } from "../../../utils/priceFormatter";
import DOMPurify from "../../../utils/santitizeConfig";

const OrderFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState<OrderForm>({
        id: 0,
        email: "",
        finalCost: 0,
        billingName: "",
        billingPhone: "",
        billingAddress: "",
        shippingName: "",
        shippingPhone: "",
        shippingAddress: "",
        note: "",
        payment: undefined,
        orderProducts: [],
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                setLoading(true);
                const res = await adminService.getSingleData<OrderForm>(`/api/order/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as OrderForm);
                }
                setLoading(false);
            })();
        }
    }, [id, token]);

    const handleStatusChange = async (newStatus: string) => {
        if (!id || !token) return;

        const confirmMsg =
            newStatus === "Order Canceled"
                ? "Are you sure you want to cancel this order?"
                : `Update status to "${newStatus}"?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            setUpdating(true);
            const res = await adminService.updateOrderStatus("/api/order/update-status", token, id, newStatus);
            if (res.success) {
                setForm({ ...form, statusName: newStatus });
                setAlert({ message: "Order status updated successfully!", type: "success" });
            } else {
                setAlert({ message: res.message || "Failed to update status.", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error updating status. Try again later.", type: "error" });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
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
            <CardWrapped title="Order Form">
                <>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>Order Detail</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Order ID"
                                        name="id"
                                        value={form.id ?? ""}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Email"
                                        name="email"
                                        value={form.email ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Final Cost"
                                        name="finalCost"
                                        value={form.finalCost ?? 0}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Billing Name"
                                        name="billingName"
                                        value={form.billingName ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Billing Phone"
                                        name="billingPhone"
                                        value={form.billingPhone ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Billing Address"
                                        name="billingAddress"
                                        value={form.billingAddress ?? ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Shipping Name"
                                        name="shippingName"
                                        value={form.shippingName ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Shipping Phone"
                                        name="shippingPhone"
                                        value={form.shippingPhone ?? ""}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Shipping Address"
                                        name="shippingAddress"
                                        value={form.shippingAddress ?? ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {form.note && (
                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Note"
                                            name="note"
                                            value={form.note ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Order Status Tracker */}
                            <div className="row mt-4 mb-3">
                                <div className="col">
                                    <h5>Order Status</h5>

                                    {/* Progress Tracker */}
                                    <div className="progress mb-3" style={{ height: "10px" }}>
                                        <div
                                            className={`progress-bar ${form.statusName === "Order Placed"
                                                    ? "bg-primary"
                                                    : form.statusName === "Order Processing"
                                                        ? "bg-info"
                                                        : form.statusName === "Shipped"
                                                            ? "bg-secondary"
                                                            : form.statusName === "Out for Delivery"
                                                                ? "bg-info"
                                                                : form.statusName === "Delivered" ||
                                                                    form.statusName === "Order Completed"
                                                                    ? "bg-success"
                                                                    : form.statusName === "Order Canceled"
                                                                        ? "bg-danger"
                                                                        : form.statusName === "Order Returned"
                                                                            ? "bg-dark"
                                                                            : "bg-secondary"
                                                }`}
                                            role="progressbar"
                                            style={{
                                                width:
                                                    form.statusName === "Order Placed"
                                                        ? "10%"
                                                        : form.statusName === "Order Processing"
                                                            ? "25%"
                                                            : form.statusName === "Shipped"
                                                                ? "50%"
                                                                : form.statusName === "Out for Delivery"
                                                                    ? "75%"
                                                                    : "100%",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Update Buttons */}
                                    <div className="d-flex gap-2 flex-wrap">
                                        {(() => {
                                            if (
                                                ["Order Canceled", "Order Returned", "Order Completed"].includes(
                                                    form.statusName ?? "Unknown Status"
                                                )
                                            ) {
                                                return (
                                                    <span className="text-muted fst-italic">
                                                        {form.statusName ?? "Unknown Status"}.
                                                    </span>
                                                );
                                            }

                                            const statusSteps = [
                                                "Order Placed",
                                                "Order Processing",
                                                "Shipped",
                                                "Out for Delivery",
                                                "Delivered",
                                                "Order Completed",
                                                "Order Returned",
                                            ];

                                            const currentIndex = statusSteps.indexOf(form.statusName ?? "");
                                            const visibleStatuses =
                                                currentIndex >= 0 ? statusSteps.slice(currentIndex) : statusSteps;

                                            return (
                                                <>
                                                    {visibleStatuses.map((s) => (
                                                        <button
                                                            key={s}
                                                            className={`btn ${form.statusName === s ? "btn-primary" : "btn-outline-primary"
                                                                } btn-sm`}
                                                            disabled={form.statusName === s || updating}
                                                            onClick={() => handleStatusChange(s)}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}

                                                    {/* Cancel Button */}
                                                    {form.statusName !== "Order Canceled" &&
                                                        form.statusName !== "Delivered" &&
                                                        form.statusName !== "Order Completed" && (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                disabled={updating}
                                                                onClick={() => handleStatusChange("Order Canceled")}
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row m-2">
                            <div className="col">
                                <h4>Order Products</h4>
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Product</th>
                                            <th className="text-center">Quantity</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Total</th>
                                            <th className="text-start">Promotion Gift</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.orderProducts && form.orderProducts.length > 0 ? (
                                            form.orderProducts.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td>{p.productName}</td>
                                                    <td className="text-center">{p.quantity}</td>
                                                    <td className="text-center">
                                                        {priceFormatter(p.price)}
                                                    </td>
                                                    <td className="text-center">
                                                        {priceFormatter(p.total)}
                                                    </td>
                                                    {p.promotionalGift && (
                                                        <td className="text-start">
                                                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.promotionalGift) }} />
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">
                                                    No products in this order
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="row m-2">
                            <div className="col">
                                <h4>Payment Information</h4>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row mb-2">
                                            <div className="col-md-6">
                                                <strong>Payment Method:</strong> {form.payment?.method ?? "-"}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Status:</strong>{" "}
                                                <span
                                                    className={`badge ${form.payment?.status === "Paid"
                                                        ? "bg-success"
                                                        : form.payment?.status === "Pending"
                                                            ? "bg-warning text-dark"
                                                            : "bg-danger"
                                                        }`}
                                                >
                                                    {form.payment?.status ?? "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/order")}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                            </button>
                        </div>
                    </div>
                </>
            </CardWrapped>
        </>
    );
};

export default OrderFormPage;
