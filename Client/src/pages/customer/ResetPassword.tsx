import React, { useState } from "react";
import Input from "../../components/customer/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/AuthService";
import AlertForm from "../../components/customer/AlertForm";
import NotFound from "./NotFound";

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query params: token + email
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    

    if (!token || !email) {
        return <NotFound />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setAlert({ message: "Passwords do not match", type: "error" });
            return;
        }

        try {
            const response = await authService.resetPassword({ token, email, newPassword });
            if (response.success) {
                setAlert({ message: "Password reset successful!", type: "success" });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setAlert({ message: response.message || "Failed to reset password", type: "error" });
            }
        } catch (err: any) {
            setAlert({ message: "Something went wrong. Please try again.", type: "error" });
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                    <h2 className="text-center py-2">Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="email" value={email} />
                        <input type="hidden" name="token" value={token} />

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

                        {/* Submit */}
                        <div className="row m-2 text-center align-content-center">
                            <div className="form-group">
                                <button type="submit" className="btn btn-dark w-100 button-hover">
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
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

export default ResetPassword;
