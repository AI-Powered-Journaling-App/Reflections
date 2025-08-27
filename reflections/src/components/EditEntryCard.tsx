import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import MyDatePicker from "./MyDatePicker";
import { updateEntry } from "../utils/UpdateEntryUtils";
import { getAiInsights } from "../utils/AiInsightsUtils";
import { useNotification } from './Notification';

import "../styles/Overlay.css";
import "../styles/EditEntryCard.css";

type EditEntryCardProps = {
    entry: {
        id: string;
        title: string;
        date: any; // Firebase timestamp
        content: string;
    };
    onClose: () => void;
    onUpdate: (updatedEntry: any) => void; // Callback to update the parent state
};

const EditEntryCard: React.FC<EditEntryCardProps> = ({ entry, onClose, onUpdate }) => {

    const [title, setTitle] = useState(entry.title);
    const [date, setDate] = useState<Date | null>(
        entry.date?.toDate ? entry.date.toDate() : new Date()
    );
    const [content, setContent] = useState(entry.content);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    const { showNotification } = useNotification();

    const editEntryCardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {

            if (editEntryCardRef.current && !editEntryCardRef.current.contains(e.target as Node)){
                onClose();
            };

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);  
        };

    }, []);

    // Helper function to check if content has changed significantly
    const hasSignificantContentChange = () => {
        const originalContent = entry.content.trim();
        const newContent = content.trim();

        // Consider it significant if:
        // 1. Content length changed by more than 20%
        // 2. Or content is completely different (less than 60% similarity)
        const lengthDiff = Math.abs(newContent.length - originalContent.length);
        const lengthChangePercent = (lengthDiff / originalContent.length) * 100;

        return lengthChangePercent > 20 || newContent !== originalContent;
    };

    // Check if there are any changes
    const hasChanges = () => {
        const originalDate = entry.date?.toDate ? entry.date.toDate() : new Date();
        return (
            title.trim() !== entry.title ||
            content.trim() !== entry.content ||
            (date && originalDate && date.getTime() !== originalDate.getTime())
        );
    };

    const handleSaveChanges = async () => {
        // Validation
        if (!title.trim()) {
            showNotification("Title cannot be empty");
            return;
        }

        if (!content.trim()) {
            showNotification("Content cannot be empty");
            return;
        }

        if (content.trim().length < 30) {
            showNotification("Content is too short");
            return;
        }

        // Check if there are actually changes
        if (!hasChanges()) {
            showNotification("No changes to save");
            return;
        }

        setIsUpdating(true);

        try {
            let updatedData: any = {
                title: title.trim(),
                content: content.trim(),
                date: date,
            };

            // If content has changed significantly, regenerate AI insights
            if (hasSignificantContentChange()) {
                setIsGeneratingInsights(true);
                // showNotification("Generating new insights...");

                try {
                    // Temporary state setters for AI insights (we don't use these API needs them)
                    const tempSetters = {
                        setTags: () => { },
                        setTagColors: () => { },
                        setMood: () => { },
                        setMoodColor: () => { },
                        setInsight: () => { },
                        setIsLoading: () => { }
                    };

                    const insights = await getAiInsights({
                        textarea: content.trim(),
                        showNotification,
                        ...tempSetters
                    });

                    if (insights) {
                        // Add the new insights to the update data
                        updatedData = {
                            ...updatedData,
                            mood: insights.mood,
                            moodColor: insights.moodColor,
                            tags: insights.tags || [],
                            tagColors: insights.tagColors || [],
                            insight: insights.insights
                        };
                    }

                } catch (error) {
                    console.error("Error generating insights:", error);
                    showNotification("Failed to generate new insights, saving without them");
                } finally {
                    setIsGeneratingInsights(false);
                }

            }

            await updateEntry(entry.id, updatedData);

            // Create updated entry object for parent state update
            const updatedEntry = {
                ...entry,
                ...updatedData,
            };

            onUpdate(updatedEntry);
            showNotification("Changes saved successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating entry:", error);
            showNotification("Failed to save changes");
        } finally {
            setIsUpdating(false);
        }

    };

    return (
        <div className="overlay">

            <motion.div
                ref={editEntryCardRef}
                className="edit-entry-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            >

                <FontAwesomeIcon
                    icon={faClose}
                    className="close-btn"
                    onClick={onClose}
                />

                <div className="edit-field">
                    <input
                        id="edit-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="edit-title-input"
                        placeholder="Enter title..."
                    />
                </div>

                <div className="edit-field">
                    <label htmlFor="edit-date">Date:</label>
                    <MyDatePicker date={date} setDate={setDate} />
                </div>

                <div className="edit-field">
                    <label htmlFor="edit-content">Content:</label>
                    <textarea
                        id="edit-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="edit-content-textarea"
                        placeholder="Write your entry content..."
                        rows={10}
                    />
                </div>

                <div className="edit-actions">
                    {isGeneratingInsights && (
                        <p className="insight-status">Generating new insights...</p>
                    )}
                    <button
                        className={`save-changes-btn ${hasChanges() ? 'has-changes' : ''}`}
                        onClick={handleSaveChanges}
                        disabled={isUpdating || isGeneratingInsights || !hasChanges()}
                    >
                        {isUpdating || isGeneratingInsights ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </motion.div>

        </div>
    );
};

export default EditEntryCard;