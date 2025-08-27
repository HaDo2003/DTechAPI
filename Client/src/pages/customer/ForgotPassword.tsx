import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        }

        // TODO: Replace with your API call (axios.post("/api/auth/forgot-password"))
        console.log("Send OTP to:", email);

        // Simulate API response
        setTimeout(() => {
            setMessage("OTP has been sent successfully to your email.");
            setError(null);
        }, 800);
    };

    return (
        <div className="row">
            <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                <h2 className="text-center py-2">Forgot Password</h2>

                {/* MessageUser replacement */}
                {message && (
                    <div className="alert alert-success m-2" role="alert">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger m-2" role="alert">
                        {error}
                    </div>
                )}

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
    );
};

export default ForgotPassword;
