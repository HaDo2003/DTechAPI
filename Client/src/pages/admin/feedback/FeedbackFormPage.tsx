import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../../../components/admin/CardWrapped";
import InputField from "../../../components/admin/InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type FeedbackForm } from "../../../types/Contact";

const FeedbackFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState<FeedbackForm>({
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
        fbdate: "",
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                setLoading(true);
                const res = await adminService.getSingleData<FeedbackForm>(`/api/feedback/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as FeedbackForm);
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
            <CardWrapped title="Feedback Form">
                <div className="card">
                    <div className="card-header text-center">
                        <h3>Feedback</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <InputField
                                    label="Name"
                                    name="name"
                                    value={form.name ?? ""}
                                    readOnly
                                />
                            </div>
                            <div className="col">
                                <InputField
                                    label="Email"
                                    name="email"
                                    value={form.email ?? ""}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <InputField
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={form.phoneNumber ?? ""}
                                    readOnly
                                />
                            </div>
                            <div className="col">
                                <InputField
                                    label="Feedback Date"
                                    name="fbdate"
                                    type="date"
                                    value={form.fbdate ? new Date(form.fbdate).toISOString().split("T")[0] : ""}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="detail">Detail</label>
                                    <textarea
                                        id="detail"
                                        name="detail"
                                        className="form-control"
                                        rows={4}
                                        value={form.message ?? ""}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/feedback")}
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

export default FeedbackFormPage;
