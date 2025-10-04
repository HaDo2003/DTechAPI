import React from "react";
import InputField from "../InputField";
import { type ProductForm } from "../../../types/Product";
import RichTextEditor from "../../../components/admin/TextEditor";
import DOMPurify from "../../../utils/santitizeConfig";

interface Props {
    preview: string;
    form: ProductForm;
    mode: "create" | "edit";
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
}
const ProductBasicInfoTab: React.FC<Props> = ({
        preview,
        form,
        mode,
        handleChange,
        handleFileChange,
        setForm
    }) => {
    return (
        <>
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
                        value={form.name ?? ""}
                        onChange={handleChange}
                    />
                </div>
                {mode === "edit" && (
                    <div className="col">
                        <InputField
                            label="Slug"
                            name="slug"
                            value={form.slug ?? ""}
                            readOnly
                        />
                    </div>
                )}
            </div>

            <div className="row">
                <div className="col">
                    <InputField
                        label="Made In"
                        name="madeIn"
                        value={form.madeIn ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Date of Manufacture"
                        name="dateOfManufacture"
                        value={form.dateOfManufacture ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Warranty"
                        name="warranty"
                        value={form.warranty ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>


            <div className="row">
                <div className="col">
                    <InputField
                        label="Price"
                        name="price"
                        type="number"
                        value={form.price?.toString() ?? "0"}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Discount"
                        name="discount"
                        type="number"
                        value={form.discount?.toString() ?? "0"}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Price After Discount"
                        name="priceAfterDiscount"
                        type="number"
                        value={form.priceAfterDiscount?.toString() ?? "0"}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <InputField
                        label="Made In"
                        name="madeIn"
                        value={form.madeIn ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <InputField
                        label="Stock Status"
                        name="statusProduct"
                        value={form.statusProduct ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="statusProduct-select">Status</label>
                        <select
                            id="statusProduct-select"
                            name="statusProduct"
                            value={form.statusProduct ? "true" : "false"}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <RichTextEditor
                            value={form.description ?? ""}
                            onChange={(data) => {
                                const cleanData = DOMPurify.sanitize(data);
                                setForm((prevForm) => ({
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
                </>
            )}
        </>
    );
};

export default ProductBasicInfoTab;
