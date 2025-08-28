import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/customer/Input";
import OAuthButton from "../../components/customer/auth/OAuthButton";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/AuthService";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        account: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            const { confirmPassword, ...registerData } = formData;
            const res = await authService.register(registerData);
            if (res.success) {
                alert("Registration successful");
                login(res);
                navigate("/");
            } else {
                alert(res.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert("Registration failed, please try again, " + err);
        }
    };

    return (
        <div className="row">
            <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                <h2 className="text-center py-2">Register New Account</h2>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <Input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />

                    {/* Account */}
                    <Input
                        type="text"
                        placeholder="Account"
                        required
                        value={formData.account}
                        onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    />
                    {/* Email */}
                    <Input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    {/* Phone Number */}
                    <Input
                        type="text"
                        placeholder="Phone Number"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />

                    {/* Gender */}
                    <Input
                        placeholder="Gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />

                    {/* Date of Birth */}
                    <Input
                        type="date"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />

                    {/* Address */}
                    <Input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    {/* Password */}
                    <Input
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    {/* Confirm Password */}
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />

                    {/* Submit */}
                    <div className="row m-2 text-center align-content-center">
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-dark w-100 button-hover"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </form>

                <div className="row m-2 text-end">
                    <label className="control-label">
                        Already have account ?{" "}
                        <span>
                            <Link to="/login" className="click-here">
                                Click here
                            </Link>
                        </span>
                    </label>
                </div>

                <div className="m-2 text-center">
                    <div className="d-flex align-items-center m-2">
                        <hr className="flex-grow-1" />
                        <span className="mx-2">Or Sign Up With</span>
                        <hr className="flex-grow-1" />
                    </div>
                </div>

                <div className="d-flex justify-content-between my-2 mx-3 gap-3">
                    <OAuthButton btncolor="danger" icon="google" />
                    <OAuthButton btncolor="primary" icon="facebook" />
                </div>
            </div>
        </div>
    );
};

export default Register;