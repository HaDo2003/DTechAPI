import React, { useState } from "react";
import { authService } from "../../services/AuthService";
import AlertForm from "../../components/customer/AlertForm";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setAlert({ message: "Please enter your email address.", type: "error" });
            return;
        }

        try {
            const response = await authService.forgotPassword({ email });
            if (response.success) {
                setAlert({ message: response.message || "OTP has been sent to your email.", type: "info" });
            } else {
                setAlert({ message: response.message || "Failed to send OTP. Please try again.", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Failed to send OTP. Please try again.", type: "error" });
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                    <h2 className="text-center py-2">Forgot Password</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="m-2">
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="m-2 text-center align-content-center">
                            <div className="form-group">
                                <button type="submit" className="btn btn-dark w-100 button-hover">
                                    Send Email
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="row m-2">
                        <div className="text-center">
                            <label className="control-label">
                                <a className="a-custom" href="#">
                                    Use Phone Number
                                </a>
                            </label>
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
        </>
    );
};

export default ForgotPassword;
