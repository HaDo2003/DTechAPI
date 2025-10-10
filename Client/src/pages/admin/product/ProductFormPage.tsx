import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../../../components/admin/CardWrapped";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type ProductFormProp } from "../../../types/Product";
import ProductBasicInfoTab from "./ProductBasicInfoTab";
import ProductSpecificationTab from "./SpecificationTab";
import ProductImagesTab from "./ProductImagesTab";

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    const mode: "create" | "edit" = location.pathname.includes("edit") ? "edit" : "create";

    const [form, setForm] = useState<ProductFormProp>({
        productInfor: {
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
            photo: "",
        },
        specifications: [],
        productImages: [],
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"basic" | "specs" | "images">("basic");
    const [image, setImage] = useState<string>("");
    const [categories, setCategory] = useState<{ value: number; label: string }[]>([]);
    const [brands, setBrand] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        (async () => {
            const categoryRes = await adminService.getSelectData<{ id: number; name: string }>("/api/product/get-categories", token ?? "", "category");
            const brandRes = await adminService.getSelectData<{ id: number; name: string }>("/api/product/get-brands", token ?? "", "category");
            if (categoryRes.success && categoryRes.data) {
                setCategory(categoryRes.data.map(r => ({ value: r.id, label: r.name })));
            }

            if (brandRes.success && brandRes.data) {
                setBrand(brandRes.data.map(r => ({ value: r.id, label: r.name })));
            }
        })();
    }, [token]);

    useEffect(() => {
        if (mode === "edit" && id) {
            (async () => {
                setLoading(true);
                const res = await adminService.getSingleData<ProductFormProp>(`/api/product/get/${id}`, token ?? "");
                if (res.data && res.success) {
                    setForm({
                        productInfor: res.data.productInfor,
                        specifications: res.data.specifications ?? [],
                        productImages: res.data.productImages ?? [],
                    });
                    setImage(res.data?.productInfor?.photo ?? "");
                }
                setLoading(false);
            })();
        }
    }, [id, mode, token]);

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            const res =
                mode === "create"
                    ? await adminService.createData("/api/product/create-all", form, token ?? "")
                    : await adminService.updateData("/api/product/update-all", form.productInfor.id ?? "", form, token ?? "");

            if (res) {
                setAlert({ message: "All product data saved successfully!", type: "success" });
            } else {
                setAlert({ message: "Failed to save product.", type: "error" });
            }
        } catch (err) {
            console.error(err);
            setAlert({ message: "Error saving all product data.", type: "error" });
        } finally {
            setLoading(false);
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
                                    productId={form.productInfor.id}
                                    categories={categories}
                                    brands={brands}
                                    token={token ?? ""}
                                    form={form.productInfor}
                                    mode={mode}
                                    setLoading={setLoading}
                                    setAlert={setAlert}
                                    image={image}
                                    onChange={(updated) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            productInfor: updated
                                        }))
                                    }
                                />
                            )}

                            {activeTab === "specs" && (
                                <ProductSpecificationTab
                                    productId={form.productInfor.id}
                                    specifications={form.specifications ?? []}
                                    mode={mode}
                                    token={token ?? ""}
                                    setLoading={setLoading}
                                    setAlert={setAlert}
                                    onChange={(updated) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            specifications: updated
                                        }))
                                    }
                                />
                            )}

                            {activeTab === "images" && (
                                <ProductImagesTab
                                    productId={form.productInfor.id}
                                    productImages={form.productImages ?? []}
                                    mode={mode}
                                    token={token ?? ""}
                                    setLoading={setLoading}
                                    setAlert={setAlert}
                                    onChange={(updated) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            productImages: updated
                                        }))
                                    }
                                />
                            )}
                        </div>
                        <div className="card-footer">
                            <button
                                type="button"
                                onClick={handleSaveAll}
                                className="btn btn-primary me-2"
                            >
                                <i className="fa-solid fa-floppy-disk"></i> Save All
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
            </CardWrapped>
        </>
    );
};

export default ProductFormPage;
