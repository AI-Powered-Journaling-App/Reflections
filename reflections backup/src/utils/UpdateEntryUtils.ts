import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type UpdateEntryData = {
    title?: string;
    content?: string;
    date?: Date | null;
    mood?: string;
    moodColor?: { background: string; text: string; };
    tags?: string[];
    tagColors?: { background: string; text: string; }[];
    insight?: string;
};

export const updateEntry = async (entryId: string, updatedData: UpdateEntryData) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated");
        }

        // Reference to the specific entry document
        const entryRef = doc(db, "Entries", user.uid, "User Entries", entryId);

        // Prepare the update object
        const updateObject: any = {};
        
        if (updatedData.title !== undefined) {
            updateObject.title = updatedData.title;
        }
        
        if (updatedData.content !== undefined) {
            updateObject.content = updatedData.content;
        }
        
        if (updatedData.date !== undefined) {
            updateObject.date = updatedData.date;
        }

        if (updatedData.mood !== undefined) {
            updateObject.mood = updatedData.mood;
        }

        if (updatedData.moodColor !== undefined) {
            updateObject.moodColor = updatedData.moodColor;
        }

        if (updatedData.tags !== undefined) {
            updateObject.tags = updatedData.tags;
        }

        if (updatedData.tagColors !== undefined) {
            updateObject.tagColors = updatedData.tagColors;
        }

        if (updatedData.insight !== undefined) {
            updateObject.insight = updatedData.insight;
        }

        // Update the document in Firestore
        await updateDoc(entryRef, updateObject);
        
        console.log("Entry updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating entry:", error);
        throw error;
    }
};