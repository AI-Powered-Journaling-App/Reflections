import { useState } from "react";
import Button from './Button';
import InputField from './InputField';
import googleLogo from "../assets/google.png";
import supabase from "../supabase";

import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import '../styles/LoginCard.css';

type CNACardProps = {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const CNACard = ({ setIsLogin }: CNACardProps) => {

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

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            console.log(error);
        }
        else {
            setUsername("");
            setEmail("");
            setPassword("");

            console.log("User created : ", data);

            setIsLogin(true);

            alert("Check your email");
        }

        setIsLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setGoogleSigningUp(true);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/home`,
            },
        });

        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }

        setGoogleSigningUp(false);
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
                        <Button text="Sign Up" onClick={handleSignUp} />
                    </div>

                    <div className="google-button-wrapper">
                        <button onClick={handleGoogleSignUp}>
                            <img src={googleLogo} alt="Google" className="google-icon" />
                            Continue with Google
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