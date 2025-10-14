import React, { useState, useEffect } from "react";
import { type Customer } from "../../types/Customer";
import { customerService } from "../../services/CustomerService";

//Components
import Tabs, { type Tab } from "../../components/customer/profile/Tabs";
import Profile from "../../components/customer/profile/Profile";
import Orders from "../../components/customer/profile/Orders";
import Coupons from "../../components/customer/profile/Coupons";
import Address from "../../components/customer/profile/Address";
import ChangePassword from "../../components/customer/profile/ChangePassword";
import AlertForm from "../../components/customer/AlertForm";

import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/shared/Loading";

const CustomerAccount: React.FC = () => {
    const { token, logout } = useAuth();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const fetchCustomer = async () => {
        try {
            if (!token) {
                setAlert({ message: "User token is missing. Please login again.", type: "error" });
                setLoading(false);
                return;
            }
            setLoading(true);
            const data = await customerService.getCustomerProfile(token);
            if (data.success) {
                setCustomer(data);
                setAlert(null);
            } else {
                setAlert({ message: data.message || "Failed to load customer data.", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Failed to load customer data, please try again. " + err, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const tabs: Tab[] = [
        { key: "profile", label: "Customer Information", content: <Profile customer={customer} /> },
        { key: "orders", label: "My Order", content: <Orders orders={customer?.orders} onRefresh={fetchCustomer} /> },
        { key: "coupons", label: "My Coupon", content: <Coupons coupons={customer?.customerCoupons} /> },
        { key: "wishlist", label: "My Wishlists" },
        { key: "address", label: "Address", content: <Address addresses={customer?.customerAddresses} /> },
        { key: "password", label: "Change Password", content: <ChangePassword /> },
    ];

    useEffect(() => {
        if (token === null)
            return;

        fetchCustomer();
    }, [token]);



    return (
        <>
            <div className="app-content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body py-2">
                            <Tabs tabs={tabs} defaultActive="profile" fullName={customer?.fullName} onLogout={logout} />
                        </div>
                    </div>
                </div>
            </div>

            {alert && (
                <AlertForm
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <Loading />
                </div>
            )}
        </>

    );
};

export default CustomerAccount;