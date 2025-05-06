import { formatDate } from "../utils/helpers";

function BookingsByCustomers({ bookings }) {
  return (
    <div>
      <h2 className="mb-3 mt-3 text-center font-nunito text-xl font-bold text-black">
        Bookings By Customers
      </h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="mx-auto border-2 border-accentLight bg-white sm:w-[400px]">
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
            {bookings && bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.customer?.name || "Unknown"}</td>
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
      </div>
    </div>
  );
}

export default BookingsByCustomers;
