import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/Overlay.css";
import "../../../styles/entries/ContentCard.css";
import { useEffect, useRef } from "react";

type ContentCardProps = {
    title: string,
    date: string
    content: string,
    onClose: () => void,
};

const ContentCard: React.FC<ContentCardProps> = ({ title, date, content, onClose }) => {

    const contentCardRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {

            if (contentCardRef.current && !contentCardRef.current.contains(e.target as Node)) {
                onClose();
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return (
        <div className="overlay">

            <motion.div
                ref={contentCardRef}
                className="content-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            >

                <FontAwesomeIcon icon={faClose} className="close-btn" onClick={onClose} />

                <h2 className="content-title">Title: {title}</h2>

                <p className="content-date">
                    <strong>Date:</strong> {date}
                </p>

                <div className="content-body">
                    <p>{content}</p>
                </div>

            </motion.div>

        </div>
    );
}

export default ContentCard;
