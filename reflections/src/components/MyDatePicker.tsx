import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // base styles
import "../styles/MyDatePicker.css"

function MyDatePicker() {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
        <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="date-picker"
            calendarClassName="calendar-custom"
        />
    );
}

export default MyDatePicker;
