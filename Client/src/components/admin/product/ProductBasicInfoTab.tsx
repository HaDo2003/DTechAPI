import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import { type ProductForm } from "../../../types/Product";
import RichTextEditor from "../TextEditor";
import DOMPurify from "../../../utils/santitizeConfig";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId?: string | number;
    categories: { value: number; label: string }[]
    brands: { value: number; label: string }[]
    token: string;
    form: ProductForm;
    mode: "create" | "edit";
    image: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: ProductForm) => void;
}
const ProductBasicInfoTab: React.FC<Props> = ({
    productId,
    categories,
    brands,
    form,
    mode,
    token,
    image,
    setAlert,
    setLoading,
    onChange
}) => {
    const [formData, setFormData] = useState<ProductForm>(form);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (image) setPreview(image);
    }, [image]);

    useEffect(() => {
        if (form) setFormData(form);
    }, [form?.id]);

    useEffect(() => {
        onChange(formData);
    }, [formData]);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    // handle file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const updatedForm = {
                ...formData,
                photoUpload: file,
            };
            setFormData(updatedForm);
            setPreview(URL.createObjectURL(file));
            onChange(updatedForm);
        }
    };

    const handleSubmitProductInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        const info = formData;

        fd.append("Name", info.name ?? "");
        fd.append("Warranty", info.warranty ?? "");
        fd.append("QuantityInStock", info.quantityInStock?.toString() ?? "0");
        fd.append("InitialCost", info.initialCost?.toString() ?? "0")
        fd.append("Price", info.price?.toString() ?? "0");
        fd.append("Discount", info.discount?.toString() ?? "0");
        fd.append("EndDateDiscount", info.endDateDiscount ?? "");
        fd.append("DateOfManufacture", info.dateOfManufacture ?? "");
        fd.append("MadeIn", info.madeIn ?? "");
        fd.append("PromotionalGift", info.promotionalGift ?? "");
        fd.append("Description", info.description ?? "");
        fd.append("Photo", info.photo ?? "");
        fd.append("CategoryId", String(info.categoryId) ?? "0");
        fd.append("BrandId", String(info.brandId) ?? "0");

        if (info.photoUpload) {
            fd.append("PhotoUpload", info.photoUpload);
        }

        try {
            setLoading(true);
            const res = await adminService.updateData("/api/product/update-infor", productId ?? "", fd, token ?? "");
            setLoading(false);

            if (res.success) {
                setAlert({ message: "Product info saved successfully!", type: "success" });
            } else {
                setAlert({ message: res.message || "Failed to save product info!", type: "error" });
            }
        } catch (err) {
            setLoading(false);
            setAlert({ message: "Something went wrong!", type: "error" });
        }
    };

    return (
        <form onSubmit={handleSubmitProductInfo}>
            <div className="form-group">
                <div className="row align-items-center">
                    <div className="col-lg-2 col-sm-4 text-center">
                        {preview && <img src={preview} alt="Preview" className="py-2" width={100} />}
                    </div>
                    <div className="col-lg-10 col-sm-8 p-0">
                        <label htmlFor="input-file" className="btn btn-sm btn-danger ms-2">
                            Update Background Photo
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
                        value={formData.name ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                {mode === "edit" && (
                    <div className="col">
                        <InputField
                            label="Slug"
                            name="slug"
                            value={formData.slug ?? ""}
                            readOnly
                        />
                    </div>
                )}
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="category-select">Category</label>
                        <select
                            id="category-select"
                            name="categoryId"
                            value={formData.categoryId ?? 0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col">
                    <div className="form-group">
                        <label htmlFor="brand-select">Brand</label>
                        <select
                            id="brand-select"
                            name="brandId"
                            value={formData.brandId ?? 0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                                <option key={brand.value} value={brand.value}>
                                    {brand.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <InputField
                        label="Made In"
                        name="madeIn"
                        value={formData.madeIn ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Date of Manufacture"
                        name="dateOfManufacture"
                        value={formData.dateOfManufacture ?? ""}
                        onChange={handleChange}
                        type="date"
                        required
                    />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <InputField
                        label="Warranty"
                        name="warranty"
                        value={formData.warranty ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Quantity In Stock"
                        name="quantityInStock"
                        type="number"
                        value={formData.quantityInStock?.toString() ?? "0"}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>


            <div className="row">
                <div className="col">
                    <InputField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price?.toString() ?? "0"}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Discount"
                        name="discount"
                        type="number"
                        value={formData.discount?.toString() ?? "0"}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Price After Discount"
                        name="priceAfterDiscount"
                        type="number"
                        value={formData.priceAfterDiscount?.toString() ?? "0"}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="promotionalGift">Promotional Gift</label>
                        <RichTextEditor
                            value={formData.promotionalGift ?? ""}
                            onChange={(data) => {
                                const cleanData = DOMPurify.sanitize(data);
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    promotionalGift: cleanData,
                                }));
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <RichTextEditor
                            value={formData.description ?? ""}
                            onChange={(data) => {
                                const cleanData = DOMPurify.sanitize(data);
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    description: cleanData,
                                }));
                            }}
                        />
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

                    <div className="text-start mt-3">
                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-floppy-disk fa-sm"></i>Save Change
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default ProductBasicInfoTab;
