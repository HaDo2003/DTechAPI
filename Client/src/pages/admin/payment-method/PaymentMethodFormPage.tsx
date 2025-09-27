import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type PaymentMethodForm } from "../../../types/PaymentMethod";

const PaymentMethodFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<PaymentMethodForm>({
        id: 0,
        description: "",
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<PaymentMethodForm>(`/api/paymentmethod/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setForm(res.data as PaymentMethodForm);
                }
            })();
        }
    }, [id, mode, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = mode === "create"
            ? await adminService.createData("/api/paymentmethod/create", form, token ?? "")
            : await adminService.updateData("/api/paymentmethod/update", id ?? "", form, token ?? "");

        if (res.success) {
            setLoading(false);
            navigate("/admin/paymentmethod", {
                state: {
                    alert: {
                        message: mode === "create" ? "Payment method created successfully!" : "Payment method updated successfully!",
                        type: "success",
                    },
                },
            });
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

            <CardWrapped title="Payment Method Form">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>{mode === "create" ? "Create Payment Method" : "Edit Payment Method"}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Description"
                                        name="description"
                                        value={form.description ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {mode === "edit" && (
                                <>
                                    <div className="row">
                                        <div className="col">
                                            <InputField
                                                label="Created By"
                                                name="createdBy"
                                                value={form.createdBy ?? ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col">
                                            <InputField
                                                label="Create Date"
                                                name="createDate"
                                                value={form.createDate ?? ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <InputField
                                                label="Updated By"
                                                name="updatedBy"
                                                value={form.updatedBy ?? ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col">
                                            <InputField
                                                label="Update Date"
                                                name="updateDate"
                                                value={form.updateDate ?? ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary me-2">
                                <i className="fa-solid fa-floppy-disk"></i> Save
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/paymentmethod")}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                            </button>
                        </div>
                    </div>
                </form>
            </CardWrapped>
        </>
    );
};

export default PaymentMethodFormPage;
