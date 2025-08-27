import React, { useState } from "react";
import Input from "../../components/customer/Input";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!token || !email) {
        return <NotFound />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post("/api/authentication/resetpassword", {
                email,
                token,
                newPassword,
                confirmPassword,
            });

            setSuccess("Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="row">
            <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                <h2 className="text-center py-2">Reset Password</h2>

                {error && (
                    <div className="alert alert-danger m-2" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success m-2" role="alert">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Hidden fields (like Email + Token) */}
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
    );
};

export default ResetPassword;
