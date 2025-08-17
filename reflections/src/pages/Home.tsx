import supabase from "../supabase";
import Button from "../components/Button";

const Home = () => {

    const handleLogOut = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Button text="Logout" onClick={handleLogOut} />
        </>
    );
}

export default Home;