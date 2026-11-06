import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FALLBACK_TAG_PALETTE } from "../../../utils/AiInsightsUtils";

import "../../../styles/Overlay.css";
import "../../../styles/ui/Insights.css";
import { useEffect, useRef } from "react";

type InsightsProps = {
    title: string,
    mood: string,
    moodColor?: { background: string; text: string },
    tags: string[],
    tagColors: { background: string; text: string }[],
    insight: string,
    onClose: () => void,
};

const Insights: React.FC<InsightsProps> = ({ title, mood, moodColor, tags, tagColors, insight, onClose }) => {

    const insightsCardRef = useRef<HTMLDivElement | null>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {

            if (insightsCardRef.current && !insightsCardRef.current.contains(e.target as Node)){
                onCloseRef.current();
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return (
        <div className="overlay">

            <motion.div
                ref={insightsCardRef}
                className="insight-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            >

                <FontAwesomeIcon icon={faClose} className="close-btn" onClick={onClose} />

                <h2 className="insight-title">Title: {title}</h2>

                <p
                    className="insight-mood"
                >
                    <strong>
                        Mood:
                    </strong>
                    <span className="tag"
                        style={{
                            backgroundColor: moodColor?.background || "#BFDBFE",
                            color: moodColor?.text || "#1E3A8A",
                        }}
                    >
                        {mood}
                    </span>
                </p>

                <div className="insight-tags">
                    <strong>Tags: </strong>
                    {tags.map((tag, index) => {
                        const color = tagColors?.[index] || FALLBACK_TAG_PALETTE[index % FALLBACK_TAG_PALETTE.length];
                        return (
                            <span
                                key={index}
                                className="tag"
                                style={{
                                    backgroundColor: color.background,
                                    color: color.text,
                                }}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>

                <span className="insight-analysis">
                    <strong>
                        <FontAwesomeIcon icon={faMagicWandSparkles} />
                        AI Insight
                    </strong>
                    <p className="insight-text">{insight}</p>
                </span>

            </motion.div>

        </div>
    );
}

export default Insights;
