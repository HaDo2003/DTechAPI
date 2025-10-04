import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type AdvertisementForm } from "../../../types/Advertisment";

const AdvertisementFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<AdvertisementForm>({
        id: 0,
        name: "",
        slug: "",
        image: "",
        order: 1,
        status: "Available",
    });

    const [preview, setPreview] = useState<string>("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<AdvertisementForm>(`/api/advertisement/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as AdvertisementForm);
                    setPreview((res as any).image ?? "");
                }
            })();
        }
    }, [id, mode, token]);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "order" ? Number(value) : value,
        });
    };

    // handle file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm({ ...form, imageUpload: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', form.name ?? "");
        formData.append('Order', form.order.toString());
        formData.append('Status', form.status ?? "");
        formData.append('image', form.image ?? "");

        // Only append image if it exists
        if (form.imageUpload) {
            formData.append('imageUpload', form.imageUpload);
        }

        setLoading(true);
        const res = mode === "create"
            ? await adminService.createData("/api/advertisement/create", formData, token ?? "")
            : await adminService.updateData("/api/advertisement/update", id ?? "", formData, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/advertisement", {
                state: {
                    alert: {
                        message: mode === "create" ? "Advertisement created successfully!" : "Advertisement updated successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<AdvertisementForm>(`/api/advertisement/get/${id}`, token ?? "");
            if (updatedRes) {
                setForm(updatedRes as unknown as AdvertisementForm);
                setPreview((updatedRes as any).image ?? "");
                setAlert({ message: "Advertisement updated successfully!", type: "success" });
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
            <CardWrapped title="Advertisement Form">
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header text-center">
                                <h3>{mode === "create" ? "Create Advertisement" : "Edit Advertisement"}</h3>
                            </div>
                            <div className="card-body">
                                {/* Avatar upload */}
                                <div className="form-group">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 col-sm-4 text-center">
                                            {preview && (
                                                <div className="d-flex justify-content-start align-items-center py-2">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="img-thumbnail rounded shadow-sm img-fluid"
                                                        style={{
                                                            maxWidth: "100%",
                                                            height: "auto",
                                                            objectFit: "cover",
                                                            transition: "transform 0.2s ease-in-out",
                                                        }}
                                                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-8 col-sm-8 p-0">
                                            <label htmlFor="input-file" className="btn btn-sm btn-danger ms-2">
                                                Update Photo
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        name="imageUpload"
                                        id="input-file"
                                        className="form-control d-none"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col col-lg-3 col-md-6">
                                        <InputField
                                            label="Name"
                                            name="name"
                                            value={form.name ?? ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Audit fields in edit mode */}
                                    {mode === "edit" && (
                                        <>
                                            <div className="col col-lg-3 col-md-6">
                                                <InputField
                                                    label="Slug"
                                                    name="slug"
                                                    value={form.slug ?? ""}
                                                    readOnly
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="col col-lg-3 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="status-select">Status</label>
                                            <select
                                                id="status-select"
                                                name="status"
                                                value={form.status ?? ""}
                                                onChange={handleChange}
                                                className="form-control"
                                                title="Status"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col col-lg-3 col-md-6">
                                        <InputField
                                            label="Order"
                                            name="order"
                                            value={form.order ?? 0}
                                            onChange={handleChange}
                                            type="number"
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
                                    onClick={() => navigate("/admin/advertisement")}
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

export default AdvertisementFormPage;