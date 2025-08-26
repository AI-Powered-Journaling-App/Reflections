import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

type MoodData = {
    mood: string,
    value: number,
    color: string,
};

type OtherStats = {
    mostLoggedMood: { mood: string, value: number } | null;
    totalEntriesCount: number;
    streak: number;
};

export const getUserMoodData = (
    setMoodData: (data: MoodData[]) => void,
    setOtherStats: (stats: OtherStats) => void
) => {

    // here we return an empty function if there is no user cause we have to return
    // a unsubscribe function which unsubscribes from the listeners on unmount.
    const user = auth.currentUser;
    if (!user) return () => { };

    const entriesRef = collection(db, "Entries", user.uid, "User Entries");

    const unsubscribe = onSnapshot(entriesRef, (docs) => {
        const moodCounts: Record<string, number> = {};
        const moodColors: Record<string, string> = {};

        let mostLoggedMood: { mood: string, value: number } | null = null;
        let maxMoodCount: number = 0;
        let totalEntriesCount: number = 0;

        const entryDates: Date[] = [];

        docs.forEach((doc) => {
            const data = doc.data();
            const mood = data.mood || "Unknown";
            const color = data.moodColor?.background || "#000000";
            const createdAt = data.createdAt?.toDate?.() || new Date();

            // if adding the mood for the first time...
            // moodCounts["Happy"] = (undefined || 0) + 1;  =  1 (counting no. of "Happy" moods = 1)
            // moodCounts["Happy"] = (1 || 0) + 1; = 2 (counting no. of "Happy" moods = 2) {second time}
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;

            if (moodCounts[mood] > maxMoodCount) {
                maxMoodCount = moodCounts[mood];
                mostLoggedMood = { mood: mood, value: moodCounts[mood] };
            }

            // setting mood colors for each color: moodColors["Happy"] = "#ABCDEF"
            moodColors[mood] = color;
            totalEntriesCount++;
            entryDates.push(createdAt);
        });

        const streak = calculateStreak(entryDates);

        // formating the data so that the pie chart can easily render
        const moodData: MoodData[] = Object.entries(moodCounts).map(
            ([mood, value]) => ({
                mood,
                value,
                color: moodColors[mood],
            })
        );

        setMoodData(moodData);
        setOtherStats({mostLoggedMood, totalEntriesCount, streak});
    });

    return unsubscribe;
};

function calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // sort descending (latest first)
    dates.sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    let currentDate = new Date(dates[0]);

    for (let i = 1; i < dates.length; i++) {
        const previousDate = new Date(dates[i]);
        const diffDays = Math.floor(
            (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            streak++;
            currentDate = previousDate; // move to next day
        } else if (diffDays > 1) {
            break; // streak broken
        }
    }

    return streak;
}
