import React from "react";

interface AlertFormProps {
    message: string;
    type?: "success" | "error" | "info";
}

const AlertForm: React.FC<AlertFormProps> = ({ message, type = "info" }) => {
    const alertClass =
        type === "success"
            ? "alert alert-success"
            : type === "error"
            ? "alert alert-danger"
            : "alert alert-info";

    return (
        <div className={`${alertClass} my-2 mx-3`} role="alert">
            {message}
        </div>
    );
};

export default AlertForm;