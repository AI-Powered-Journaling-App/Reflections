import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";

import "../styles/Overlay.css";
import "../styles/Insights.css";

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
    return (
        <div className="overlay">

            <motion.div
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
                            backgroundColor: moodColor?.background,
                            color: moodColor?.text,
                        }}
                    >
                        {mood}
                    </span>
                </p>

                <div className="insight-tags">
                    <strong>Tags: </strong>
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="tag"
                            style={{
                                backgroundColor: tagColors[index]?.background,
                                color: tagColors[index]?.text,
                            }}
                        >
                            {tag}
                        </span>
                    ))}
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