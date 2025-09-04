import React, { useEffect, useState } from "react";
import { type CustomerAddress } from "../../../types/CustomerAddress";
import Input from "../Input";

type Props = {
    addressPara: CustomerAddress | null;
    onSubmit: (data: CustomerAddress) => void;
    onClose: () => void;
};

const AddressForm: React.FC<Props> = ({ addressPara, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<CustomerAddress>({
        addressId: null,
        fullName: "",
        phoneNumber: "",
        provinceId: null,
        address: "",
        isDefault: false,
    });

    useEffect(() => {
        if (addressPara) {
            setFormData({
                addressId: addressPara.addressId ?? null,
                fullName: addressPara.fullName ?? "",
                phoneNumber: addressPara.phoneNumber ?? "",
                provinceId: addressPara.provinceId ?? null,
                address: addressPara.address ?? "",
                isDefault: addressPara.isDefault ?? false,
            });
        } else {
            setFormData({
                addressId: null,
                fullName: "",
                phoneNumber: "",
                provinceId: null,
                address: "",
                isDefault: false,
            });
        }
    }, [addressPara]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const isChecked =
            e.target instanceof HTMLInputElement && e.target.type === "checkbox"
                ? e.target.checked
                : undefined;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? isChecked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div id="overlay" className="overlay" onClick={onClose}>
            <div className="mx-auto" id="addressForm" onClick={(e) => e.stopPropagation()}>
                <div className="row">
                    <div className="col-10">
                        <h3 className="text-start py-2">
                            {addressPara ? "Edit Address" : "Add New Address"}
                        </h3>
                    </div>
                    <div className="col-2 text-end d-flex justify-content-end align-items-center">
                        <button
                            id="close"
                            onClick={onClose}
                            className="btn btn-outline-danger btn-sm rounded-circle fw-bold button-custom"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Phone Number"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />

                    <Input
                        type="text"
                        placeholder="Address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    <div className="form-check m-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Set as default address</label>
                    </div>

                    <div className="row m-2 text-center align-content-center">
                        <button type="submit" className="btn btn-dark w-100 button-hover">
                            {addressPara ? "Edit Address" : "Add Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
