import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function DateRangePicker({ value, onChange, excludeDates }) {
  const processedExcludeDates = excludeDates
    .map((date) => {
      if (date instanceof Date) return date;
      try {
        return new Date(date);
      } catch {
        console.error("Invalid date:", date);
        return null;
      }
    })
    .filter((date) => date !== null);

  return (
    <div className="relative z-50">
      <DatePicker
        selected={value[0]}
        onChange={onChange}
        startDate={value[0]}
        endDate={value[1]}
        selectsRange
        excludeDates={processedExcludeDates}
        minDate={new Date()}
        placeholderText="Select date"
        className="w-full rounded-md border-2 border-accentLight p-2 pl-7 font-montserrat text-sm shadow-lg md:text-base"
        wrapperClassName="z-50"
        popperClassName="z-50"
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
      />
    </div>
  );
}
