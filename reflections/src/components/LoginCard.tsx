import { useEffect, useState } from 'react';
import Button from './Button';
import InputField from './InputField';
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { handleGoogleSignUp, handleSignIn } from '../utils/LoginUtils';

import googleLogo from "../assets/google.png";
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import '../styles/LoginCard.css';
import { useNotification } from './Notification';

type LoginCardProps = {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginCard = ({ setIsLogin }: LoginCardProps) => {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleSigningUp, setGoogleSigningUp] = useState(false);

    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const { showNotification } = useNotification();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });
        return () => unsubscribe();
    }, []);


    return (
        <>
            <div className="login-card">

                <div className="login-header">
                    <h1>Reflections</h1>
                    <h4>Welcome back, let's get journaling!</h4>
                </div>

                <div className="login-form">

                    <div className="email-field">
                        <span>Email</span>
                        <InputField
                            type="text"
                            placeholder="Your@gmail.com"
                            icon={faEnvelope}
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            } />
                    </div>

                    <div className="password-field">
                        <span>Password</span>
                        <InputField type="password"
                            placeholder="Enter your password"
                            icon={faLock}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <div className='options'>
                        <div className="checkbox-container">
                            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                            <span className="custom-link" onClick={() => setIsChecked(!isChecked)} > Remember me?</span>
                        </div>
                        <span className="custom-link" onClick={() => setIsForgotOpen(true)} >Forgot password?</span>
                    </div>

                    <div className="button-wrapper">
                        <Button text={isLoading ? "Signing In..." : "Sign In"} onClick={() => {
                            handleSignIn({ email, password, setIsLoading, rememberMe: isChecked, navigate, showNotification, setEmail, setPassword });
                        }} />
                    </div>

                    <div className="google-button-wrapper">
                        <button onClick={() => {
                            handleGoogleSignUp({ setGoogleSigningUp, navigate, showNotification });
                        }} disabled={googleSigningUp}>
                            <img src={googleLogo} alt="Google" className="google-icon" />
                            {googleSigningUp ? "Signing in with Google..." : "Continue with Google"}
                        </button>
                    </div>

                    <div className="cna-link">
                        <span>Don't have an account? <span className="custom-link" onClick={() => setIsLogin(false)}>Sign Up</span></span>
                    </div>
                </div>
            </div>
            {isForgotOpen && <ForgotPassword onClose={() => setIsForgotOpen(false)} />}
        </>
    );
}

export default LoginCard;