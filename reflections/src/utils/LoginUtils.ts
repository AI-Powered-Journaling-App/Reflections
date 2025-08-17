import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signInWithPopup,
    updateProfile,
    signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { type NavigateFunction } from "react-router-dom";


type SignUpProps = {
    username: string,
    email: string,
    password: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
    showNotification: (text: string) => void,
}

type GoogleSignInProps = {
    setGoogleSigningUp: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
    showNotification: (text: string) => void,
}

type SignInProps = {
    email: string,
    password: string,
    rememberMe: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
    showNotification: (text: string) => void,
}

export const handleSignUp = async ({ username, email, password, setIsLoading, setIsLogin, showNotification }: SignUpProps) => {

    if (!username.trim()) return showNotification("Enter username!");
    if (!email.trim()) return showNotification("Enter email!");
    if (!password.trim()) return showNotification("Enter password!");

    setIsLoading(true);

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: username });
        }

        await signOut(auth);

        setIsLogin(true);
        showNotification("Account Created, Please Sign-In");
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }

};

export const handleGoogleSignUp = async ({ setGoogleSigningUp, navigate, showNotification }: GoogleSignInProps) => {

    setGoogleSigningUp(true);

    try {
        await signInWithPopup(auth, googleProvider);
        navigate("/home");
        showNotification("Sign-In Successfull!");
    } catch (err) {
        console.log(err);
    } finally {
        setGoogleSigningUp(false);
    }

};

export const handleSignIn = async ({ email, password, rememberMe, setIsLoading, navigate, showNotification }: SignInProps) => {
    if (!email.trim()) return showNotification("Enter username!");
    if (!password.trim()) return showNotification("Enter password!");

    setIsLoading(true);

    try {
        //for auto login
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
        showNotification("Sign-In Successfull!");
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }
};