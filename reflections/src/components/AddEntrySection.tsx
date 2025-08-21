import Button from './Button';

import "../styles/AddEntrySection.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFloppyDisk, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import MyDatePicker from './MyDatePicker';
import React, { useState } from 'react';
import { useNotification } from './Notification';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


const AddEntrySection = () => {

    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());

    const { showNotification } = useNotification();

    const handleSaveEntry = async () => {
        const textarea = document.querySelector("textarea")?.value || "";
        if (!title.trim()) return showNotification("Enter a title please");
        if (!textarea.trim()) return showNotification("Please write something in your entry");
        if (textarea.trim().length < 30) return showNotification("Too short to save an entry");

        try {
            const user = auth.currentUser;
            if (!user) return showNotification("Expired session please log in");

            const userEntriesRef = collection(db, "Entries", user.uid, "User Entries");

            await addDoc(userEntriesRef, {
                createdAt: serverTimestamp(),
                content: textarea,
                date: date,
                title: title,
            });

            setTitle("");
            setDate(new Date());
            (document.querySelector("textarea") as HTMLTextAreaElement).value = "";

            showNotification("Entry added succesfully!")
        } catch (err) {
            console.log(err);
        }
    }

    return (
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
                <textarea placeholder="What's on your mind today?" />
            </div>

            <div className="buttons">
                <button className="ai-insights-button"><FontAwesomeIcon icon={faMagicWandSparkles} />AI Insights</button>
                <Button text="Save Entry" onClick={handleSaveEntry} icon={faFloppyDisk}></Button>
            </div>

        </div >
    );
}

export default AddEntrySection;