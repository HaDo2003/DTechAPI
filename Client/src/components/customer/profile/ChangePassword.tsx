import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import AlertForm from "../AlertForm";
import Input from "../Input";
import { customerService } from "../../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import Loading from "../../shared/Loading";

const ChangePassword: React.FC = () => {
    const { token, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setAlert({ message: "Passwords do not match", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await customerService.changePassword(token ?? "", {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            if (res.success) {
                setAlert({ message: "Change password successful! Please login again", type: "success" });
                setLoading(false);
                logout();
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setAlert({ message: res.message || "Failed to change password", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Something went wrong. Please try again.", type: "error" });
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
            <div>
                <h5 className="ps-3">Change Password</h5>
                <form onSubmit={handleSubmit}>
                    {/* Old Password */}
                    <Input
                        type="password"
                        placeholder="Old Password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    {/* New Password */}
                    <Input
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    {/* Confirm Password */}
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="ms-3 btn btn-primary">Update Password</button>
                </form>
            </div>

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

export default ChangePassword;