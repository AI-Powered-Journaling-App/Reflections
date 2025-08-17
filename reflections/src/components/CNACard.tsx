import { useState } from "react";
import Button from './Button';
import InputField from './InputField';
import googleLogo from "../assets/google.png";

import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import '../styles/LoginCard.css';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

type CNACardProps = {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const CNACard = ({ setIsLogin }: CNACardProps) => {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleSigningUp, setGoogleSigningUp] = useState(false);

    const handleSignUp = async () => {
        if (!username.trim()) return alert("Enter username!");
        if (!email.trim()) return alert("Enter email!");
        if (!password.trim()) return alert("Enter password!");

        setIsLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: username });
            }
            navigate("/home");
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {

        setGoogleSigningUp(true);

        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
        } catch (err) {
            console.log(err);
        } finally {
            setGoogleSigningUp(false);
        }

    };

    return (
        <>
            <div className="login-card">

                <div className="login-header">
                    <h1>Reflections</h1>
                    <h4>Create a new Account!</h4>
                </div>

                <div className="login-form">

                    <div className="username-field">
                        <span>Username</span>
                        <InputField
                            type="text"
                            placeholder="Your name"
                            icon={faUser}
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setUsername(e.target.value)
                            } />
                    </div>

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

                    <div className="button-wrapper">
                        <Button text={isLoading ? "Signing Up..." : "Sign Up"} onClick={handleSignUp} />
                    </div>

                    <div className="google-button-wrapper">
                        <button onClick={handleGoogleSignUp} disabled={googleSigningUp}>
                            <img src={googleLogo} alt="Google" className="google-icon" />
                            {googleSigningUp ? "Signing in with Google..." : "Continue with Google"}
                        </button>
                    </div>

                    <div className="cna-link">
                        <span>Already have an account? <span className="custom-link" onClick={() => setIsLogin(true)}>Sign In</span></span>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CNACard;