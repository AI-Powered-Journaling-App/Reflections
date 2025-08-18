import { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { useNotification } from "./Notification";
import { handleForgotPassword } from "../utils/LoginUtils";

import { faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/ForgotPassword.css";

type ForgotPasswordProps = {
    onClose: () => void;
};

const ForgotPassword = ({ onClose }: ForgotPasswordProps) => {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { showNotification } = useNotification();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleForgotPassword({ email, setIsLoading, showNotification, setEmail, onClose });
    };

    return (
        <div className="forgot-overlay">
            <div className="forgot-modal">
                <div className="forgot-header">
                    <h2>Forgot Password</h2>
                    <span title="Close" className="close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>

                <form onSubmit={onSubmit} className="forgot-form">
                    <InputField
                        type="email"
                        placeholder="Enter your email"
                        icon={faEnvelope}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        text={isLoading ? "Sending..." : "Send Reset Link"}
                        onClick={onSubmit}
                    />
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;