import "../styles/OtherStatistics.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faFire } from "@fortawesome/free-solid-svg-icons";
import { MOOD_ICONS } from "../utils/MoodIcons";
import { easeInOut, motion } from "framer-motion";

type OtherStats = {
    mostLoggedMood: { mood: string, value: number } | null;
    totalEntriesCount: number;
    streak: number;
};

const OtherStatistics = ({ stats }: { stats: OtherStats }) => {

    const mood = stats.mostLoggedMood?.mood;
    const moodIcon = mood ? MOOD_ICONS[mood] : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: 1, scale: 1,
                transition: { duration: 1, type: "spring", stiffness: 250, damping: 30, ease: easeInOut }
            }}
            className="other-stats-card"
        >

            <h3 className="stats-heading">
                Other Stats
            </h3>

            <div className="stats">
                
                <div className="stat-card">
                    <FontAwesomeIcon icon={faBook} className="stat-icon" />
                    <p>Total Entries: {stats.totalEntriesCount}</p>
                </div>

                <div className="stat-card">
                    <p>
                        Most Logged Mood:<br />
                        {moodIcon && <FontAwesomeIcon icon={moodIcon} className="stat-icon" />}
                        {stats.mostLoggedMood
                            ? `${stats.mostLoggedMood.mood} [ ${stats.mostLoggedMood.value} ]`
                            : "None"}
                    </p>
                </div>

                <div className="stat-card">
                    <FontAwesomeIcon icon={faFire} className="stat-icon" />
                    <p>Streak: {stats.streak} days</p>
                </div>

            </div>

        </motion.div>
    );
};

export default OtherStatistics;
