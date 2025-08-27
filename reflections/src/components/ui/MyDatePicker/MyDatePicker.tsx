import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"; // base styles
import "../../../styles/ui/MyDatePicker.css";

type MyDatePickerProps = {
    date: Date | null,
    setDate: React.Dispatch<React.SetStateAction<Date | null>>,
}

function MyDatePicker({ date, setDate }: MyDatePickerProps) {

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // prevent mobile keyboard from showing
        e.target.blur();
    };

    return (
        <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="date-picker"
            calendarClassName="calendar-custom"
            onFocus={handleFocus}
        />
    );
}

export default MyDatePicker;
