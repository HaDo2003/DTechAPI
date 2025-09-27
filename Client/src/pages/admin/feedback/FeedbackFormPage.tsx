import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type FeedbackForm } from "../../../types/Contact";

const FeedbackFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<FeedbackForm>({
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        detail: "",
        fbdate: "",
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<FeedbackForm>(`/api/feedback/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setForm(res.data as FeedbackForm);
                }
            })();
        }
    }, [id, mode, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            ? await adminService.createData("/api/feedback/create", form, token ?? "")
            : await adminService.updateData("/api/feedback/update", id ?? "", form, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/feedback", {
                state: {
                    alert: {
                        message: "Feedback created successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<FeedbackForm>(`/api/feedback/get/${id}`, token ?? "");
            if (updatedRes.success && updatedRes.data) {
                setForm(updatedRes.data as FeedbackForm);
                setAlert({ message: "Feedback updated successfully!", type: "success" });
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
            <CardWrapped title="Feedback Form">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>{mode === "create" ? "Create Feedback" : "Edit Feedback"}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Name"
                                        name="name"
                                        value={form.name ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Email"
                                        name="email"
                                        value={form.email ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={form.phoneNumber ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Feedback Date"
                                        name="fbdate"
                                        type="date"
                                        value={form.fbdate ?? ""}
                                        onChange={handleChange}
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
                                            value={form.detail ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary me-2">
                                <i className="fa-solid fa-floppy-disk"></i> Save
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/feedback")}
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

export default FeedbackFormPage;
