import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { auth } from "../firebase";

const Home = () => {

    const handleLogOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Button text="Logout" onClick={handleLogOut} />
        </>
    );
}

export default Home;