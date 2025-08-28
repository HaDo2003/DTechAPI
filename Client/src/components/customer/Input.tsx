import React, { useState } from "react";

interface InputProps {
    type?: string;
    placeholder: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder, required, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="row m-2">
            {placeholder === "Gender" ? (
                <>
                    <label className="col-2 col-form-label text-center align-content-center">
                        {placeholder}
                    </label>
                    <div className="form-group py-2 custom-radio-container col-10">
                        <div className="custom-radio-group d-flex gap-3">
                            {["Male", "Female", "Other"].map((g) => (
                                <div key={g}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        id={g}
                                        className="custom-radio"
                                        checked={value === g}
                                        onChange={onChange}
                                        required
                                    />
                                    <label className="custom-label-radio" htmlFor={g}>
                                        {g}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>

            ) :
                <div className="form-group position-relative">
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        className="form-control"
                        placeholder={placeholder}
                        {...required && { required: true }}
                        value={value}
                        onChange={onChange}
                    />
                    {type === "password" && (
                        <i
                            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute eye pe-3`}
                            style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    )}
                </div>
            }

        </div>
    );
};

export default Input;