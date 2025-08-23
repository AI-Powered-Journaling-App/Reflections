import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/Button.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type ButtonProps = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
    icon?: IconDefinition,
    isLoading?: boolean,
};

const Button = ({ text, onClick, icon, isLoading }: ButtonProps) => {
    return (
        <>
            <div className="button-container">
                <button onClick={onClick}>
                    {isLoading ? <FontAwesomeIcon className="button-icon" icon={faSpinner} spin /> : icon && <FontAwesomeIcon className="button-icon" icon={icon} />}
                    {text}
                </button>
            </div>
        </>
    );
}

export default Button;