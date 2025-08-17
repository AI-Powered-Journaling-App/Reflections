import { useEffect, useState } from 'react';
import Button from './Button';
import InputField from './InputField';
import googleLogo from "../assets/google.png";
import supabase from "../supabase";

import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import '../styles/LoginCard.css';
import { useNavigate } from 'react-router-dom';

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

    // temp fix for deployment
    console.log(isLoading, googleSigningUp);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate("/home");
        });
    }, []);

    const handleLogIn = async () => {
        if (!email.trim()) return alert("Enter email!");
        if (!password.trim()) return alert("Enter password!");

        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.log(error);
            return;
        } else {
            console.log("User: ", data.user);
            console.log("Session: ", data.session);

            navigate("/home");
        }

        setIsLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setGoogleSigningUp(true);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:5173/home",
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
                        <span className="custom-link" >Forgot password?</span>
                    </div>

                    <div className="button-wrapper">
                        <Button text="Sign In" onClick={handleLogIn} />
                    </div>

                    <div className="google-button-wrapper">
                        <button onClick={handleGoogleSignIn}>
                            <img src={googleLogo} alt="Google" className="google-icon" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="cna-link">
                        <span>Don't have an account? <span className="custom-link" onClick={() => setIsLogin(false)}>Sign Up</span></span>
                    </div>

                </div>
            </div>
        </>
    );
}

export default LoginCard;