import { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BOOKINGS } from "../utils/constants";
import { useEffect } from "react";
import { getHeaders } from "../utils/headers";

function getDatesBetween(start, end) {
  const dateList = [];
  let theDate = new Date(start);
  const lastDate = new Date(end);
  theDate.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  while (theDate <= lastDate) {
    dateList.push(new Date(theDate));
    theDate.setDate(theDate.getDate() + 1);
  }
  return dateList;
}

export default function VenueBookingForm({ venueId }) {
  const [dates, setDates] = useState([null, null]);
  const [guests, setGuests] = useState("");
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      if (!venueId) return;
      const accessToken = localStorage.getItem("accessToken");
      const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
      const res = await fetch(`${API_BOOKINGS}?_venue=true`, {
        headers: getHeaders(apiKey, accessToken),
      });

      if (!res.ok) {
        setBookedDates([]);
        return;
      }

      const data = await res.json();
      if (!data?.data) {
        setBookedDates([]);
        return;
      }

      const bookingsForVenue = data.data.filter(
        (booking) => booking.venue && booking.venue.id === venueId
      );

      let allBooked = [];
      for (const booking of bookingsForVenue) {
        if (booking.dateFrom && booking.dateTo) {
          allBooked = allBooked.concat(
            getDatesBetween(booking.dateFrom, booking.dateTo)
          );
        }
      }
      setBookedDates(allBooked);
    }

    fetchBookings();
  }, [venueId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Booking from ${dates[0]?.toISOString().split("T")[0]} to ${dates[1]?.toISOString().split("T")[0]}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="z-10 flex flex-col gap-2">
      <label htmlFor="dates" className="sr-only">
        Dates
      </label>
      <DateRangePicker
        value={dates}
        onChange={setDates}
        excludeDates={bookedDates}
      />
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
