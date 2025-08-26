import Header from "../components/Header";
import '../styles/Home.css'
import HomeSection from "../components/HomeSection";
import AddEntrySection from "../components/AddEntrySection";
import YourEntriesSection from "../components/YourEntriesSection";
import { useState } from "react";
import ScatteredIcons from "../components/ScatteredIcons";

const Home = () => {

    const [isHomeSection, setIsHomeSection] = useState(true);
    const [isAddEntrySection, setIsAddEntrySection] = useState(false);
    const [isYourEntriesSection, setIsYourEntriesSection] = useState(false);

    return (
        <>
            <div className="main-content">
                <Header
                    isHomeSection={isHomeSection}
                    isAddEntrySection={isAddEntrySection}
                    isYourEntriesSection={isYourEntriesSection}

                    setIsHomeSection={setIsHomeSection}
                    setIsAddEntrySection={setIsAddEntrySection}
                    setIsYourEntriesSection={setIsYourEntriesSection}
                />

                <div className="center-content">
                    <ScatteredIcons />

                    {isHomeSection && <HomeSection
                        setIsHomeSection={setIsHomeSection}
                        setIsAddEntrySection={setIsAddEntrySection}
                        setIsYourEntriesSection={setIsYourEntriesSection}
                    />}

                    {isAddEntrySection && <AddEntrySection />}

                    {isYourEntriesSection && <YourEntriesSection />}

                </div>

                {/* footer */}

            </div>
        </>
    );
}

export default Home;