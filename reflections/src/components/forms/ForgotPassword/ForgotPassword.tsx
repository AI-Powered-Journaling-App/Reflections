import { useEffect, useRef, useState } from "react";
import InputField from "../../common/InputField/InputField";
import Button from "../../common/Button/Button";
import { useNotification } from "../../common/Notification/Notification";
import { handleForgotPassword } from "../../../utils/LoginUtils";
import { motion } from "framer-motion";
import { faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../../styles/forms/ForgotPassword.css";
import "../../../styles/Overlay.css";

type ForgotPasswordProps = {
    onClose: () => void;
};

const ForgotPassword = ({ onClose }: ForgotPasswordProps) => {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { showNotification } = useNotification();

    const forgotPasswordCardRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {

            if (forgotPasswordCardRef.current && !forgotPasswordCardRef.current.contains(e.target as Node)) {
                onClose();
            };

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleForgotPassword({ email, setIsLoading, showNotification, setEmail, onClose });
    };

    return (
        <div className="overlay">

            <motion.div
                ref={forgotPasswordCardRef}
                className="forgot-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            >

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

            </motion.div>

        </div>
    );
};

export default ForgotPassword;
