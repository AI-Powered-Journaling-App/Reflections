import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signInWithPopup,
    updateProfile,
    signOut,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { type NavigateFunction } from "react-router-dom";


type SignUpProps = {
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
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
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    rememberMe: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
    showNotification: (text: string) => void,
}

type ForgotPasswordProps = {
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    showNotification: (text: string) => void,
    onClose: () => void,
}


export const handleSignUp = async ({
    username,
    email,
    password,
    setIsLoading,
    setIsLogin,
    showNotification,
    setUsername,
    setEmail,
    setPassword,
}: SignUpProps) => {

    if (!username.trim()) return showNotification("Enter username!");
    if (!email.trim()) return showNotification("Enter email!");
    if (!password.trim()) return showNotification("Enter password!");

    setIsLoading(true);

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: username });
        }

        await setDoc(doc(db, "Users", user.uid), {
            username: username,
            email: email,
            createdAt: serverTimestamp(),
            signUpType: "Email",
        }, { merge: true })

        await signOut(auth);

        setIsLogin(true);
        showNotification("Account Created, Please Sign-In");
    } catch (err) {
        console.log(err);
    } finally {
        setUsername("");
        setEmail("");
        setPassword("");
        setIsLoading(false);
    }

};

export const handleGoogleSignUp = async ({
    setGoogleSigningUp,
    navigate,
    showNotification
}: GoogleSignInProps) => {

    setGoogleSigningUp(true);

    try {
        const userCred = await signInWithPopup(auth, googleProvider);

        const userRef = doc(db, "Users", userCred.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                username: userCred.user.displayName,
                email: userCred.user.email,
                createdAt: serverTimestamp(),
                signUpType: "Google",
            }, { merge: true });
        }

        navigate("/home");
        showNotification("Sign-In Successfull!");
    } catch (err) {
        console.log(err);
    } finally {
        setGoogleSigningUp(false);
    }

};

export const handleSignIn = async ({
    email,
    password,
    rememberMe,
    setIsLoading,
    navigate,
    showNotification,
    setEmail,
    setPassword,
}: SignInProps) => {
    if (!email.trim()) return showNotification("Enter email!");
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
        setEmail("");
        setPassword("");
        setIsLoading(false);
    }
};

export const handleForgotPassword = async ({
    email,
    setIsLoading,
    showNotification,
    setEmail,
    onClose,
}: ForgotPasswordProps) => {
    if (!email.trim()) return showNotification("Enter email!");

    setIsLoading(true);

    try {
        await sendPasswordResetEmail(auth, email);
        showNotification("Password reset link sent! Check your inbox.");
    } catch (err) {
        console.log(err);
    } finally {
        setEmail("");
        onClose();
        setIsLoading(false);
    }
}