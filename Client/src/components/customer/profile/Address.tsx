import React from "react";
import { type CustomerAddress } from "../../../types/CustomerAddress";

type AddressProps = {
    addresses?: CustomerAddress[];
};

const Address: React.FC<AddressProps> = ({
    addresses,
}) => {
    const onAddNew = () => {
        const overlay = document.getElementById("editOverlay");
        const formContainer = document.getElementById("editAddressForm");
        if (overlay && formContainer) {
            overlay.classList.remove("d-none");
            formContainer.classList.remove("d-none");
            // Render the EditAddress component here if needed
        }
    };
    const onEdit = (addressId: string) => {
        const overlay = document.getElementById("editOverlay");
        const formContainer = document.getElementById("editAddressForm");
        if (overlay && formContainer) {
            overlay.classList.remove("d-none");
            formContainer.classList.remove("d-none");
            // Render the EditAddress component here with addressId if needed
        }
    };
    const onDelete = (addressId: string) => {
        // Implement delete functionality here
        console.log("Delete address with ID:", addressId);
    }
    const onSetDefault = (addressId: string) => {
        // Implement set default functionality here
        console.log("Set default address with ID:", addressId);
    }
    return (
        <div>
            {/* Header row */}
            <div className="row">
                <div className="col-6 text-start">
                    <h4>My Address</h4>
                </div>
                <div className="col-6 text-end">
                    <button className="btn btn-danger" onClick={onAddNew}>
                        <i className="fa-solid fa-plus"></i> Add new address
                    </button>
                </div>
            </div>

            <hr className="my-4" />

            {addresses && addresses.length > 0 ? (
                addresses.map((item) => (
                    <div key={item.addressId} className="address-card mb-4 border-bottom pb-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 className="mb-0">{item.fullName}</h5>
                                <p className="text-secondary mb-1">{item.phoneNumber}</p>
                            </div>
                            <div>
                                <a
                                    href="#"
                                    className="text-primary me-3"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onEdit(item.addressId);
                                    }}
                                >
                                    Update
                                </a>

                                <button
                                    type="button"
                                    className="btn btn-link text-danger p-0 m-0 align-baseline"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this address?")) {
                                            onDelete(item.addressId);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="address-details mt-2">
                            <p className="mb-1">
                                {item.address || ""}
                            </p>
                        </div>

                        {!item.isDefault ? (
                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm px-3"
                                    onClick={() => onSetDefault(item.addressId)}
                                >
                                    Set as Default
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <span className="badge bg-light text-dark border">Default</span>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-muted">No addresses found.</p>
            )}

            {/* Overlay for edit form (optional, depends on implementation) */}
            <div id="editOverlay" className="overlay d-none">
                <div className="mx-auto d-none" id="editAddressForm">
                    {/* The EditAddress form can be rendered here conditionally */}
                </div>
            </div>
        </div>
    );
};

export default Address;