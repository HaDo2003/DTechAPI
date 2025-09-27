import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type CustomerForm } from "../../../types/Customer";

const CustomerFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<CustomerForm>({
        id: 0,
        userName: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        createDate: "",
        createdBy: "",
        updateDate: "",
        updatedBy: "",
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<CustomerForm>(`/api/customer/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setForm(res.data as CustomerForm);
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
            ? await adminService.createData("/api/customer/create", form, token ?? "")
            : await adminService.updateData("/api/customer/update", id ?? "", form, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/customer", {
                state: {
                    alert: {
                        message: "Customer created successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<CustomerForm>(`/api/customer/get/${id}`, token ?? "");
            if (updatedRes.success && updatedRes.data) {
                setForm(updatedRes.data as CustomerForm);
                setAlert({ message: "Customer updated successfully!", type: "success" });
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
            <CardWrapped title="Customer Form">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>{mode === "create" ? "Create Customer" : "Edit Customer"}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="User Name"
                                        name="userName"
                                        value={form.userName ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Full Name"
                                        name="fullName"
                                        value={form.fullName ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={form.phoneNumber ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Gender"
                                        name="gender"
                                        value={form.gender ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={form.dateOfBirth ?? ""}
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
                                onClick={() => navigate("/admin/customer")}
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

export default CustomerFormPage;
