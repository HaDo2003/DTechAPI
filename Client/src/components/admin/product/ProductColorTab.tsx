import React from "react";
import type { ProductColor } from "../../../types/ProductColor";
import { adminService } from "../../../services/AdminService";

interface Props {
    productId: number | string;
    token: string;
    productColors: ProductColor[];
    mode: "create" | "edit";
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAlert: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" | "info" } | null>>;
    onChange: (updatedForm: ProductColor[]) => void;
}

const ProductColorTab: React.FC<Props> = ({
    productId,
    token,
    productColors,
    mode,
    setLoading,
    setAlert,
    onChange
}) => {
    const [colors, setColors] = React.useState<ProductColor[]>(productColors);
    const [newColor, setNewColor] = React.useState<ProductColor>({
        colorId: 0,
        colorName: "",
        colorCode: "",
    });


    const handleChangeColor = (index: number, field: keyof ProductColor, value: string) => {
        const updatedColors = [...colors];
        updatedColors[index] = { ...updatedColors[index], [field]: value };
        setColors(updatedColors);
        onChange(updatedColors);
    };

    const handleAddColor = () => {
        if (!newColor.colorName || !newColor.colorCode) {
            setAlert({ message: "Please enter both Color Name and Color Code.", type: "error" });
            return;
        }
        const updatedColors = [...colors, { ...newColor }];
        setColors(updatedColors);
        setNewColor({ colorId: 0, colorName: "", colorCode: "" });
        onChange(updatedColors);
    };

    const handleRemoveColor = (index: number) => {
        if (!window.confirm("Are you sure you want to delete this color?")) return;

        const updatedColors = [...colors];
        updatedColors.splice(index, 1);
        setColors(updatedColors);
        onChange(updatedColors);
    };

    const handleSubmitColors = async () => {
        setLoading(true);
        try {
            const res = await adminService.updateData(
                "/api/product/update-colors",
                productId,
                colors,
                token ?? ""
            );
            if (res.success) {
                setAlert({ message: "Colors updated successfully!", type: "success" });
            } else {
                setAlert({ message: res.message || "Failed to update colors!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error updating colors!", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitColors}>
            <table className="table">
                <thead>
                    <tr>
                        <th>Color Name</th>
                        <th>Color Code</th>
                        <th>Preview</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {colors.length > 0 ? (
                        colors.map((color, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="hidden"
                                        value={color.colorId}
                                        name={`Colors[${index}].ColorId`}
                                    />
                                    <input
                                        type="text"
                                        value={color.colorName}
                                        onChange={(e) => handleChangeColor(index, "colorName", e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={color.colorCode}
                                        onChange={(e) => handleChangeColor(index, "colorCode", e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "25px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: color.colorCode || "transparent",
                                    }}
                                ></div>
                            </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveColor(index)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No colors available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add New Color Section */}
            <div className="form-inline">
                <div className="row ps-2">
                    <div className="col-5">
                        <input
                            type="text"
                            value={newColor.colorName}
                            onChange={(e) => setNewColor({ ...newColor, colorName: e.target.value })}
                            className="form-control"
                            placeholder="Enter Color Name"
                        />
                    </div>
                    <div className="col-5 ps-1">
                        <input
                            type="text"
                            value={newColor.colorCode}
                            onChange={(e) => setNewColor({ ...newColor, colorCode: e.target.value })}
                            className="form-control"
                            placeholder="Enter Color Code with # at the beginning(e.g., #FFFFFF)"
                        />
                    </div>
                    <div className="col-2 ps-0">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddColor}
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
                        <button type="button" className="btn btn-primary" onClick={handleSubmitColors}>
                            Save Colors
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default ProductColorTab;