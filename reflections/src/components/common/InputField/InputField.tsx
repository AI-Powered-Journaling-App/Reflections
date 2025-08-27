import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/common/InputField.css";

type InputFieldProps = {
    type: string;
    placeholder: string;
    icon?: IconDefinition; //optional
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({ type, placeholder, icon, value, onChange }: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="input-field">

            {icon && <FontAwesomeIcon icon={icon} className="input-icon" />}

            <input
                type={inputType}
                placeholder={placeholder}
                className={`${icon ? "with-icon" : ""} ${isPassword ? "with-eye" : ""}`}  //conditional icon padding
                value={value}
                onChange={onChange}
            />

            {isPassword && (
                <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    className="eye-icon"
                    onClick={() => {
                        setShowPassword(!showPassword);
                    }}
                />
            )}

        </div>
    );
};

export default InputField;
