import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../../services/AdminService";
import { useAuth } from "../../../context/AuthContext";
import CardWrapped from "../../../components/admin/CardWrapped";
import AlertForm from "../../../components/customer/AlertForm";
import Loading from "../../../components/shared/Loading";
import { type ProductFormProp } from "../../../types/Product";
import ProductBasicInfoTab from "../../../components/admin/product/ProductBasicInfoTab";
import ProductSpecificationTab from "../../../components/admin/product/SpecificationTab";
import ProductImagesTab from "../../../components/admin/product/ProductImagesTab";
import ProductColorTab from "../../../components/admin/product/ProductColorTab";
import ProductModelTab from "../../../components/admin/product/ProductModelTab";

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
            quantityInStock: 0,
            price: 0,
            discount: 0,
            priceAfterDiscount: 0,
            madeIn: "",
            description: "",
            photo: "",
        },
        productColors: [],
        specifications: [],
        productImages: [],
        productModels: [],
    });

    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"basic" | "colors" | "specs" | "images" | "models">("basic");
    const [image, setImage] = useState<string>("");
    const [categories, setCategory] = useState<{ value: number; label: string }[]>([]);
    const [brands, setBrand] = useState<{ value: number; label: string }[]>([]);
    const [colors, setColors] = useState<{ value: number; label: string; code: string}[]>([]);

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
                        productColors: res.data.productColors ?? [],
                        productModels: res.data.productModels ?? [],
                        specifications: res.data.specifications ?? [],
                        productImages: res.data.productImages ?? [],
                    });
                    setColors(res.data.productColors?.map(c => ({ value: c.colorId, label: c.colorName, code: c.colorCode })) ?? []);
                    setImage(res.data?.productInfor?.photo ?? "");
                }
                setLoading(false);
            })();
        }
    }, [id, mode, token]);

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            const info = form;

            fd.append("ProductInfor.Name", info.productInfor.name ?? "");
            fd.append("ProductInfor.Warranty", info.productInfor.warranty ?? "");
            fd.append("ProductInfor.QuantityInStock", info.productInfor.quantityInStock?.toString() ?? "0");
            fd.append("ProductInfor.InitialCost", info.productInfor.initialCost?.toString() ?? "0")
            fd.append("ProductInfor.Price", info.productInfor.price?.toString() ?? "0");
            fd.append("ProductInfor.Discount", info.productInfor.discount?.toString() ?? "0");
            fd.append("ProductInfor.EndDateDiscount", info.productInfor.endDateDiscount ?? "");
            fd.append("ProductInfor.DateOfManufacture", info.productInfor.dateOfManufacture ?? "");
            fd.append("ProductInfor.MadeIn", info.productInfor.madeIn ?? "");
            fd.append("ProductInfor.PromotionalGift", info.productInfor.promotionalGift ?? "");
            fd.append("ProductInfor.Description", info.productInfor.description ?? "");
            fd.append("ProductInfor.Photo", info.productInfor.photo ?? "");
            fd.append("ProductInfor.CategoryId", String(info.productInfor.categoryId) ?? "0");
            fd.append("ProductInfor.BrandId", String(info.productInfor.brandId) ?? "0");

            if (info.productInfor.photoUpload) {
                fd.append("ProductInfor.PhotoUpload", info.productInfor.photoUpload);
            }

            if (info.productColors && info.productColors.length > 0) {
                info.productColors.forEach((color, index) => {
                    if (color.colorId) {
                        fd.append(`ProductColors[${index}].ColorId`, color.colorId.toString());
                    }
                    fd.append(`ProductColors[${index}].ColorName`, color.colorName);
                    fd.append(`ProductColors[${index}].ColorCode`, color.colorCode);
                });
            }

            if (info.specifications && info.specifications.length > 0) {
                info.specifications.forEach((spec, index) => {
                    fd.append(`Specifications[${index}].SpecName`, spec.specName);
                    fd.append(`Specifications[${index}].Detail`, spec.detail);
                });
            }

            if (info.productImages && info.productImages.length > 0) {
                info.productImages.forEach((img, _) => {
                    if (img.imageUpload) {
                        fd.append("NewImageUploads", img.imageUpload);
                    }
                });
            }

            if (info.productModels && info.productModels.length > 0) {
                info.productModels.forEach((model, _) => {
                    if (model.modelUpload) {
                        fd.append("NewModelUploads", model.modelUpload);
                    }
                });
            }

            const res =
                mode === "create"
                    ? await adminService.createData("/api/product/create-all", fd, token ?? "")
                    : await adminService.updateData("/api/product/update-all", form.productInfor.id ?? "", fd, token ?? "");
            if(mode === "create" && res?.success) {
                navigate(`/admin/product/edit/${res.data}`);
                setAlert({ message: "Product created successfully!", type: "success" });
            } else if (res?.success) {
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
                                className={`btn btn-sm me-2 ${activeTab === "colors" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveTab("colors")}
                            >
                                Colors
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm me-2 ${activeTab === "specs" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveTab("specs")}
                            >
                                Specifications
                            </button>
                            {mode === "edit" &&
                                <>
                                    <button
                                        type="button"
                                        className={`btn btn-sm me-2 ${activeTab === "images" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setActiveTab("images")}
                                    >
                                        Images
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${activeTab === "models" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setActiveTab("models")}
                                    >
                                        Models
                                    </button>
                                </>
                            }

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

                            {activeTab === "colors" && (
                                <ProductColorTab
                                    productId={form.productInfor.id}
                                    productColors={form.productColors ?? []}
                                    mode={mode}
                                    token={token ?? ""}
                                    setLoading={setLoading}
                                    setAlert={setAlert}
                                    onChange={(updated) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            productColors: updated
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
                                    colors={colors}
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

                            {activeTab === "models" && (
                                <ProductModelTab
                                    productId={form.productInfor.id}
                                    productModels={form.productModels ?? []}
                                    colors={colors}
                                    mode={mode}
                                    token={token ?? ""}
                                    setLoading={setLoading}
                                    setAlert={setAlert}
                                    onChange={(updated) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            productModels: updated
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
