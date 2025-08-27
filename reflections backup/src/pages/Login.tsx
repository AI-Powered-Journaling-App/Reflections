import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CNACard from '../components/CNACard';
import LoginCard from '../components/LoginCard';
import loginImageLight from "../assets/login-page-img.png";
import loginImageDark from "../assets/login-page-img-dark.png";
import ScatteredIcons from '../components/ScatteredIcons';
import { useTheme } from '../components/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import '../styles/Login.css';

const cardVariants = {
    initial: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.2 }
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.2 }
    }
}

const Login = () => {

    const [isLogin, setIsLogin] = useState(true);
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="main-wrapper">

                <ScatteredIcons />

                <div className="content">

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <AnimatePresence mode='wait'>
                            {isLogin ?
                                <motion.div
                                    key="login"
                                    variants={cardVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <LoginCard setIsLogin={setIsLogin} />
                                </motion.div>
                                :
                                <motion.div
                                    key="cna"
                                    variants={cardVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <CNACard setIsLogin={setIsLogin} />
                                </motion.div>}
                        </AnimatePresence>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <div className="image-container">
                            <img src={theme === "light" ? loginImageLight : loginImageDark} alt="login-image" className='login-image' />
                            <p>"Your journal is the story only you can tell."</p>
                        </div>

                    </motion.div>

                </div>

                <div className="theme-button" onClick={toggleTheme}>

                    <AnimatePresence mode="wait">
                        {theme === "light"
                        
                            ? <>
                                <motion.div
                                    key={"Light"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 } }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="icon-div"
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
                                    className="icon-div"
                                >
                                    <FontAwesomeIcon className="icon" icon={faMoon} />
                                </motion.div>

                                Dark
                            </>
                        }
                    </AnimatePresence>

                </div>

            </div>
            
        </>
    );
}

export default Login;