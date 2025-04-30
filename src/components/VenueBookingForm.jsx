import { useState, useEffect } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BOOKINGS } from "../utils/constants";
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

export default function VenueBookingForm({ venueId, price, venueName }) {
  const [dates, setDates] = useState([null, null]);
  const [guests, setGuests] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setShowModal(true);
  };

  async function confirmBooking() {
    if (!dates[0] || !dates[1] || !guests) return;
    setCreating(true);
    setError("");
    setSuccess(false);

    const accessToken = localStorage.getItem("accessToken");
    const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
    try {
      const res = await fetch(API_BOOKINGS, {
        method: "POST",
        headers: getHeaders(apiKey, accessToken),
        body: JSON.stringify({
          dateFrom: dates[0].toISOString().split("T")[0],
          dateTo: dates[1].toISOString().split("T")[0],
          guests: Number(guests),
          venueId,
        }),
      });
      if (!res.ok) throw new Error("Could not create booking.");
      setSuccess(true);
      setShowModal(false);
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setError("");
  }

  return (
    <div className="relative">
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
          disabled={!dates[0] || !dates[1] || !guests}
        >
          Book now!
        </button>
      </form>
      {success && (
        <p className="mt-0 text-center text-lg font-semibold text-green">
          Booking confirmed!
        </p>
      )}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="fixed left-1/2 top-1/2 z-50 flex h-[530px] w-[340px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center bg-white p-6 text-left text-black shadow-xl sm:h-[450px] sm:w-md sm:px-28">
            <h2 className="mb-4 text-center font-nunito text-xl font-bold text-shadow-lg">
              Confirm booking
            </h2>
            <p className="mb-4 font-openSans">
              You will book the venue by clicking ‘Book now’. Double check that
              the booking is correct.
            </p>
            <p className="mb-4 font-openSans">
              <b>Venue:</b>{" "}
              {venueName.length > 20
                ? venueName.substring(0, 30) + "..."
                : venueName}
            </p>
            <p className="mb-4 font-openSans">
              <b>Selected dates: </b>
              {dates[0] &&
                dates[0].toLocaleDateString("nb-NO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              {dates[1] &&
                ` - ${dates[1].toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
            </p>
            {price && (
              <p className="font-openSans">
                <b>Price:</b> {price} NOK ×{" "}
                {dates[0] && dates[1]
                  ? (dates[1] - dates[0]) / (1000 * 60 * 60 * 24)
                  : 0}{" "}
                nights ({guests} {guests > 1 ? "guests" : "guest"})
              </p>
            )}
            <p className="mb-4 font-openSans">
              Total price:{" "}
              <b>
                {price && dates[0] && dates[1]
                  ? price * ((dates[1] - dates[0]) / (1000 * 60 * 60 * 24))
                  : 0}{" "}
                NOK
              </b>
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <div>
                <button
                  type="button"
                  onClick={confirmBooking}
                  disabled={creating}
                  className="w-40 rounded-lg border-2 border-accent bg-accent py-2 font-montserrat font-semibold text-black shadow shadow-lg transition hover:scale-105"
                >
                  Book now
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="w-40 rounded-lg border-2 border-darkGrey bg-white py-2 font-montserrat font-semibold text-darkGrey shadow-lg transition hover:scale-105"
                >
                  Cancel booking
                </button>
              </div>
            </div>
            {creating && (
              <p className="mt-3 text-center text-lg font-semibold text-darkGrey">
                Booking...
              </p>
            )}
            {error && (
              <p className="mt-3 text-center text-lg font-semibold text-red">
                {error}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
