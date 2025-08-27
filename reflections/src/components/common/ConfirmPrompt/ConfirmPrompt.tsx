import { easeInOut, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import "../../../styles/Overlay.css";
import "../../../styles/common/ConfirmPrompt.css";

type ConfirmPromptType = {
    prompt: string,
    onNo: () => void,
    onYes: () => void,
};

const ConfirmPrompt: React.FC<ConfirmPromptType> = ({ prompt, onNo, onYes }) => {

    const containerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {

            if (containerRef.current && !containerRef.current?.contains(e.target as Node)) {
                onNo();
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, []);

    return (
        <div className="overlay">

            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1, scale: 1,
                    transition: { duration: 1, type: "spring", stiffness: 250, damping: 30, ease: easeInOut }
                }}
                className="confirm-prompt-container"
            >

                <span className="prompt" >{prompt}</span>
                <div className="prompt-buttons">
                    <button onClick={onNo} className="no">No</button>
                    <button onClick={onYes} className="yes">Yes</button>
                </div>

            </motion.div>

        </div>
    );
};

export default ConfirmPrompt;