import { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function VenueBookingForm() {
  const [dates, setDates] = useState([null, null]);
  const [guests, setGuests] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Booking from ${dates[0]?.toISOString().split("T")[0]} to ${dates[1]?.toISOString().split("T")[0]}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="dates" className="sr-only">
        Dates
      </label>
      <DateRangePicker value={dates} onChange={setDates} />
      <label htmlFor="guests" className="sr-only">
        Guests
      </label>
      <div className="relative">
        <input
          type="number"
          placeholder="Select guests"
          className="w-full rounded-md border-2 border-accentLight p-2 pl-7 font-montserrat text-sm shadow-lg md:text-base"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
        />
        <FontAwesomeIcon
          icon={faUser}
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
        />
      </div>
      <button
        type="submit"
        className="mb-5 mt-3 rounded-lg bg-accent px-5 py-2 font-montserrat font-semibold text-black shadow-lg transition-transform hover:scale-105"
        disabled={!dates[0] || !dates[1]}
      >
        Book now!
      </button>
    </form>
  );
}
