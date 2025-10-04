import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../CardWrapped";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type ProductForm } from "../../../types/Product";
import ProductBasicInfoTab from "./ProductBasicInfoTab";
import ProductSpecificationTab from "./SpecificationTab";
import ProductImagesTab from "./ProductImagesTab";

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
        statusProduct: "",
        price: 0,
        discount: 0,
        priceAfterDiscount: 0,
        madeIn: "",
        description: "",
    });

    const [preview, setPreview] = useState<string>("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"basic" | "specs" | "images">("basic");

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                const res = await adminService.getSingleData<ProductForm>(`/api/product/get/${id}`, token ?? "");
                if (res) {
                    setForm(res as unknown as ProductForm);
                    setPreview((res as any).photo ?? "");
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
            if (updatedRes) {
                setForm(updatedRes as unknown as ProductForm);
                setPreview((updatedRes as any).photo ?? "");
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
                            <div>
                                <button
                                    type="button"
                                    className={`btn btn-sm me-2 ${activeTab === "basic" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveTab("basic")}
                                >
                                    Basic Info
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm me-2 ${activeTab === "specs" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveTab("specs")}
                                >
                                    Specifications
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm ${activeTab === "images" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveTab("images")}
                                >
                                    Images
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-body">
                                {activeTab === "basic" && (
                                    <ProductBasicInfoTab
                                        form={form}
                                        setForm={setForm}
                                        mode={mode}
                                        preview={preview}
                                        handleFileChange={handleFileChange}
                                        handleChange={handleChange}
                                    />
                                )}

                                {activeTab === "specs" && (
                                    <ProductSpecificationTab
                                        productId={form.id}
                                        specifications={form.specifications ?? []}
                                        setForm={setForm}
                                    />
                                )}

                                {activeTab === "images" && (
                                    <ProductImagesTab
                                        productId={form.id}
                                        productImages={form.productImages ?? []}
                                    />
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
                    </div>
                </form>
            </CardWrapped>
        </>
    );
};

export default ProductFormPage;
