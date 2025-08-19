import { signOut } from "firebase/auth";
import Header from "../components/Header";
import Button from "../components/Button";
import { auth } from "../firebase";
import '../styles/Home.css'
import { useNotification } from "../components/Notification";

const Home = () => {

    const { showNotification } = useNotification();

    const handleLogOut = async () => {
        try {
            await signOut(auth);

            showNotification("Logged out successfully!");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="main-content">
                <Header />
                {/* homecard */}
                {/* add new entry */}
                {/* your entry */}
                {/* footer */}
                <div className="logout-button"><Button text="Logout" onClick={handleLogOut} /></div>
            </div>
        </>
    );
}

export default Home;