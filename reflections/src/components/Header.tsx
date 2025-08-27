import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNotification } from "./Notification";
import { useTheme } from "./Theme";
import ConfirmPrompt from "./ConfirmPrompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBookOpen, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import "../styles/Header.css";

type HeaderProps = {
    isHomeSection: boolean,
    isAddEntrySection: boolean,
    isYourEntriesSection: boolean,
    setIsHomeSection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAddEntrySection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsYourEntriesSection: React.Dispatch<React.SetStateAction<boolean>>,
}

const Header = ({
    isHomeSection,
    isAddEntrySection,
    isYourEntriesSection,
    setIsHomeSection,
    setIsAddEntrySection,
    setIsYourEntriesSection
}: HeaderProps) => {

    const navItems = [
        { label: "Home", isActive: isHomeSection, onClick: () => { setIsHomeSection(true); setIsAddEntrySection(false); setIsYourEntriesSection(false); } },
        { label: "Add Entry", isActive: isAddEntrySection, onClick: () => { setIsHomeSection(false); setIsAddEntrySection(true); setIsYourEntriesSection(false); } },
        { label: "Your Entries", isActive: isYourEntriesSection, onClick: () => { setIsHomeSection(false); setIsAddEntrySection(false); setIsYourEntriesSection(true); } },
    ];

    const userButtonRef = useRef<HTMLDivElement | null>(null);
    const userOptionsRef = useRef<HTMLDivElement | null>(null);

    const { showNotification } = useNotification();
    const { theme, toggleTheme } = useTheme();

    const [showUserOptions, setShowUserOption] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);


    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (userOptionsRef.current && !userOptionsRef.current.contains(e.target as Node) && !userButtonRef.current?.contains(e.target as Node)) {
                setShowUserOption(false);
            }
        };

        if (showUserOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [showUserOptions]);

    const handleLogout = async () => {

        try {
            await signOut(auth);
            showNotification("Logged out successfully!");
        } catch (err) {
            console.log(err);
            showNotification("Error logging out.");
        }

    }

    return (
        <div className="header">

            <div className="header-content">

                <div className="title">
                    <FontAwesomeIcon icon={faBookOpen} />
                    <h2>Reflections</h2>
                </div>

                <div className="nav">

                    {navItems.map((item) => (
                        <motion.div
                            key={item.label}
                            className="nav-items"
                            initial="rest"
                            whileHover="hover"
                            animate={item.isActive ? "active" : "rest"}
                            onClick={item.onClick}
                        >

                            <span>{item.label}</span>

                            <motion.div
                                className="underline"
                                variants={{
                                    rest: { width: 0 },
                                    hover: { width: "100%" },
                                    active: { width: "100%" },
                                }}
                                transition={{ duration: 0.3, ease: easeInOut }}
                            />
                        </motion.div>
                    ))}

                </div>

                <div ref={userButtonRef} className="user-container">
                    <div className="user" onClick={() => setShowUserOption(!showUserOptions)}>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {showUserOptions &&
                        <motion.div
                            ref={userOptionsRef}
                            className="user-options-container"
                            initial={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(5px)" }}
                            animate={{
                                opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
                                transition: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 }
                            }}
                            exit={{
                                opacity: 0, scale: 0.97, y: -10,
                                transition: { duration: 0.2, ease: easeInOut }
                            }}
                        >

                            <div className="user-options theme" onClick={toggleTheme}>
                                <AnimatePresence mode="wait">
                                    {theme === "light"
                                        ? <>
                                            <motion.div
                                                key={"Light"}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 } }}
                                                exit={{ opacity: 0, y: 10 }}
                                            >
                                                <FontAwesomeIcon className="icon" icon={faSun} />
                                            </motion.div>

                                            Light
                                        </>
                                        : <>

                                            <motion.div
                                                key={"Dark"}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 } }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <FontAwesomeIcon className="icon" icon={faMoon} />
                                            </motion.div>

                                            Dark
                                        </>
                                    }
                                </AnimatePresence>
                            </div>

                            <div className="user-options logout" onClick={() => setShowConfirmation(true)}>
                                LogOut
                            </div>

                        </motion.div>
                    }

                </AnimatePresence>

            </div>

            {showConfirmation &&
                <ConfirmPrompt
                    prompt="Do you want to Logout?"
                    onNo={() => setShowConfirmation(false)}
                    onYes={handleLogout}
                />
            }

        </div>
    );
}

export default Header;