import React, { useState } from "react";
import type { Specification } from "../../../types/Specification";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId: number | string;
    token: string;
    specifications: Specification[];
    mode: "create" | "edit";
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: Specification[]) => void;
}

const SpecificationTab: React.FC<Props> = ({
    productId,
    token,
    specifications: initialSpecs,
    mode,
    setLoading,
    setAlert,
    onChange
}) => {
    const [specifications, setSpecifications] = useState<Specification[]>(initialSpecs);
    const [newSpec, setNewSpec] = useState<Specification>({
        specId: 0,
        specName: "",
        detail: "",
    });

    const handleChangeSpec = (index: number, field: keyof Specification, value: string) => {
        const updatedSpecs = [...specifications];
        updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
        setSpecifications(updatedSpecs);
        onChange(updatedSpecs);
    };

    const handleAddSpec = () => {
        if (!newSpec.specName || !newSpec.detail) {
            setAlert({ message: "Please enter both Specification Name and Detail.", type: "error" });
            return;
        }

        const updatedSpecs = [...specifications, { ...newSpec }];
        setSpecifications(updatedSpecs);
        setNewSpec({ specId: 0, specName: "", detail: "" });
        onChange(updatedSpecs);
    };

    const handleRemoveSpec = (index: number) => {
        if (!window.confirm("Are you sure you want to delete this specification?")) return;

        const updatedSpecs = [...specifications];
        updatedSpecs.splice(index, 1);
        setSpecifications(updatedSpecs);
        onChange(updatedSpecs);
    };

    const handleSubmitSpecifications = async () => {
        setLoading(true);
        const res = await adminService.updateData(
            "/api/product/update-specs",
            productId.toString(),
            specifications,
            token ?? ""
        );
        setLoading(false);

        if (res.success) {
            setAlert({ message: "Specifications updated successfully!", type: "success" });
        } else {
            setAlert({ message: res.message || "Failed to update specifications!", type: "error" });
        }
    };

    return (
        <form onSubmit={handleSubmitSpecifications}>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-5">Specification Name</th>
                        <th className="col-5">Detail</th>
                        <th className="col-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {specifications.length > 0 ? (
                        specifications.map((spec, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="hidden"
                                        value={spec.specId}
                                        name={`Specifications[${index}].SpecId`}
                                    />
                                    <input
                                        type="text"
                                        value={spec.specName}
                                        onChange={(e) => handleChangeSpec(index, "specName", e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={spec.detail}
                                        onChange={(e) => handleChangeSpec(index, "detail", e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-custom"
                                        onClick={() => handleRemoveSpec(index)}
                                    >
                                        <i className="fa-solid fa-trash fa-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No specifications available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add new specification */}
            <div className="form-inline">
                <div className="row ps-2">
                    <div className="col-5">
                        <input
                            type="text"
                            value={newSpec.specName}
                            onChange={(e) => setNewSpec({ ...newSpec, specName: e.target.value })}
                            className="form-control"
                            placeholder="Enter Specification Name"
                        />
                    </div>
                    <div className="col-5 ps-1">
                        <input
                            type="text"
                            value={newSpec.detail}
                            onChange={(e) => setNewSpec({ ...newSpec, detail: e.target.value })}
                            className="form-control"
                            placeholder="Enter Specification Detail"
                            style={{ width: "99%" }}
                        />
                    </div>
                    <div className="col-2 ps-0">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddSpec}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>

            {mode === "edit" && (
                <>
                    {/* Save button */}
                    <div className="mt-3">
                        <button className="btn btn-primary" type="button" onClick={handleSubmitSpecifications}>
                            <i className="fa-solid fa-floppy-disk fa-sm"></i>Save Specifications
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default SpecificationTab;
