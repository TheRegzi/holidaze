import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function DateRangePicker({ value, onChange, excludeDates }) {
  const processedExcludeDates = excludeDates
    .map((date) => (date instanceof Date ? date : new Date(date)))
    .filter((date) => date instanceof Date && !isNaN(date.valueOf()));

  return (
    <div className="relative z-50 w-full">
      <DatePicker
        selected={value[0]}
        onChange={onChange}
        startDate={value[0]}
        endDate={value[1]}
        selectsRange
        excludeDates={processedExcludeDates}
        minDate={new Date()}
        placeholderText="Select date"
        className="text-md w-full rounded-md border-2 border-accentLight p-2 pl-7 font-montserrat shadow-lg"
        wrapperClassName="w-full"
        popperClassName="z-50"
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
      />
    </div>
  );
}
