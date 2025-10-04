import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type CategoryForm } from "../../../types/Category";

const CategoryFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [parent, setParent] = useState<{ value: number; label: string }[]>([]);
    const [form, setForm] = useState<CategoryForm>({
        id: 0,
        name: "",
        slug: "",
        parentId: null,
        parentName: "",
        status: "Available",
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await adminService.getParentsData<{ id: number; name: string }>("/api/category/get-parents", token ?? "");
            if (res.success && res.data) {
                setParent(res.data.map(r => ({ value: r.id, label: r.name })));
            }
        })();
    }, [token]);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<CategoryForm>(`/api/category/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as CategoryForm);
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
        setLoading(true);

        const res = mode === "create"
            ? await adminService.createData("/api/category/create", form, token ?? "")
            : await adminService.updateData("/api/category/update", id ?? "", form, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/category", {
                state: {
                    alert: {
                        message: "Category created successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<CategoryForm>(`/api/category/get/${id}`, token ?? "");
            if (updatedRes) {
                setForm(updatedRes as unknown as CategoryForm);
                setAlert({ message: "Category updated successfully!", type: "success" });
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
            <CardWrapped title="Category Form">
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header text-center">
                                <h3>{mode === "create" ? "Create Category" : "Edit Category"}</h3>
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
                                    {mode === "edit" && (
                                        <div className="col">
                                            <InputField
                                                label="Slug"
                                                name="slug"
                                                value={form.slug ?? ""}
                                                onChange={handleChange}
                                                readOnly
                                            />
                                        </div>
                                    )}
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="parent-select">Parent</label>
                                            <select
                                                id="parent-select"
                                                name="parentId"
                                                value={form.parentId ?? ""}
                                                onChange={handleChange}
                                                className="form-control"
                                            >
                                                <option value="">Select Parent</option>
                                                {parent.map((par) => (
                                                    <option key={par.value} value={par.value}>
                                                        {par.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
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
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
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
                                    onClick={() => navigate("/admin/category")}
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

export default CategoryFormPage;
