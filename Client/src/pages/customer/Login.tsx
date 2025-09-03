import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/customer/Input";
import OAuthButton from "../../components/customer/auth/OAuthButton";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertForm from "../../components/customer/AlertForm";

const Login: React.FC = () => {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await authService.login({ account, password });
            if (res.success) {
                login(res.token!);
                setError(null);
                navigate("/");
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="row">
            <div className="col-11 col-md-7 col-lg-8 col-xl-5 mx-auto rounded border">
                <h2 className="text-center py-2">Login</h2>
                
                {error && (
                    <AlertForm message={error} type="error" />
                )}

                <form onSubmit={handleLogin}>
                    <Input
                        type="text"
                        placeholder="Account"
                        required
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="row m-2 text-center align-content-center">
                        <div className="form-group">
                            <button type="submit" className="btn btn-dark w-100 button-hover">
                                Login
                            </button>
                        </div>
                    </div>
                </form>

                <div className="row m-2">
                    <div className="col-6 text-start">
                        <Link to="/forgot-password" className="a-custom">
                            Forgot Password ?
                        </Link>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/register" className="a-custom">
                            Register new account
                        </Link>
                    </div>
                </div>

                <div className="m-2 text-center">
                    <div className="d-flex align-items-center m-2">
                        <hr className="flex-grow-1" />
                        <span className="mx-2">Or Log In With</span>
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

export default Login;
