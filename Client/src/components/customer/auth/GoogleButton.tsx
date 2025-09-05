import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../../services/AuthService";
import { useAuth } from "../../../context/AuthContext";
import AlertForm from "../AlertForm";

const GoogleButton: React.FC = () => {
  const { login } = useAuth();
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;
            const res = await authService.googleLogin(idToken!);
            if (res.success) {
              login(res.token!);
              setAlert({ message: "Login successful", type: "success" });
            } else {
              setAlert({ message: res.message || "Google login failed", type: "error" });
            }
          } catch (err) {
            setAlert({ message: `Google login failed: ${err}`, type: "error" });
          }
        }}
        onError={() => {
          setAlert({ message: `Google login failed`, type: "error" });
        }}
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

export default GoogleButton;