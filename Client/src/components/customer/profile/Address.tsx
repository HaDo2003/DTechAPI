import React, { useEffect, useState } from "react";
import { type CustomerAddress } from "../../../types/CustomerAddress";
import AddressForm from "./AddressForm";
import { customerService } from "../../../services/CustomerService";
import AlertForm from "../AlertForm";
import Loading from "../../shared/Loading";
import { useAuth } from "../../../context/AuthContext";

type AddressProps = {
    addresses?: CustomerAddress[];
};

const Address: React.FC<AddressProps> = ({
    addresses,
}) => {
    const { token } = useAuth();
    const [addressList, setAddressList] = useState<CustomerAddress[]>(addresses ?? []);
    const [showForm, setShowForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showForm) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [showForm]);

    const onAddNew = () => {
        setSelectedAddress(null);
        setShowForm(true);
    };

    const onEdit = (address: CustomerAddress) => {
        setSelectedAddress(address);
        setShowForm(true);
    };

    const onDelete = async (addressId: number | null) => {
        if (!addressId) return;
        try {
            setLoading(true);
            const res = await customerService.deleteAddress(token ?? "", addressId);
            if (res.success) {
                setAlert({ message: "Delete address successfully!", type: "success" });
                setAddressList(prev => prev.filter(addr => addr.addressId !== addressId));
            } else {
                setAlert({ message: res.message || "Fail to delete address!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Address deleted failed, please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const onSetDefault = (addressId: number | null) => {
        // Implement set default functionality here
        console.log("Set default address with ID:", addressId);
    };

    const handleClose = () => {
        setShowForm(false);
    };

    const handleSubmit = async (data: CustomerAddress) => {
        const isEdit = !!selectedAddress;
        try {
            setLoading(true);
            const res = isEdit
                ? await customerService.editAddress(token ?? "", data)
                : await customerService.createAddress(token ?? "", data);

            if (res.success) {
                setAlert({
                    message: res.message || (isEdit ? "Edit address successfully!" : "Add new address successfully!"),
                    type: "success",
                });

                if (isEdit) {
                    setAddressList(prev =>
                        prev.map(addr =>
                            addr.addressId === data.addressId ? { ...addr, ...data } : addr
                        )
                    );
                } else {
                    setAddressList(prev => [
                        ...prev,
                        { ...data, addressId: res.addressId ?? null },
                    ]);
                }
            } else {
                setAlert({ message: res.message || "Operation failed!", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Request failed, please try again.", type: "error" });
        } finally {
            setLoading(false);
            setShowForm(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <Loading />;
            </div>
        );
    }

    return (
        <>
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

            {addressList && addressList.length > 0 ? (
                addressList.map((item) => (
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
                                        onEdit(item);
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
            {showForm && (
                <AddressForm addressPara={selectedAddress} onSubmit={handleSubmit} onClose={handleClose} />
            )}

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </>
    );
};

export default Address;