import { useState } from "react";
import { formatDate } from "../utils/helpers";

function BookingsByCustomers({ bookings }) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 4;
  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentBookings = bookings?.slice(startIndex, endIndex) || [];
  const pageCount = Math.ceil((bookings?.length || 0) / PAGE_SIZE);

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
      <div className="mx-auto w-[365px] max-w-full overflow-hidden rounded-xl border-2 border-accentLight bg-white sm:w-[400px]">
        <div className="overflow-x-auto">
          <table className="mx-auto w-full bg-white">
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
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-2">
                      {b.customer?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(new Date(b.dateFrom))} -{" "}
                      {formatDate(new Date(b.dateTo))}
                    </td>
                    <td className="px-4 py-2">{b.guests}</td>
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
          <div className="flew-row align-center mx-auto my-4 flex justify-center gap-4">
            <button
              className="rounded-lg border-2 border-darkGrey bg-white px-4 py-1 font-nunito font-medium"
              onClick={handlePrevious}
              disabled={page === 0}
            >
              Previous
            </button>
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
