import Button from './Button';
import MyDatePicker from './MyDatePicker';
import React, { useState } from 'react';
import { useNotification } from './Notification';
import { handleSaveEntry } from '../utils/AddEntryUtils';
import { getAiInsights } from '../utils/AiInsightsUtils';
import { motion } from 'framer-motion';

import "../styles/AddEntrySection.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCalendar, faMagicWandSparkles, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Insights from './Insights';
import ScatteredIcons from './ScatteredIcons';

const AddEntrySection = () => {

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [textarea, setTextarea] = useState("");

    const [tags, setTags] = useState([]);
    const [tagColors, setTagColors] = useState<{ background: string; text: string }[]>([]);
    const [mood, setMood] = useState("");
    const [moodColor, setMoodColor] = useState<{ background: string; text: string }>();
    const [insight, setInsight] = useState("");
    const [showAiInsights, setShowAiInsights] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSavingEntry, setIsSavingEntry] = useState(false);

    const { showNotification } = useNotification();


    const getInsights = async () => {
        if (!title.trim()) return showNotification("Enter a title please");
        if (!textarea.trim()) return showNotification("Please write something in your entry");
        if (textarea.trim().length < 30) return showNotification("Too short to save an entry");

        await getAiInsights({ textarea, showNotification, setIsLoading, setTags, setTagColors, setMood, setMoodColor, setInsight });

        showNotification("AI Insights Generated!");

        setShowAiInsights(true);
    }

    return (

        <>
            <ScatteredIcons />
            <div className="add-entry-container">

                <div className="title-input">
                    <input
                        type="text"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTitle(e.target.value)
                        }}
                        placeholder="Give your entry a title..."
                    />
                </div>

                <div className="date-input">
                    <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                    <label>Date:</label>
                    <MyDatePicker date={date} setDate={setDate} />
                </div>

                <div className="input-field">
                    <motion.textarea
                        value={textarea}
                        onChange={(e) => setTextarea(e.target.value)}
                        placeholder="What's on your mind today?"
                        whileFocus={isMobile ? { scale: 1 } : { scale: 1.6 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                    />
                </div>

                <div className="buttons">

                    <button
                        className="ai-insights-button"
                        onClick={getInsights}
                    >
                        {isLoading
                            ? <><FontAwesomeIcon icon={faSpinner} spin />Generating AI Insights...</>
                            : <><FontAwesomeIcon icon={faMagicWandSparkles} />AI Insights</>
                        }
                    </button>

                    <Button
                        text={isSavingEntry ? "Saving Entry..." : "Save Entry"}
                        onClick={() => {
                            handleSaveEntry({
                                title, setTitle, date, setDate, textarea, setTextarea,
                                setIsSavingEntry, showNotification, tags, tagColors, mood, moodColor, insight,
                                setTags, setTagColors, setMood, setMoodColor, setInsight
                            });
                        }}
                        icon={faBookmark}
                        isLoading={isSavingEntry}
                    />

                </div>

                {showAiInsights &&
                    <Insights
                        title={title}
                        mood={mood}
                        moodColor={moodColor}
                        tags={tags}
                        tagColors={tagColors}
                        insight={insight}
                        onClose={() => {
                            setShowAiInsights(false);
                        }}
                    />
                }

            </div >
        </>

    );
}

export default AddEntrySection;