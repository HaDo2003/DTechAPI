import React from "react";
import type { ProductModel } from "../../../types/ProductModel";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId: number | string;
    token: string;
    productModels: ProductModel[];
    mode: "create" | "edit";
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: ProductModel[]) => void;
}

const ProductModelTab: React.FC<Props> = ({
    productId,
    token,
    productModels,
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
            if(model.modelId) {
                formData.append(`models[${index}].modelId`, model.modelId.toString());
                formData.append(`models[${index}].modelUpload`, model.modelUpload ?? new Blob());
            } else if (model.modelUpload) {
                formData.append(`models[${index}].modelUpload`, model.modelUpload);
            };
        });

        // try {
        //     const res = await adminService.uploadProductModels(
        //         "/api/product/update-models",
        //         productId.toString(),
        //         formData,
        //         token ?? ""
        //     );

        //     if (res.success) {
        //         setAlert({ message: "Product models updated successfully!", type: "success" });
        //     } else {
        //         setAlert({ message: "Failed to update product models.", type: "error" });
        //     }
        // } catch (error) {
        //     setAlert({ message: "Failed to update product models.", type: "error" });
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-5">Model Name</th>
                        <th className="col-5">Model Preview</th>
                        <th className="col-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {models.length > 0 ? (
                        models.map((model, index) => (
                            <tr key={index}>
                                <td>{model.modelName}</td>
                                <td>
                                    <img
                                        src={model.modelUrl}
                                        alt={model.modelName}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
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