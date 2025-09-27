import '../styles/adminsite.css'
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "overlayscrollbars/styles/overlayscrollbars.css";

// Component
import Header from "../components/admin/Header";
import Sidebar from "../components/admin/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/shared/Loading";
import AlertForm from "../components/customer/AlertForm";
import { adminService } from "../services/AdminService";
import type { Admin } from "../types/Admin";


const AdminLayout: React.FC = () => {
    const { token } = useAuth();
    const [user, setUser] = useState<Admin | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        if (token === null) {
            return;
        }
        setLoading(true);
        const fetchAdmin = async () => {
            try {
                if (!token) {
                    setAlert({ message: "User token is missing. Please login again.", type: "error" });
                    setLoading(false);
                    return;
                }
                const data = await adminService.getAdmin(token);
                if (data.success) {
                    setUser(data);
                    setAlert(null);
                } else {
                    setAlert({ message: data.message || "Failed to load admin data.", type: "error" });
                }
            } catch (err) {
                setAlert({ message: "Failed to load admin data, please try again. " + err, type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [token])

    return (
        <>
            <div className="admin-layout">
                <div className="app-wrapper">
                    {/* Header */}
                    <Header user={user} />

                    {/* Sidebar */}
                    <Sidebar client={user} />

                    {/* Main content */}
                    <main className="app-main">
                        <Outlet />
                    </main>
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

export default AdminLayout;
