import "../styles/InputField.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";

type InputFieldProps = {
    type: string;
    placeholder: string;
    icon?: IconDefinition; //optional
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({ type, placeholder, icon, value, onChange }: InputFieldProps) => {
    return (
        <div className="input-field">
            {icon && <FontAwesomeIcon icon={icon} className="input-icon" />}
            <input
                type={type}
                placeholder={placeholder}
                className={icon ? "with-icon" : ""} //conditional icon padding
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default InputField;
