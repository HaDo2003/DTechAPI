import React from "react";
import type { ProductModel } from "../../../types/ProductModel";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId: number | string;
    token: string;
    productModels: ProductModel[];
    colors: { value: number; label: string; code: string }[];
    mode: "create" | "edit";
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: ProductModel[]) => void;
}

const ProductModelTab: React.FC<Props> = ({
    productId,
    token,
    productModels,
    colors,
    mode,
    setLoading,
    setAlert,
    onChange
}) => {
    const [models, setModels] = React.useState<ProductModel[]>(productModels);

    const handleAddModel = (file: File) => {
        const newModel: ProductModel = {
            modelId: 0,
            colorId: 0,
            modelName: file.name,
            modelUrl: URL.createObjectURL(file),
            modelUpload: file,
        };
        setModels([...models, newModel]);
        onChange([...models, newModel]);
    };

    const handleRemoveModel = (index: number) => {
        if (!window.confirm("Are you sure you want to delete this model?")) return;

        setModels(models.filter((_, i) => i !== index));
        onChange(models.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();

        models.forEach((model, index) => {
            if (model.modelId) {
                formData.append(`models[${index}].modelId`, model.modelId.toString());
                formData.append(`models[${index}].modelName`, model.modelName ?? "");
                formData.append(`models[${index}].modelUpload`, model.modelUpload ?? new Blob());
                formData.append(`models[${index}].colorId`, model.colorId?.toString() ?? "");
            } else if (model.modelUpload) {
                formData.append(`models[${index}].modelName`, model.modelName ?? "");
                formData.append(`models[${index}].modelUpload`, model.modelUpload);
                formData.append(`models[${index}].colorId`, model.colorId?.toString() ?? "");
            };
        });

        try {
            const res = await adminService.updateProductModels(
                "/api/product/glb",
                productId.toString(),
                formData,
                token ?? ""
            );

            if (res.success) {
                setAlert({ message: "Product models updated successfully!", type: "success" });
            } else {
                setAlert({ message: "Failed to update product models.", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Failed to update product models.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-3">Model Name</th>
                        <th className="col-3">Model Url</th>
                        <th className="col-3">Model Upload</th>
                        <th className="col-3">Model Color</th>
                    </tr>
                </thead>
                <tbody>
                    {models.length > 0 ? (
                        models.map((model, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Model name"
                                        value={model.modelName || ""}
                                        onChange={(e) => {
                                            const updated = [...models];
                                            updated[index] = { ...updated[index], modelName: e.target.value };
                                            setModels(updated);
                                            onChange(updated);
                                        }}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Model url"
                                        value={model.modelUrl || ""}
                                        required
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        accept=".glb,.gltf"
                                        className="form-control"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const updated = [...models];
                                                updated[index] = { ...updated[index], modelUpload: file };
                                                setModels(updated);
                                                onChange(updated);
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
                                                    value={model.colorId ?? ""}
                                                    onChange={(e) => {
                                                        const updated = [...models];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            colorId: Number(e.target.value),
                                                        };
                                                        setModels(updated);
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

                                                {model.colorId && (
                                                    <div
                                                        style={{
                                                            width: "22px",
                                                            height: "22px",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                colors.find((c) => c.value === model.colorId)?.code || "#ccc",
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
                                        onClick={() => handleRemoveModel(index)}
                                    >
                                        <i className="fa-solid fa-trash fa-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No models added.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add Model Section */}
            <div className="row ps-2 mb-3">
                <div className="col-5">
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleAddModel(e.target.files[0]);
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
                            <i className="fa-solid fa-floppy-disk fa-sm"></i> Save Models
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default ProductModelTab;