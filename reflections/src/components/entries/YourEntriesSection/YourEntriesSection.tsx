import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagicWandSparkles, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { deleteEntry } from "../../../utils/DeleteEntryUtils"
import { useNotification } from '../../common/Notification/Notification';
import ConfirmPrompt from "../../common/ConfirmPrompt/ConfirmPrompt";
import ContentCard from "../ContentCard/ContentCard";
import Insights from "../../ui/Insights/Insights";
import EditEntryCard from "../../forms/EditEntryCard/EditEntryCard";

import "../../../styles/Overlay.css"
import "../../../styles/entries/YourEntriesSection.css";

const YourEntriesSection = () => {

    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [moreOptions, setMoreOptons] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const [showInsight, setShowInsights] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
    const [deleteConfrim, setDeleteConfrim] = useState(false);
    const [showContentCard, setShowContentCard] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);

    const moreOptionsRef = useRef<HTMLDivElement>(null);
    const triggerButtonRef = useRef<HTMLButtonElement>(null);

    const { showNotification } = useNotification();


    const fetchEntries = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const userEntriesRef = collection(
                db,
                "Entries",
                user.uid,
                "User Entries"
            );

            // Query: order by createdAt (latest first)
            const q = query(userEntriesRef, orderBy("createdAt", "desc"));

            const snapshot = await getDocs(q);

            //snapshot.docs is an array of all the documents in that query result.Each doc is a QueryDocumentSnapshot object, which has methods like .id and .data().
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEntries(data);
        } catch (err) {
            console.error("Error fetching entries:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside both popup and trigger button
            const isOutsidePopup = moreOptionsRef.current && !moreOptionsRef.current.contains(target);
            const isOutsideTrigger = triggerButtonRef.current && !triggerButtonRef.current.contains(target);

            if (moreOptions && isOutsidePopup && isOutsideTrigger) {
                setMoreOptons(false);
            }
        };

        // Only add listener when popup is open
        if (moreOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [moreOptions]);

    const handleMoreOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX - 70,
        });
        setMoreOptons(!moreOptions);
    };

    const hadnleAiInsightpopup = (entry: any) => {
        setSelectedEntry(entry);
        setShowInsights(true);
    };

    const handleEditEntry = () => {
        setShowEditPopup(true);
        setMoreOptons(false);
    };

    const handleUpdateEntry = async (updatedEntry: any) => {
        // Update the entries array with the new entry array
        setEntries((prev) =>
            prev.map((entry) =>
                entry.id === updatedEntry.id ? updatedEntry : entry
            )
        );

        // refetching entries.
        // This makes sure we update tags, moods, and insights.
        await fetchEntries();
    };

    const handleDeleteEntry = async () => {
        if (!selectedEntry) return;

        try {
            await deleteEntry(selectedEntry.id);

            setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));

            setDeleteConfrim(false);
            setMoreOptons(false);
            setSelectedEntry(null);

            showNotification("Entry deleted successfully!");
        } catch (err) {
            console.log(err)
            showNotification("Error deleting the entry!")
        }
    };

    if (loading) return <p>Loading entries...</p>;

    return (
        <>
            <div className="your-entry-div">

                <div className="entry-cards">

                    {entries.length === 0 ? (
                        <p>No entries yet.</p>
                    ) : (
                        entries.map((entry) => (

                            <div key={entry.id} className="single-entry-card" onClick={() => {
                                setSelectedEntry(entry),
                                    setShowContentCard(true)
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
                                                            backgroundColor:
                                                                entry.tagColors?.[index]?.background,
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

                                    {/* content */}
                                    <div className="entry-content">
                                        {entry.content
                                            ? entry.content.slice(0, 80) + (entry.content.length > 80 ? "..." : "")
                                            : ""}
                                    </div>

                                </div>

                                <div className="entry-right">

                                    <div className="action-buttons">

                                        <button ref={triggerButtonRef} onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEntry(entry);
                                            handleMoreOptionClick(e);
                                        }} >
                                            <FontAwesomeIcon
                                                className="more-options-button"
                                                icon={faEllipsis}
                                            />
                                        </button>

                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            hadnleAiInsightpopup(entry)
                                        }}>
                                            <FontAwesomeIcon
                                                className="ai-insight-button"
                                                icon={faMagicWandSparkles}
                                            />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))
                    )}

                </div>

            </div>

            <AnimatePresence>
                {moreOptions && (
                    <motion.div
                        ref={moreOptionsRef}
                        style={{ top: popupPosition.top, left: popupPosition.left }}
                        className="more-option-container"
                        initial={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                mass: 0.8,
                            },
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.97,
                            y: -10,
                            transition: { duration: 0.2, ease: easeInOut },
                        }}
                    >

                        <div className="more-option edit" onClick={handleEditEntry}>
                            <span>Edit</span>
                        </div>

                        <div className="more-option delete">
                            <span onClick={() => setDeleteConfrim(true)}>Delete</span>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {showInsight && selectedEntry && (
                <Insights
                    title={selectedEntry.title}
                    mood={selectedEntry.mood || "Unknown"}
                    moodColor={selectedEntry.moodColor}
                    tags={selectedEntry.tags}
                    tagColors={selectedEntry.tagColors || []}
                    insight={selectedEntry.insight || "no insight avaiable"}
                    onClose={() => setShowInsights(false)}
                />
            )}

            {showContentCard && selectedEntry && (
                <ContentCard
                    title={selectedEntry.title}
                    date={selectedEntry.date?.toDate ?
                        selectedEntry.date.toDate().toLocaleDateString() :
                        ""}
                    content={selectedEntry.content}
                    onClose={() => setShowContentCard(false)}
                />
            )}

            {deleteConfrim &&
                <div className="overlay">
                    <ConfirmPrompt
                        prompt={"Are you sure you want to delete this entry?"}
                        onNo={() => setDeleteConfrim(false)}
                        onYes={handleDeleteEntry}
                    />
                </div>
            }

            {showEditPopup && selectedEntry && (
                <EditEntryCard
                    entry={selectedEntry}
                    onClose={() => setShowEditPopup(false)}
                    onUpdate={handleUpdateEntry}
                />
            )}

        </>
    );
};

export default YourEntriesSection;
