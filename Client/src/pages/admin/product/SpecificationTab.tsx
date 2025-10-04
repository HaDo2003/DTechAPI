import React, { useState } from "react";
import type { ProductForm } from "../../../types/Product";
import type { Specification } from "../../../types/Specification";

interface Props {
    productId: number | string;
    specifications: Specification[];
    setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
}

const SpecificationTab: React.FC<Props> = ({ productId, specifications, setForm }) => {
    const [newSpec, setNewSpec] = useState<Specification>({
        specId: 0,
        specName: "",
        detail: "",
    });

    const handleChangeSpec = (index: number, field: keyof Specification, value: string) => {
        const updatedSpecs = [...specifications];
        updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };

        setForm(prev => ({
            ...prev,
            specifications: updatedSpecs,
        }));
    };

    const handleAddSpec = () => {
        if (!newSpec.specName || !newSpec.detail) {
            alert("Please enter both Specification Name and Detail.");
            return;
        }

        const updatedSpecs = [...specifications, { ...newSpec }];

        setForm(prev => ({
            ...prev,
            specifications: updatedSpecs,
        }));

        // reset input
        setNewSpec({ specId: 0, specName: "", detail: "" });
    };

    const handleRemoveSpec = (index: number) => {
        if (!window.confirm("Are you sure you want to delete this specification?")) return;

        const updatedSpecs = [...specifications];
        updatedSpecs.splice(index, 1);

        setForm(prev => ({
            ...prev,
            specifications: updatedSpecs,
        }));
    };

    return (
        <div>
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
        </div>
    );
};

export default SpecificationTab;
