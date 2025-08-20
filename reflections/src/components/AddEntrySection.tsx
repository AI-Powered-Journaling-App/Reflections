import Button from './Button';

import "../styles/AddEntrySection.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFloppyDisk, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import MyDatePicker from './MyDatePicker';


const AddEntrySection = () => {
    return (
        <div className="main-container">
            <div className="title-input">
                <input type="text" placeholder="Give your entry a title..." />
            </div>
            <div className="date-input">
                <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
                <span>Date: <MyDatePicker /></span>
            </div>
            <div className="input-field">
                <textarea placeholder="What's on your mind today?" />
            </div>
            <div className="buttons">
                <Button text="AI Insights" icon={faMagicWandSparkles}></Button>
                <Button text="Save Entry" icon={faFloppyDisk}></Button>
            </div>
        </div>
    );
}

export default AddEntrySection;