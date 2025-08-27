import { createContext, useContext, useState, type ReactNode } from "react";
import "../styles/Notification.css";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

type NotificationContextType = {
    showNotification: (text: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const Notification = ({ children }: { children: ReactNode }) => {
    
    const [notification, setNotification] = useState<string | null>(null);

    
    const showNotification = (text: string) => {
        setNotification(text);
        setTimeout(() => {
            setNotification(null);
        }, 2400);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>

            {children}

            <div className="notification-container">
                
                <AnimatePresence mode="wait">

                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -30, filter: "blur(5px)" }}
                            animate={{
                                opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
                                transition: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 }
                            }}
                            exit={{
                                opacity: 0, scale: 0.8, y: -30, filter: "blur(5px)",
                                transition: { duration: 0.3, ease: easeInOut }
                            }}
                            className="notification"
                        >
                            {notification}
                        </motion.div>
                    )}

                </AnimatePresence>

            </div>
            
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used inside Notification");
    return context;
};