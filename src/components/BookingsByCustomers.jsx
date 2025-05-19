import { useState } from "react";
import { formatDate } from "../utils/helpers";

/**
 * A React component for showing bookings made by other users on venue managers' venue.
 * Each booking shows the username of the user, booked dates (from + to) and the amount of guests in a table.
 * It includes pagination with previous and next buttons, and shows four bookings at a time.
 * If no bookings are present, an appropriate message is shown.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.bookings - Array of booking objects. Each booking should have id, customer, dateFrom, dateTo, guests.
 * @returns {JSX.Element} Table of bookings with pagination controls.
 *
 * @example
 * <BookingsByCustomers bookings={venue.bookings} />
 */
function BookingsByCustomers({ bookings }) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 4;
  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentBookings = bookings?.slice(startIndex, endIndex) || [];
  const pageCount = Math.max(Math.ceil((bookings?.length || 0) / PAGE_SIZE), 1);

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, pageCount - 1));
  };

  return (
    <div>
      <h2 className="mb-3 mt-5 text-center font-nunito text-xl font-bold text-black">
        Bookings By Customers
      </h2>
      <div className="mx-auto flex w-[365px] flex-col overflow-hidden rounded-xl border-2 border-accentLight bg-white sm:w-[400px]">
        <div className="flex-1 overflow-x-auto">
          <table className="mx-auto w-full bg-white">
            <caption className="sr-only">Bookings By Customers</caption>
            <thead>
              <tr className="bg-accentLight text-black">
                <th className="px-4 py-2 text-left font-nunito text-lg font-bold">
                  User
                </th>
                <th className="px-4 py-2 text-center font-nunito text-lg font-bold">
                  Booked Dates
                </th>
                <th className="px-4 py-2 text-right font-nunito text-lg font-bold">
                  Guests
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBookings && currentBookings.length > 0 ? (
                currentBookings.map((b) => (
                  <tr key={b.id} className="border-t text-center">
                    <td className="px-1 py-2 sm:px-3">
                      {(b.customer?.name || "Unknown").length > 10
                        ? `${(b.customer?.name || "Unknown").slice(0, 10)}...`
                        : b.customer?.name || "Unknown"}
                    </td>
                    <td className="px-1 py-2 sm:px-3">
                      {formatDate(new Date(b.dateFrom))} -{" "}
                      {formatDate(new Date(b.dateTo))}
                    </td>
                    <td className="px-3 py-2">{b.guests}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mx-auto mb-4 mt-3 flex flex-row justify-center gap-4">
            <button
              className="rounded-lg border-2 border-darkGrey bg-white px-4 py-1 font-nunito font-medium"
              onClick={handlePrevious}
              disabled={page === 0}
            >
              Previous
            </button>
            {page > 0}
            <span className="flex items-center">
              {page + 1} / {pageCount}
            </span>
            <button
              className="rounded-lg border-2 border-darkGrey bg-white px-4 py-1 font-nunito font-medium"
              onClick={handleNext}
              disabled={page >= pageCount - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsByCustomers;
