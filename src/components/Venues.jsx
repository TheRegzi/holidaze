import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { API_VENUES } from "../utils/constants";
import { capitalizeWords } from "../utils/helpers";

const VenueList = ({ searchParams }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const fetchVenues = useCallback(
    async (currentPage) => {
      try {
        const response = await fetch(`${API_VENUES}?page=${currentPage}`);
        const data = await response.json();

        let filteredVenues = [
          ...new Map(data.data.map((venue) => [venue.id, venue])).values(),
        ];

        if (searchParams.guests && !isNaN(parseInt(searchParams.guests))) {
          const numberOfGuests = parseInt(searchParams.guests);
          filteredVenues = filteredVenues.filter((venue) => {
            return venue.maxGuests >= numberOfGuests;
          });
        }

        if (searchParams.location && searchParams.location.trim() !== "") {
          filteredVenues = filteredVenues.filter((venue) => {
            const venueCity = venue.location?.city?.toLowerCase() || "";
            const venueCountry = venue.location?.country?.toLowerCase() || "";
            const searchTerm = searchParams.location.toLowerCase();

            return (
              venueCity.includes(searchTerm) ||
              venueCountry.includes(searchTerm)
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

        return {
          venues: filteredVenues,
          meta: data.meta,
        };
      } catch (error) {
        console.error("Error fetching venues:", error);
        return { venues: [], meta: {} };
      }
    },
    [searchParams]
  );

  useEffect(() => {
    const loadVenues = async () => {
      setLoading(true);
      try {
        const result = await fetchVenues(page);

        if (page === 1) {
          setVenues(result.venues);
        } else {
          setVenues((prev) => {
            const combined = [...prev, ...result.venues];
            const uniqueVenues = [
              ...new Map(combined.map((venue) => [venue.id, venue])).values(),
            ];
            return uniqueVenues;
          });
        }

        setHasMore(!result.meta.isLastPage);
      } catch (error) {
        console.error("Error loading venues:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [page, fetchVenues]);

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
      {venues.length === 0 && !loading && (
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
              <h3 className="font-nunito text-xl font-semibold">
                {venue.name.length > 20
                  ? `${venue.name.slice(0, 20)}...`
                  : venue.name}
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
