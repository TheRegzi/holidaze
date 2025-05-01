import { useState, useEffect, useCallback, useRef } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BOOKINGS, API_VENUE } from "../utils/constants";
import { getHeaders } from "../utils/headers";

function toLocalMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toUtcMidnight(date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

function isoToLocalMidnight(isoStr) {
  const d = new Date(isoStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

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

function deduplicateDates(arr) {
  const map = new Map();
  arr.forEach((date) => map.set(date.getTime(), date));
  return Array.from(map.values());
}

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
      console.error(error);
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
      setError(error.message);
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
      <form onSubmit={handleSubmit} className="z-10 flex flex-col gap-2">
        <label htmlFor="dates" className="sr-only">
          Dates
        </label>
        <DateRangePicker
          value={dates}
          onChange={setDates}
          excludeDates={bookedDates}
          selectsRange
          minDate={toUtcMidnight(new Date())}
          shouldCloseOnSelect={true}
          dateFormat="dd/MM/yyyy"
          filterDate={dateFilter}
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
          <div className="fixed left-1/2 top-1/2 z-50 flex h-[600px] w-[340px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center bg-white p-6 text-left text-black shadow-xl sm:h-[450px] sm:w-md sm:px-28">
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
                toUtcMidnight(dates[0]).toLocaleDateString("nb-NO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              {dates[1] &&
                ` - ${toUtcMidnight(dates[1]).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
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
