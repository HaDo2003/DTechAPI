import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import InputField from "../InputField";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type ProductForm } from "../../../types/Product";

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<ProductForm>({
        id: 0,
        name: "",
        slug: "",
        warranty: "",
        statusProduct: true,
        price: 0,
        discount: 0,
        priceAfterDiscount: 0,
        madeIn: "",
        description: "",
    });

    const [preview, setPreview] = useState<string>("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<ProductForm>(`/api/product/get/${id}`, token ?? "");
                if (res.success && res.data) {
                    setForm(res.data as unknown as ProductForm);
                    setPreview((res.data as any).photo ?? "");
                }
            })();
        }
    }, [id, mode, token]);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]:
                type === "number"
                    ? Number(value)
                    : name === "statusProduct"
                        ? value === "true"
                        : value,
        });
    };

    // handle file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm({ ...form, photoUpload: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", form.name ?? "");
        formData.append("Warranty", form.warranty ?? "");
        formData.append("StatusProduct", form.statusProduct ? "true" : "false");
        formData.append("Price", form.price?.toString() ?? "0");
        formData.append("Discount", form.discount?.toString() ?? "0");
        formData.append("PriceAfterDiscount", form.priceAfterDiscount?.toString() ?? "0");
        formData.append("MadeIn", form.madeIn ?? "");
        formData.append("Description", form.description ?? "");
        formData.append("Photo", form.photo ?? "");

        if (form.photoUpload) {
            formData.append("PhotoUpload", form.photoUpload);
        }

        setLoading(true);
        const res = mode === "create"
            ? await adminService.createData("/api/product/create", formData, token ?? "")
            : await adminService.updateData("/api/product/update", id ?? "", formData, token ?? "");

        if (res.success && mode === "create") {
            setLoading(false);
            navigate("/admin/product", {
                state: {
                    alert: {
                        message: "Product created successfully!",
                        type: "success",
                    },
                },
            });
        } else if (res.success && mode === "edit") {
            const updatedRes = await adminService.getSingleData<ProductForm>(`/api/product/get/${id}`, token ?? "");
            if (updatedRes.success && updatedRes.data) {
                setForm(updatedRes.data as unknown as ProductForm);
                setPreview((updatedRes.data as any).photo ?? "");
                setAlert({ message: "Product updated successfully!", type: "success" });
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
            <CardWrapped title="Product Form">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>{mode === "create" ? "Create Product" : "Edit Product"}</h3>
                        </div>
                        <div className="card-body">
                            {/* Product photo upload */}
                            <div className="form-group">
                                <div className="row align-items-center">
                                    <div className="col-lg-2 col-sm-4 text-center">
                                        {preview && <img src={preview} alt="Preview" className="py-2" width={100} />}
                                    </div>
                                    <div className="col-lg-10 col-sm-8 p-0">
                                        <label htmlFor="input-file" className="btn btn-sm btn-danger ms-2">
                                            Update Photo
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    name="photoUpload"
                                    id="input-file"
                                    className="form-control d-none"
                                    onChange={handleFileChange}
                                />
                            </div>

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
                                            readOnly
                                        />
                                    </div>
                                )}
                                <div className="col">
                                    <InputField
                                        label="Warranty"
                                        name="warranty"
                                        value={form.warranty ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Price"
                                        name="price"
                                        type="number"
                                        value={form.price?.toString() ?? "0"}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Discount"
                                        name="discount"
                                        type="number"
                                        value={form.discount?.toString() ?? "0"}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Price After Discount"
                                        name="priceAfterDiscount"
                                        type="number"
                                        value={form.priceAfterDiscount?.toString() ?? "0"}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <InputField
                                        label="Made In"
                                        name="madeIn"
                                        value={form.madeIn ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <InputField
                                        label="Description"
                                        name="description"
                                        value={form.description ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="statusProduct-select">Status</label>
                                        <select
                                            id="statusProduct-select"
                                            name="statusProduct"
                                            value={form.statusProduct ? "true" : "false"}
                                            onChange={handleChange}
                                            className="form-control"
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
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
                                                value={(form as any).createdBy ?? ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col">
                                            <InputField
                                                label="Create Date"
                                                name="createDate"
                                                value={(form as any).createDate ?? ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <InputField
                                                label="Updated By"
                                                name="updatedBy"
                                                value={(form as any).updatedBy ?? ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col">
                                            <InputField
                                                label="Update Date"
                                                name="updateDate"
                                                value={(form as any).updateDate ?? ""}
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
                                onClick={() => navigate("/admin/product")}
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

export default ProductFormPage;
