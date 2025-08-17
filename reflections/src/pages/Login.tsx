import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CNACard from '../components/CNACard';
import LoginCard from '../components/LoginCard';

import '../styles/Login.css';

import loginImage from "../assets/login-page-img.png";

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

    return (
        <>
            <div className="main-wrapper">
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
                            <img src={loginImage} alt="login-image" className='login-image' />
                            <p>"Your journal is the story only you can tell."</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

export default Login;