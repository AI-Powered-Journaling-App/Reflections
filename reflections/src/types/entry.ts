export interface TagColor {
    background: string;
    text: string;
}

export interface MoodColor {
    background: string;
    text: string;
}

export interface FirestoreTimestamp {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: FirestoreTimestamp | Date | string | null;
    mood: string;
    moodColor?: MoodColor | null;
    tags: string[];
    tagColors?: TagColor[];
    insight?: string;
    createdAt?: FirestoreTimestamp | Date | null;
}

export interface MoodData {
    mood: string;
    value: number;
    color: string;
}

export interface OtherStats {
    mostLoggedMood: { mood: string; value: number } | null;
    totalEntriesCount: number;
    streak: number;
}

