import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../../../components/admin/CardWrapped";
import InputField from "../../../components/admin/InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type CustomerForm } from "../../../types/Customer";

const CustomerFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

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
        if (id) {
            (async () => {
                setLoading(true);
                const res = await adminService.getSingleData<CustomerForm>(`/api/customer/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as CustomerForm);
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
            <CardWrapped title="Customer Form">
                <div className="card">
                    <div className="card-header text-center">
                        <h3>Customer Detail</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <InputField
                                    label="User Name"
                                    name="userName"
                                    value={form.userName ?? ""}
                                    readOnly
                                />
                            </div>
                            <div className="col">
                                <InputField
                                    label="Full Name"
                                    name="fullName"
                                    value={form.fullName ?? ""}
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
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={form.phoneNumber ?? ""}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <InputField
                                    label="Gender"
                                    name="gender"
                                    value={form.gender ?? ""}
                                    readOnly
                                />
                            </div>
                            <div className="col">
                                <InputField
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={form.dateOfBirth ?? ""}
                                    readOnly
                                />
                            </div>
                        </div>
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
                    </div>
                    <div className="card-footer">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/customer")}
                            className="btn btn-secondary"
                        >
                            <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
                        </button>
                    </div>
                </div>
            </CardWrapped>
        </>
    );
};

export default CustomerFormPage;
