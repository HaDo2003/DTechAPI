import React from "react";

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  readOnly = false,
  type = "text",
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        readOnly={readOnly}
        type={type}
      />
    </div>
  );
};

export default InputField;
