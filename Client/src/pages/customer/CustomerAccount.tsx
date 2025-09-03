import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Customer } from "../../types/Customer";
import { customerService } from "../../services/CustomerService";

//Components
import Tabs, { type Tab } from "../../components/customer/profile/Tabs";
import Profile from "../../components/customer/profile/Profile";
import Orders from "../../components/customer/profile/Orders";
import Coupons from "../../components/customer/profile/Coupons";
import Wishlist from "../../components/customer/profile/Wishlists";
import Address from "../../components/customer/profile/Address";
import ChangePassword from "../../components/customer/profile/ChangePassword";


import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/shared/Loading";

const CustomerAccount: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const tabs: Tab[] = [
        { key: "profile", label: "Customer Information", content: <Profile customer={customer}/> },
        { key: "orders", label: "My Order", content: <Orders orders={customer?.orders} /> },
        { key: "coupons", label: "My Coupon", content: <Coupons coupons={customer?.customerCoupons} /> },
        { key: "wishlist", label: "My Wish Lists", content: <Wishlist wishlists={customer?.wishlists} /> },
        { key: "address", label: "Address", content: <Address addresses={customer?.customerAddresses} /> },
        { key: "password", label: "Change Password", content: <ChangePassword /> },
    ];

    useEffect(() => {
        if (token === null) {
            navigate("/login");
            return;
        }

        setLoading(true);

        const fetchCustomer = async () => {
            try {
                if (!token) {
                    setError("User token is missing. Please login again.");
                    setLoading(false);
                    return;
                }
                const data = await customerService.getCustomerProfile(token);
                if (data.success) {
                    setCustomer(data);
                    setSuccess(null);
                    setError(null);
                } else {
                    setError(data.message || "Failed to load customer data");
                }
            } catch (err) {
                setSuccess(null);
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [token, navigate]);

    if (loading) return <Loading />;

    return (
        <div className="app-content">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body py-2">
                        <Tabs tabs={tabs} defaultActive="profile" fullName={customer?.fullName} onLogout={logout}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAccount;