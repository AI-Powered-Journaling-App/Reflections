import { createContext, useContext, useState, type ReactNode } from "react";
import "../styles/Notification.css";
import { AnimatePresence, motion } from "framer-motion";

type NotificationContextType = {
    showNotification: (text: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const Notification = ({ children }: { children: ReactNode }) => {
    // creating a basic notification state which stores a string
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (text: string) => {
        setNotification(text);
        setTimeout(() => {
            setNotification(null);
        }, 2000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="notification-container">
                <AnimatePresence mode="wait">
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
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