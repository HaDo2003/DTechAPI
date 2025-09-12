import React from "react";

interface InputProps {
    type?: string;
    placeholder: string;
    name?: string;
    value?: string;
    required?: boolean;
    readonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    col?: string;
}

const InputForCheckOut: React.FC<InputProps> = ({ type, placeholder, name, value, required, readonly, onChange, col }) => {
    return (
        <div className = {`${col} mb-3`}>
            <div className="form-floating">
                <input
                    type={type}
                    name={name}
                    id={name}
                    className="form-control"
                    value={value}
                    readOnly={readonly}
                    required={required}
                    onChange={onChange}
                />
                <label htmlFor={name} className="form-label fs-6">
                    {placeholder}
                </label>
            </div>
        </div>
    );
};

export default InputForCheckOut;