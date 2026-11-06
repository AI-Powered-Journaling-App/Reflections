import type { FirestoreTimestamp } from "../types/entry";

/**
 * Safely formats a Firestore Timestamp, Date object, or date string into a local date string.
 */
export const formatEntryDate = (date: FirestoreTimestamp | Date | string | null | undefined): string => {
    if (!date) return "";
    
    // Check if it's a Firestore Timestamp
    if (typeof (date as FirestoreTimestamp).toDate === "function") {
        try {
            return (date as FirestoreTimestamp).toDate!().toLocaleDateString();
        } catch {
            return "";
        }
    }

    // Check if it's already a JS Date
    if (date instanceof Date) {
        return !isNaN(date.getTime()) ? date.toLocaleDateString() : "";
    }

    // Check if it's a string or number
    if (typeof date === "string" || typeof date === "number") {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : "";
    }

    return "";
};

/**
 * Safely converts an entry's date field into a JavaScript Date object for the date picker.
 */
export const parseEntryDate = (date: FirestoreTimestamp | Date | string | null | undefined): Date => {
    if (!date) return new Date();

    if (typeof (date as FirestoreTimestamp).toDate === "function") {
        try {
            return (date as FirestoreTimestamp).toDate!();
        } catch {
            return new Date();
        }
    }

    if (date instanceof Date) {
        return !isNaN(date.getTime()) ? date : new Date();
    }

    if (typeof date === "string" || typeof date === "number") {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) ? parsed : new Date();
    }

    return new Date();
};
