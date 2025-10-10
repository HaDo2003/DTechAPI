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
                        </div>

                        <div className="row m-2">
                            <div className="col">
                                <h4>Order Products</h4>
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Product</th>
                                            <th className="text-center">Quantity</th>
                                            <th className="text-end">Price</th>
                                            <th className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.orderProducts && form.orderProducts.length > 0 ? (
                                            form.orderProducts.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td>{p.productName}</td>
                                                    <td className="text-center">{p.quantity}</td>
                                                    <td className="text-end">
                                                        {priceFormatter(p.price)}
                                                    </td>
                                                    <td className="text-end">
                                                        {priceFormatter(p.total)}
                                                    </td>
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
