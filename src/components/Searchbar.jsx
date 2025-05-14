import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/**
 * A responsive and accessible search bar component on the banner at the home page.
 * One can search for location, dates and amount of guests.
 * It includes DatePicker so the users can select dates from the calendar for the search.
 * Calls the `onSearch` callback prop with the input values when the search button is pressed.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onSearch - Callback invoked with search parameters when the user submits the search.
 * @returns {JSX.Element}
 */
function SearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [dates, setDates] = useState([null, null]);

  const handleSearch = () => {
    const formattedStartDate = dates[0]
      ? dates[0].toISOString().split("T")[0]
      : "";
    const formattedEndDate = dates[1]
      ? dates[1].toISOString().split("T")[0]
      : "";

    const searchParams = {
      location,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      guests: guests ? parseInt(guests) : "",
    };

    onSearch(searchParams);
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center rounded-md p-4 sm:w-md md:flex-row lg:w-lg">
      <div className="grid w-full grid-cols-3 gap-2 font-montserrat md:gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Location"
            className="w-full rounded-md border-2 border-accentLight p-2 pl-7 text-sm md:text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faLocationDot}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
          />
        </div>
        <div className="relative z-50">
          {" "}
          <DatePicker
            selected={dates[0]}
            onChange={(update) => setDates(update)}
            startDate={dates[0]}
            endDate={dates[1]}
            selectsRange
            placeholderText="Date"
            className="w-full rounded-md border-2 border-accentLight p-2 pl-7 text-sm md:text-base"
            wrapperClassName="z-50"
          />
          <FontAwesomeIcon
            icon={faCalendar}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
          />
        </div>
        <div className="relative">
          <input
            type="number"
            placeholder="Guests"
            className="w-full rounded-md border-2 border-accentLight p-2 pl-7 text-sm md:text-base"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
          />
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="mt-4 rounded-md bg-accent px-10 py-2 font-montserrat font-semibold text-black text-shadow-lg md:ml-2 md:mt-0"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
