import React, { useEffect, useState } from "react";
import type { ProductImage } from "../../../types/ProductImage";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId: number | string;
    token: string;
    productImages: ProductImage[];
    colors: { value: number; label: string; code: string }[];
    mode: "create" | "edit";
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: ProductImage[]) => void;
}

const ProductImagesTab: React.FC<Props> = ({
    productId,
    token,
    productImages,
    colors,
    mode,
    setLoading,
    setAlert,
    onChange
}) => {
    const [images, setImages] = useState<ProductImage[]>(productImages);
    // Handle preview of new file
    // const handleChangeImage = (index: number, file: File) => {
    //     const updated = [...images];
    //     updated[index] = {
    //         ...updated[index],
    //         image: URL.createObjectURL(file),
    //         imageUpload: file,
    //     };
    //     setImages(updated);
    //     onChange(updated);
    // };

    // Add new image to list
    const handleAddImage = (file: File) => {
        const newImage: ProductImage = {
            imageId: 0,
            image: URL.createObjectURL(file),
            imageUpload: file,
        };
        setImages([...images, newImage]);
        onChange([...images, newImage]);
    };

    const handleRemoveImage = (index: number) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        setImages(images.filter((_, i) => i !== index));
        onChange(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (images.length === 0) {
            setAlert({ message: "Please add at least one image.", type: "error" });
            setLoading(false);
            return;
        }
        if (images.some(img => !img.colorId)) {
            setAlert({ message: "Please select color for all images.", type: "error" });
            setLoading(false);
            return;
        }
        const formData = new FormData();

        images.forEach((img) => {
            if (img.imageId) {
                // Existing image, maybe replacing file
                formData.append("ImageIds", img.imageId.toString());
                formData.append("ImageUploads", img.imageUpload ?? new Blob());
                formData.append("ColorIds", img.colorId?.toString() ?? "");
            } else if (img.imageUpload) {
                // New image
                formData.append("NewUploads", img.imageUpload);
                formData.append("NewColorIds", img.colorId?.toString() ?? "");
            }
        });

        try {
            const res = await adminService.updateImageData(
                "/api/product/update-images",
                productId.toString(),
                formData,
                token ?? ""
            );

            if (res.success) {
                setAlert({ message: "Images updated successfully!", type: "success" });
            } else {
                setAlert({ message: res.message || "Failed to update images!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error updating images!", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-4">Image</th>
                        <th className="col-3">Upload</th>
                        <th className="col-3">Color</th>
                        <th className="col-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        alt=""
                                        src={image.image}
                                        className="img-thumbnail"
                                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const updated = [...images];
                                                updated[index] = {
                                                    ...updated[index],
                                                    image: URL.createObjectURL(file),
                                                    imageUpload: file,
                                                };
                                                setImages(updated);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="d-none" htmlFor={`color-select-${index}`}>Color</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <select
                                                    id={`color-select-${index}`}
                                                    value={image.colorId ?? ""}
                                                    onChange={(e) => {
                                                        const updated = [...images];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            colorId: Number(e.target.value),
                                                        };
                                                        setImages(updated);
                                                        onChange(updated);
                                                    }}
                                                    className="form-control"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <option value="">Select Color</option>
                                                    {colors.map((color) => (
                                                        <option key={color.value} value={color.value}>
                                                            {color.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                {image.colorId && (
                                                    <div
                                                        style={{
                                                            width: "22px",
                                                            height: "22px",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                colors.find((c) => c.value === image.colorId)?.code || "#ccc",
                                                            border: "1px solid #999",
                                                        }}
                                                    ></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveImage(image.imageId)}
                                    >
                                        <i className="fa-solid fa-trash fa-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No images available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* New image upload row */}
            <div className="row ps-2 mb-3">
                <div className="col-5">
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleAddImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            </div>

            {mode === "edit" && (
                <>
                    {/* Save button */}
                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary mt-3">
                            <i className="fa-solid fa-floppy-disk fa-sm"></i> Save Images
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default ProductImagesTab;
