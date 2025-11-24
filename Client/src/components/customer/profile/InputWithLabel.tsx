import React from "react";

interface InputProps {
    label: string;
    name: string;
    type?: string;
    value?: string;
    required?: boolean;
    readonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel: React.FC<InputProps> = ({ label, name, type, value, required, readonly, onChange }) => {
    return (
        <div className="row m-2">
            {label === "Gender" ? (
                <>
                    <label className="col-12 col-sm-3 align-content-center mb-1 mb-sm-0">
                        {label}
                    </label>

                    <div className="form-group py-2 custom-radio-container col-12 col-sm-9">
                        <div className="custom-radio-group d-flex align-items-center flex-nowrap gap-3">
                            {["Male", "Female", "Other"].map((g) => (
                                <div key={g} className="d-flex align-items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        id={g}
                                        className="custom-radio"
                                        checked={value === g}
                                        onChange={onChange}
                                        required={required}
                                    />
                                    <label htmlFor={g} className="custom-label-radio ms-1">
                                        {g}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) :
                <>
                    <div className="col-3 align-content-center">
                        <label>{label}</label>
                    </div>
                    <div className="form-group col-9">
                        <input
                            name={name}
                            type={type}
                            className="form-control"
                            value={value}
                            onChange={onChange}
                            readOnly={readonly}
                            required={required}
                        />
                    </div>
                </>

            }

        </div>
    );
};

export default InputWithLabel;