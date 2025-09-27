import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type OrderForm } from "../../../types/Order";

const OrderFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<OrderForm>({
        id: 0,
        email: "",
        billingName: "",
        billingPhone: "",
        billingAddress: "",
        shippingName: "",
        shippingPhone: "",
        shippingAddress: "",
        note: "",
        reductionCode: "",
        paymentId: undefined,
        orderProducts: [],
        shippingId: undefined,
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<OrderForm>(`/api/order/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setForm(res.data as OrderForm);
                }
            })();
        }
    }, [id, mode, token]);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
            }
        });

        setLoading(true);
        const res = mode === "create"
            ? await adminService.createData("/api/order/create", formData, token ?? "")
            : await adminService.updateData("/api/order/update", id ?? "", formData, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/order", {
                state: {
                    alert: {
                        message: "Order created successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<OrderForm>(`/api/order/get/${id}`, token ?? "");
            if (updatedRes.success && updatedRes.data) {
                setForm(updatedRes.data as OrderForm);
                setAlert({ message: "Order updated successfully!", type: "success" });
            }
            setLoading(false);
        } else {
            setLoading(false);
            setAlert({ message: res.message || "Submit form failed!", type: "error" });
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
                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header text-center">
                                <h3>{mode === "create" ? "Create Order" : "Edit Order"}</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Email"
                                            name="email"
                                            value={form.email ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <InputField
                                            label="Billing Name"
                                            name="billingName"
                                            value={form.billingName ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Billing Phone"
                                            name="billingPhone"
                                            value={form.billingPhone ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <InputField
                                            label="Billing Address"
                                            name="billingAddress"
                                            value={form.billingAddress ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Shipping Name"
                                            name="shippingName"
                                            value={form.shippingName ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <InputField
                                            label="Shipping Phone"
                                            name="shippingPhone"
                                            value={form.shippingPhone ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Shipping Address"
                                            name="shippingAddress"
                                            value={form.shippingAddress ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <InputField
                                            label="Note"
                                            name="note"
                                            value={form.note ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <InputField
                                            label="Reduction Code"
                                            name="reductionCode"
                                            value={form.reductionCode ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <InputField
                                            label="Payment Id"
                                            name="paymentId"
                                            value={form.paymentId ? String(form.paymentId) : ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary me-2">
                                    <i className="fa-solid fa-floppy-disk"></i> Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/order")}
                                    className="btn btn-secondary"
                                >
                                    <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            </CardWrapped>
        </>
    );
};

export default OrderFormPage;
