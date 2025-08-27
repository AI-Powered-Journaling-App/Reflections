import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAiInsights } from "./AiInsightsUtils";

import { MOOD_COLORS } from "./MoodColors";

type SaveEntryProps = {
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    date: Date | null,
    setDate: React.Dispatch<React.SetStateAction<Date | null>>,
    textarea: string,
    setTextarea: React.Dispatch<React.SetStateAction<string>>,
    tags: never[],
    setTags: React.Dispatch<React.SetStateAction<never[]>>,
    tagColors: { background: string; text: string; }[],
    setTagColors: React.Dispatch<React.SetStateAction<{ background: string; text: string; }[]>>,
    mood: string,
    setMood: React.Dispatch<React.SetStateAction<string>>,
    moodColor?: { background: string; text: string; },
    setMoodColor: React.Dispatch<React.SetStateAction<{ background: string; text: string; } | undefined>>,
    insight: string,
    setInsight: React.Dispatch<React.SetStateAction<string>>,
    setIsSavingEntry: React.Dispatch<React.SetStateAction<boolean>>,
    showNotification: (text: string) => void,
}

export const handleSaveEntry = async ({
    title, setTitle, date, setDate, textarea, setTextarea, setIsSavingEntry, showNotification,
    tags, tagColors, mood, moodColor, insight, setTags, setTagColors, setMood, setMoodColor, setInsight
}: SaveEntryProps) => {
    if (!title.trim()) return showNotification("Enter a title please");
    if (!textarea.trim()) return showNotification("Please write something in your entry");
    if (textarea.trim().length < 30) return showNotification("Too short to save an entry");

    setIsSavingEntry(true);

    let finalInsight = insight;
    let finalMood = mood;
    let finalTags = tags;
    let finalTagColors = tagColors;
    let finalMoodColor = moodColor; // Use existing moodColor

    try {
        // Generate insights if they don't exist
        if (!insight || insight === "") {
            const insights = await getAiInsights({
                textarea, showNotification, setIsLoading: setIsSavingEntry,
                setMood, setTags, setTagColors, setMoodColor, setInsight
            });

            if (insights) {
                // Update state for UI
                setMood(insights.mood);
                setTags(insights.tags || []);
                setInsight(insights.insights);
                setTagColors(insights.tagColors);

                // Use fresh values for saving
                finalInsight = insights.insights;
                finalMood = insights.mood;
                finalTags = insights.tags || [];
                finalTagColors = insights.tagColors;

                // Get mood color from MOOD_COLORS constant instead of state
                finalMoodColor = MOOD_COLORS[insights.mood] || MOOD_COLORS["Calm"];

                // Also update the state for UI consistency
                setMoodColor(finalMoodColor);
            }
        }

        // Ensure we have a valid mood color
        if (!finalMoodColor && finalMood) {
            finalMoodColor = MOOD_COLORS[finalMood] || MOOD_COLORS["Calm"];
        }

        const user = auth.currentUser;
        if (!user) return showNotification("Expired session please log in");

        const userEntriesRef = collection(db, "Entries", user.uid, "User Entries");

        await addDoc(userEntriesRef, {
            createdAt: serverTimestamp(),
            insight: finalInsight,
            tagColors: finalTagColors,
            tags: finalTags,
            moodColor: finalMoodColor
                ? { background: finalMoodColor.background, text: finalMoodColor.text }
                : null,
            mood: finalMood,
            content: textarea,
            date: date,
            title: title,
        });

        showNotification("Entry added successfully!");

    } catch (err) {
        console.error("Error saving entry:", err);
        showNotification("Failed to save entry");
    } finally {
        // Reset all states
        setTitle("");
        setDate(new Date());
        setTextarea("");
        setTags([]);
        setTagColors([]);
        setMood("");
        setMoodColor(undefined);
        setInsight("");
        setIsSavingEntry(false);
    }
}