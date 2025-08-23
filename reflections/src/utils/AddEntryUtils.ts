import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAiInsights } from "./AiInsightsUtils";

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

export const handleSaveEntry = async ({ title, setTitle, date, setDate, textarea, setTextarea, setIsSavingEntry, showNotification,
    tags, tagColors, mood, moodColor, insight, setTags, setTagColors, setMood, setMoodColor, setInsight
}: SaveEntryProps) => {
    if (!title.trim()) return showNotification("Enter a title please");
    if (!textarea.trim()) return showNotification("Please write something in your entry");
    if (textarea.trim().length < 30) return showNotification("Too short to save an entry");

    setIsSavingEntry(true);

    if (!insight || insight === "") {
        await getAiInsights({
            textarea, showNotification, setIsLoading: setIsSavingEntry,
            setMood, setTags, setTagColors, setMoodColor, setInsight
        });

        setTimeout(() => {
            // waiting for the response
        }, 1000);
    }

    try {
        const user = auth.currentUser;
        if (!user) return showNotification("Expired session please log in");

        const userEntriesRef = collection(db, "Entries", user.uid, "User Entries");

        await addDoc(userEntriesRef, {
            createdAt: serverTimestamp(),
            insight: insight,
            tagColors: tagColors,
            tags: tags,
            moodColor: moodColor
                ? { background: moodColor.background, text: moodColor.text }
                : null,
            mood: mood,
            content: textarea,
            date: date,
            title: title,
        });

        showNotification("Entry added succesfully!")
    } catch (err) {
        console.log(err);
    } finally {
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