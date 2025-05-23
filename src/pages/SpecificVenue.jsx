import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_VENUE } from "../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeWords } from "../utils/helpers";
import VenueMap from "../components/VenueMap";
import ImageCarousel from "../components/ImageCarousel";
import VenueBookingForm from "../components/VenueBookingForm";
import BookingsByCustomers from "../components/BookingsByCustomers";
import EditVenue from "../components/EditVenue";
import DeleteVenue from "../components/DeleteVenue";

/**
 * Specific venue component that displays an image carousel and detailed information for a single venue.
 * Includes description, location, facilities, map, owner/manager controls, and a venue booking form.
 * Handles conditional rendering for owners, and shows loading and error states.
 *
 * @returns {JSX.Element} The rendered specific venue page.
 */

function SpecificVenue() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id: venueId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!venueId) return;
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          API_VENUE(venueId) + "?_owner=true&_bookings=true"
        );
        if (!response.ok) throw new Error("Venue not found");
        const data = await response.json();
        setVenue(data);
      } catch (error) {
        if (error.message === "Failed to fetch") {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(error.message || "Error fetching venue.");
        }
        setVenue(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  if (loading)
    return (
      <div className="py-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="my-4 px-4 py-2 text-center font-openSans text-lg font-semibold text-red">
        Error: {error}
      </div>
    );
  if (!venue) return <div>Venue not found</div>;

  const isOwner = user?.name && venue.data.owner.name === user.name;

  return (
    <div>
      <div>
        <ImageCarousel media={venue.data.media} />
      </div>
      <div>
        <h1 className="mt-8 break-words px-4 text-center font-nunito text-3xl font-semibold text-shadow-lg">
          {venue.data.name}
        </h1>
        <div className="align-center my-5 flex justify-center gap-12">
          <div>
            <p className="text-md font-montserrat font-medium text-black">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="mr-1 text-sm text-accentDark"
              />
              {venue.data.location?.city && venue.data.location?.country
                ? `${capitalizeWords(venue.data.location.city)}, ${capitalizeWords(venue.data.location.country)}`
                : venue.data.location?.city
                  ? capitalizeWords(venue.data.location.city)
                  : venue.data.location?.country
                    ? capitalizeWords(venue.data.location.country)
                    : "No location stated"}
            </p>
          </div>
          <div>
            <p className="text-md font-montserrat font-medium text-black">
              {venue.data.rating}/5{" "}
              <FontAwesomeIcon icon={faStar} className="mr-1 text-accentDark" />
            </p>
          </div>
        </div>
        <div className="mx-auto flex flex-col justify-around gap-10 md:flex-row-reverse xl:w-[1200px]">
          {isOwner ? (
            <div>
              <div className="mx-auto mb-3 mt-6 flex w-[360px] flex-row justify-around rounded-lg border-2 border-accentLight py-2 font-nunito text-lg sm:w-[400px] md:w-full">
                <div>
                  <p>
                    <b>Max guests:</b> {venue.data.maxGuests}
                  </p>
                </div>
                <div>
                  <p>
                    <b>{venue.data.price} NOK /</b>night
                  </p>
                </div>
              </div>
              <div className="mx-auto flex w-[350px] flex-row justify-center gap-5">
                <EditVenue venue={venue} />
                <DeleteVenue id={venue.data.id} />
              </div>
              <BookingsByCustomers bookings={venue.data.bookings} />
            </div>
          ) : null}
          {isOwner ? null : (
            <div className="mx-auto my-4 flex max-h-[370px] w-[330px] flex-1 basis-1/2 flex-col items-center justify-center rounded-2xl border-2 border-accentLight p-4 py-6 text-center md:mx-2 md:max-w-96">
              <div>
                <h2 className="mb-4 mt-3 font-nunito text-xl font-bold text-black">
                  Check availability
                </h2>
                <p className="text-md mb-4 font-montserrat text-black">
                  <b>{venue.data.price} NOK /</b> night
                </p>
                <p className="text-md mb-2 font-montserrat text-black">
                  <b>Max:</b> {venue.data.maxGuests} guests
                </p>
                <VenueBookingForm
                  venueId={venue.data.id}
                  price={venue.data.price}
                  venueName={venue.data.name}
                />
              </div>
            </div>
          )}
          <div className="flex-1 basis-1/2">
            <div className="mb-7 mt-6 px-6 lg:mt-0 lg:px-3">
              <h2 className="mb-2 mt-3 text-left font-nunito text-xl font-bold text-black">
                Description
              </h2>
              <p className="mt-3 lg:pr-16">{venue.data.description}</p>
            </div>
            <div className="mt-5 px-6 lg:px-3">
              <h2 className="mb-4 text-left font-nunito text-xl font-bold text-black">
                Facilities
              </h2>
              <ul className="font-montserrat text-black">
                {Object.entries(venue.data.meta).map(([key, value]) => (
                  <li key={key}>
                    <FontAwesomeIcon
                      icon={value ? faCheck : faTimes}
                      style={{
                        color: value ? "green" : "red",
                        marginRight: "8px",
                      }}
                    />{" "}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="mb-2 text-center font-nunito text-xl font-bold text-black">
            Explore the area
          </h2>
          <div className="mx-auto mb-12 mt-5">
            <VenueMap venue={venue} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificVenue;
