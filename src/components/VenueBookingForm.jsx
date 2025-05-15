import { useState, useEffect, useCallback, useRef } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BOOKINGS, API_VENUE } from "../utils/constants";
import { getHeaders } from "../utils/headers";
import { Link } from "react-router-dom";
import { formatTitle, formatDate } from "../utils/helpers";

/**
 * Returns a new Date at local midnight for the given date.
 * @param {Date} date - The original date object.
 * @returns {Date} New date at local midnight.
 */
function toLocalMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Returns a new Date at UTC midnight for the given date.
 * @param {Date} date - The original date object.
 * @returns {Date} New date at UTC midnight.
 */
function toUtcMidnight(date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

/**
 * Converts an ISO date string to a Date at local midnight.
 * @param {string} isoStr - ISO-formatted date string.
 * @returns {Date} New Date at local midnight.
 */
function isoToLocalMidnight(isoStr) {
  const d = new Date(isoStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Returns an array of dates covering all days between startStr and endStr.
 * Both strings should be ISO-formatted date strings.
 * @param {string} startStr - Start date (ISO string).
 * @param {string} endStr - End date (ISO string).
 * @returns {Date[]} Array of Date objects at local midnight.
 */
function getLocalDatesBetween(startStr, endStr) {
  const dateList = [];
  let current = isoToLocalMidnight(startStr);
  const end = isoToLocalMidnight(endStr);
  while (current <= end) {
    dateList.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dateList;
}

/**
 * Removes duplicate Date objects (per Unix timestamp) from an array.
 * @param {Date[]} arr - Array of Date objects.
 * @returns {Date[]} Array of unique Date objects.
 */
function deduplicateDates(arr) {
  const map = new Map();
  arr.forEach((date) => map.set(date.getTime(), date));
  return Array.from(map.values());
}

/**
 * VenueBookingForm component
 * Displays a calendar-based booking form for a venue, handling selection of date ranges, number of guests,
 * checking for booked dates, and creating new bookings.
 *
 * @param {Object} props
 * @param {string} props.venueId - The ID of the venue being booked.
 * @param {number} props.price - The price per night for the venue.
 * @param {string} props.venueName - Display name of the venue (for confirmation modal).
 * @returns {JSX.Element} The booking form and confirmation modal.
 */
export default function VenueBookingForm({ venueId, price, venueName }) {
  const [dates, setDates] = useState([null, null]);
  const [guests, setGuests] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  const localBookedDatesRef = useRef([]);
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  const fetchBookings = useCallback(async () => {
    if (!venueId) return [];
    setLoadingBookings(true);
    try {
      const res = await fetch(`${API_VENUE(venueId)}?_bookings=true`, {
        headers: getHeaders(apiKey, accessToken),
      });
      if (!res.ok) throw new Error("Failed to fetch venue bookings");
      const data = await res.json();
      const bookings = data?.data?.bookings || [];
      let allBooked = [];
      for (const booking of bookings) {
        if (booking.dateFrom && booking.dateTo) {
          const dates = getLocalDatesBetween(booking.dateFrom, booking.dateTo);
          allBooked = allBooked.concat(dates);
        }
      }
      const mergedDates = deduplicateDates([
        ...allBooked,
        ...localBookedDatesRef.current,
      ]);
      setBookedDates(mergedDates);
      return mergedDates;
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
      setBookedDates(deduplicateDates([...localBookedDatesRef.current]));
      return [];
    } finally {
      setLoadingBookings(false);
    }
  }, [venueId, apiKey, accessToken]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setShowModal(true);
  };

  async function confirmBooking() {
    if (!dates[0] || !dates[1] || !guests) return;
    setCreating(true);
    setError("");
    setSuccess(false);

    const dateFrom = toUtcMidnight(dates[0]).toISOString();
    const dateTo = toUtcMidnight(dates[1]).toISOString();

    const bookingPayload = {
      dateFrom,
      dateTo,
      guests: Number(guests),
      venueId,
    };

    try {
      const res = await fetch(API_BOOKINGS, {
        method: "POST",
        headers: getHeaders(apiKey, accessToken),
        body: JSON.stringify(bookingPayload),
      });

      const resBody = await res.json();
      if (!res.ok) {
        throw new Error(
          resBody.errors?.[0]?.message || "Could not create booking"
        );
      }

      const datesToAdd = getLocalDatesBetween(
        resBody.data.dateFrom,
        resBody.data.dateTo
      );
      localBookedDatesRef.current = deduplicateDates([
        ...localBookedDatesRef.current,
        ...datesToAdd,
      ]);
      setBookedDates(deduplicateDates([...bookedDates, ...datesToAdd]));

      setTimeout(async () => {
        await fetchBookings();
      }, 1500);

      setSuccess(true);
      setShowModal(false);
      setDates([null, null]);
      setGuests("");
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setError("");
  }

  const dateFilter = (date) => {
    const localDate = toLocalMidnight(date);
    return !bookedDates.some(
      (bookedDate) =>
        toLocalMidnight(bookedDate).getTime() === localDate.getTime()
    );
  };

  return (
    <div className="relative">
      {loadingBookings && (
        <div className="mb-4 text-center">
          <span className="mr-2 inline-block animate-spin">&#8635;</span>
          Loading booking data...
        </div>
      )}
      <form onSubmit={handleSubmit} className="z-10 flex w-full flex-col gap-2">
        <label htmlFor="dates" className="sr-only">
          Dates
        </label>
        <div className="w-54 relative mx-auto mt-3">
          <DateRangePicker
            id="dates"
            value={dates}
            onChange={setDates}
            excludeDates={bookedDates}
            selectsRange
            minDate={toUtcMidnight(new Date())}
            shouldCloseOnSelect={true}
            dateFormat="dd/MM/yyyy"
            filterDate={dateFilter}
          />
        </div>
        {isLoggedIn && (
          <div className="relative w-full">
            <label htmlFor="guests" className="sr-only">
              Guests
            </label>
            <input
              id="guests"
              type="number"
              placeholder="Select guests"
              className="w-full rounded-md border-2 border-accentLight p-2 pl-7 font-montserrat text-sm shadow-lg md:text-base"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
            />
            <FontAwesomeIcon
              icon={faUser}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
            />
          </div>
        )}
        {isLoggedIn ? (
          <button
            type="submit"
            className="mb-2 mt-3 rounded-lg bg-accent px-5 py-2 font-montserrat font-semibold text-black shadow-lg transition-transform hover:scale-105"
            disabled={!dates[0] || !dates[1] || !guests}
          >
            Book now!
          </button>
        ) : (
          <div className="mb-5 mt-3 flex flex-col items-center">
            <p className="text-md mb-2 px-5 text-left font-openSans text-black">
              Log in now to book the holiday venue of your dreams!
            </p>
            <Link to="/login">
              <button
                type="button"
                className="mt-4 rounded-lg bg-accent px-7 py-2 font-montserrat font-semibold text-black shadow-lg transition-transform hover:scale-105"
              >
                Go to login
              </button>
            </Link>
          </div>
        )}
      </form>
      {success && (
        <p className="mt-0 text-center text-lg font-semibold text-green">
          Booking confirmed!
        </p>
      )}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="fixed left-1/2 top-1/2 z-50 flex h-[600px] w-[340px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center bg-white p-6 text-left text-black shadow-xl sm:h-[450px] sm:w-md sm:px-28">
            <h2 className="mb-4 text-center font-nunito text-xl font-bold text-shadow-lg">
              Confirm booking
            </h2>
            <p className="mb-4 font-openSans">
              You will book the venue by clicking ‘Book now’. Double check that
              the booking is correct.
            </p>
            <p className="mb-4 font-openSans">
              <b>Venue:</b> {formatTitle(venueName)}
            </p>
            <p className="mb-4 font-openSans">
              <b>Selected dates: </b>
              {dates[0] && formatDate(dates[0])} -{" "}
              {dates[1] && formatDate(dates[1])}
            </p>
            {price && (
              <p className="font-openSans">
                <b>Price:</b> {price} NOK ×{" "}
                {dates[0] && dates[1]
                  ? (toUtcMidnight(dates[1]) - toUtcMidnight(dates[0])) /
                    (1000 * 60 * 60 * 24)
                  : 0}{" "}
                nights ({guests} {guests > 1 ? "guests" : "guest"})
              </p>
            )}
            <p className="mb-4 font-openSans">
              Total price:{" "}
              <b>
                {price && dates[0] && dates[1]
                  ? price *
                    ((toUtcMidnight(dates[1]) - toUtcMidnight(dates[0])) /
                      (1000 * 60 * 60 * 24))
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
