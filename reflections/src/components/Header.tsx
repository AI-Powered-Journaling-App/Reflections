import { easeInOut, motion } from "framer-motion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBookOpen } from '@fortawesome/free-solid-svg-icons';

import "../styles/Header.css";

const navItems = ["Home", "Add Entry", "Your Entries"];

const Header = () => {

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
                            key={item}
                            className="nav-items"
                            initial="rest"
                            whileHover="hover"
                            animate="rest">

                            <span>{item}</span>

                            <motion.div
                                className="underline"
                                variants={{
                                    rest: { width: 0 },
                                    hover: { width: "100%" },
                                }}
                                transition={{ duration: 0.3, ease: easeInOut }}
                            />
                        </motion.div>
                    ))}

                </div>
                <div className="user-container">
                    <div className="user">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Header;