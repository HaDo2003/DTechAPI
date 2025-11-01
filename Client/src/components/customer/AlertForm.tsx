import React, { useEffect, useState } from "react";

interface AlertFormProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose?: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({
    message,
    type = "info",
    duration = 5000,
    onClose
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;
    const alertClass =
        type === "success"
            ? "alert alert-success"
            : type === "error"
                ? "alert alert-danger"
                : "alert alert-info";

    return (
        <div
            className={`${alertClass} position-fixed end-0 m-3 shadow alert-custom z-9999`}
            role="alert"
        >
            {message}
        </div>
    );
};

export default AlertForm;