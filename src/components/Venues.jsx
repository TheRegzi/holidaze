import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { API_VENUES } from "../utils/constants";
import { capitalizeWords, formatTitle } from "../utils/helpers";

async function fetchAllVenues() {
  let allVenues = [];
  let page = 1;
  let isLastPage = false;

  const limit = 100;

  while (!isLastPage) {
    const response = await fetch(
      `${API_VENUES}?page=${page}&limit=${limit}&sort=created&sortOrder=desc`
    );
    if (!response.ok) throw new Error("Failed to fetch venues");
    const data = await response.json();
    allVenues = [...allVenues, ...data.data];
    isLastPage = data.meta?.isLastPage;
    page++;
  }

  return allVenues;
}

const VenueList = ({ searchParams }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const doSearch =
      (searchParams.location && searchParams.location.trim() !== "") ||
      (searchParams.startDate && searchParams.endDate) ||
      (searchParams.guests && !isNaN(parseInt(searchParams.guests)));

    const loadVenues = async () => {
      setLoading(true);
      setError("");

      try {
        if (doSearch) {
          const allVenues = await fetchAllVenues();
          let filteredVenues = allVenues;

          if (searchParams.guests && !isNaN(parseInt(searchParams.guests))) {
            const numberOfGuests = parseInt(searchParams.guests);
            filteredVenues = filteredVenues.filter(
              (venue) => venue.maxGuests >= numberOfGuests
            );
          }

          if (searchParams.location && searchParams.location.trim() !== "") {
            const searchTerm = searchParams.location.trim().toLowerCase();
            filteredVenues = filteredVenues.filter((venue) => {
              const location = venue.location || {};
              const address = location.address || "";
              const city = location.city || "";
              const country = location.country || "";
              return (
                address.toLowerCase().includes(searchTerm) ||
                city.toLowerCase().includes(searchTerm) ||
                country.toLowerCase().includes(searchTerm)
              );
            });
          }

          if (searchParams.startDate && searchParams.endDate) {
            const searchStart = new Date(searchParams.startDate);
            const searchEnd = new Date(searchParams.endDate);
            const numberOfGuests = parseInt(searchParams.guests) || 1;

            filteredVenues = filteredVenues.filter((venue) => {
              if (venue.maxGuests < numberOfGuests) {
                return false;
              }

              if (!venue.bookings || !Array.isArray(venue.bookings)) {
                return true;
              }

              const hasOverlap = venue.bookings.some((booking) => {
                const bookingStart = new Date(booking.dateFrom);
                const bookingEnd = new Date(booking.dateTo);

                return (
                  (searchStart >= bookingStart && searchStart <= bookingEnd) ||
                  (searchEnd >= bookingStart && searchEnd <= bookingEnd) ||
                  (searchStart <= bookingStart && searchEnd >= bookingEnd)
                );
              });

              return !hasOverlap;
            });
          }

          setVenues(filteredVenues);
          setHasMore(false);
          setPage(1);
        } else {
          const response = await fetch(
            `${API_VENUES}?page=${page}&limit=12&sort=created&sortOrder=desc`
          );
          if (!response.ok) throw new Error("Failed to fetch venues");
          const data = await response.json();
          if (page === 1) {
            setVenues(data.data);
          } else {
            setVenues((prev) => {
              const combined = [...prev, ...data.data];
              const uniqueVenues = [
                ...new Map(combined.map((venue) => [venue.id, venue])).values(),
              ];
              return uniqueVenues;
            });
          }
          setHasMore(!data.meta.isLastPage);
        }
      } catch (error) {
        setError(error.message || "Could not load venues.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [page, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.offsetHeight
      ) {
        if (hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-7 text-center font-nunito text-3xl font-semibold text-shadow-lg">
        Venues
      </h2>
      {error && (
        <div className="my-4 px-4 py-2 text-center font-openSans text-lg font-semibold text-red">
          Error: {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      {loading && (
        <div className="py-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      )}
      {venues.length === 0 && !loading && !error && (
        <div className="py-4 text-center">
          <p>No venues found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

const VenueCard = ({ venue }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-secondary shadow-xl">
      <Link to={`/specific-venue/${venue.id}`} className="block">
        <div className="absolute inset-0 z-10 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-40"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <p className="rounded-lg border-2 border-black bg-secondary px-2 py-4 font-montserrat font-semibold text-black">
            Max guests: {venue.maxGuests}
          </p>
        </div>
        <div className="relative h-64">
          <img
            src={venue.media[0]?.url || "/assets/placeholder-image.jpg"}
            alt={venue.media[0]?.alt || venue.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-20 px-4 py-2">
          <div className="flex justify-between">
            <div>
              <h3 className="font-nunito text-xl font-semibold text-shadow-lg">
                {formatTitle(venue.name)}
              </h3>
            </div>
            <div>
              <p className="font-montserrat font-medium">
                {venue.rating}/5{" "}
                <FontAwesomeIcon
                  icon={faStar}
                  className="mr-1 text-accentDark"
                />
              </p>
            </div>
          </div>
          <p className="font-openSans text-black">
            <span className="font-bold">{venue.price} NOK</span> / night
          </p>
          <p className="mb-2 font-openSans text-black">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mr-1 text-sm text-accentDark"
            />
            {venue.location?.city && venue.location?.country
              ? `${capitalizeWords(venue.location.city)}, ${capitalizeWords(venue.location.country)}`
              : venue.location?.city
                ? capitalizeWords(venue.location.city)
                : venue.location?.country
                  ? capitalizeWords(venue.location.country)
                  : "No location stated"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default VenueList;
