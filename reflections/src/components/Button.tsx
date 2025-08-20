import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/Button.css";

type ButtonProps = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
    icon?: IconDefinition,
};

const Button = ({ text, onClick, icon }: ButtonProps) => {
    return (
        <>
            <div className="button-container">
                <button onClick={onClick}>
                    {icon && <FontAwesomeIcon className="button-icon" icon={icon} />}
                    {text}
                </button>
            </div>
        </>
    );
}

export default Button;