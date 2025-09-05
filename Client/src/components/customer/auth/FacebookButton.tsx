import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { authService } from "../../../services/AuthService";
import AlertForm from "../AlertForm";


const FacebookButton: React.FC = () => {
    const { login } = useAuth();
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);


    const handleFacebookResponse = async (response: any) => {
        try {
            const res = await authService.facebookLogin(response.accessToken);
            if (res.success) {
                login(res.token!);
                setAlert({ message: "Login successful", type: "success" });
            } else {
                setAlert({ message: res.message || "Facebook login failed", type: "error" });
            }
        } catch (err) {
            setAlert({ message: `Facebook login failed: ${err}`, type: "error" });
        }
    };

    return (
        <>
            <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                onSuccess={handleFacebookResponse}
                onFail={(error) => console.log("Facebook login error:", error)}
                render={({ onClick }) => (
                    <button
                        className={`flex-fill text-center border border-1 p-2 btn btn-primary`}
                        onClick={onClick}
                    >
                        <i className={`fa-brands fa-facebook`}></i> Facebook
                    </button>
                )}
            />
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

export default FacebookButton;