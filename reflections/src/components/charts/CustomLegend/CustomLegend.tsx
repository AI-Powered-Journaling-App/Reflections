import { MOOD_COLORS } from "../../../utils/MoodColors";
import { easeInOut, motion } from "framer-motion";

import "../../../styles/charts/CustomLegend.css";

type LegendProps = {
    data: { mood: string; value: number }[];
};

const CustomLegend = ({ data }: LegendProps) => {
    // calculate total moods
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // fallback to include all moods, even if value = 0
    const allMoods = Object.keys(MOOD_COLORS).map((mood) => {

        const moodData = data.find((item) => item.mood === mood);

        return {
            mood,
            value: moodData ? moodData.value : 0,
            percent: total > 0 ? ((moodData?.value || 0) / total) * 100 : 0,
            color: MOOD_COLORS[mood].background,
            textColor: MOOD_COLORS[mood].text,
        };

    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: 1, scale: 1,
                transition: { duration: 1, type: "spring", stiffness: 250, damping: 30, ease: easeInOut }
            }}
            className="legend-card"
        >

            <label className="legend-title">
                Mood Legend
            </label>

            <ul className="legend-list">

                {allMoods.map((item, index) => (

                    <li key={index} className="legend-item">

                        <span
                            className="legend-dot"
                            style={{ backgroundColor: item.color }}
                        />

                        <span className="legend-text">
                            {item.mood}
                        </span>

                        <div className="legend-bar-wrapper">
                            <div
                                className="legend-bar"
                                style={{
                                    backgroundColor: item.color,
                                    width: `${item.percent}%`,
                                }}
                            />
                        </div>

                        <span className="legend-value">
                            {item.percent.toFixed(1)}%
                        </span>

                    </li>

                ))}

            </ul>

        </motion.div>
    );
};

export default CustomLegend;
