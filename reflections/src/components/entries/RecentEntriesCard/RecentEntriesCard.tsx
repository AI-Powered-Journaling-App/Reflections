import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import ContentCard from "../ContentCard/ContentCard";

import "../../../styles/entries/YourEntriesSection.css";

type RecentEntriesCardProps = {
    setIsHomeSection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAddEntrySection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsYourEntriesSection: React.Dispatch<React.SetStateAction<boolean>>
};

const RecentEntriesCard: React.FC<RecentEntriesCardProps> = ({ setIsHomeSection, setIsAddEntrySection, setIsYourEntriesSection }) => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showContentCard, setShowContentCard] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null);


    useEffect(() => {
        const fetchRecentEntries = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const userEntriesRef = collection(
                    db,
                    "Entries",
                    user.uid,
                    "User Entries"
                );

                // getting only 3 recent entries
                const q = query(userEntriesRef, orderBy("createdAt", "desc"), limit(3));

                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setEntries(data);
            } catch (err) {
                console.error("Error fetching recent entries:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentEntries();
    }, []);

    const handleGoToYourEntries = () => {
        setIsHomeSection(false);
        setIsAddEntrySection(false);
        setIsYourEntriesSection(true);
    }

    if (loading) return <p>Loading recent entries...</p>;

    return (
        <div
            className="your-entry-div"
            style={{
                flexDirection: "column",
                width: "95%",
                gap: "1rem",
            }}
        >

            <div className="view-recent-entries-title">
                <span className="recent-entries-title" >Recent Entries</span>
                <span className="view-all-link" onClick={handleGoToYourEntries}>View all</span>
            </div>

            <div className="entry-cards">
                {entries.length === 0 ? (
                    <p>No recent entries yet.</p>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="single-entry-card" onClick={() => {
                            setShowContentCard(true);
                            setSelectedEntry(entry);
                        }}>
                            <div className="entry-left">
                                {/* title + tags */}
                                <div className="entry-header">
                                    <span className="entry-title">{entry.title}</span>
                                    <div className="entry-tags">
                                        {entry.tags &&
                                            entry.tags.length > 0 &&
                                            entry.tags.map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="entry-tag"
                                                    style={{
                                                        backgroundColor: entry.tagColors?.[index]?.background,
                                                        color: entry.tagColors?.[index]?.text,
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {/* date */}
                                <div className="entry-date">
                                    {entry.date?.toDate
                                        ? entry.date.toDate().toLocaleDateString()
                                        : ""}
                                </div>

                                {/* preview content */}
                                <div className="entry-content">
                                    {entry.content
                                        ? entry.content.slice(0, 80) +
                                        (entry.content.length > 80 ? "..." : "")
                                        : ""}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showContentCard &&
                <ContentCard
                    title={selectedEntry.title}
                    date={selectedEntry.date?.toDate ?
                        selectedEntry.date.toDate().toLocaleDateString() :
                        ""}
                    content={selectedEntry.content}
                    onClose={() => setShowContentCard(false)}
                />
            }
            
        </div>
    );
};

export default RecentEntriesCard;
