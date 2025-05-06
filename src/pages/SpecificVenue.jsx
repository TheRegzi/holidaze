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

function SpecificVenue() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: venueId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);

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
        console.error("Error fetching venue:", error);
        setVenue(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  console.log("Venue data:", venue);

  const isOwner = venue.data.owner.name === user.name;

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
        <div className="mx-auto flex flex-col justify-around md:flex-row-reverse md:gap-10 lg:w-xl">
          {isOwner ? (
            <BookingsByCustomers bookings={venue.data.bookings} />
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
            <div className="mb-7 mt-6 px-6 lg:mt-0 lg:px-0">
              <h2 className="mb-2 mt-3 text-center font-nunito text-xl font-bold text-black">
                Description
              </h2>
              <p className="mt-3">{venue.data.description}</p>
            </div>
            <div className="mt-5 px-6 lg:px-0">
              <h2 className="mb-2 text-center font-nunito text-xl font-bold text-black">
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
          <div className="mx-6 mx-auto mb-12 mt-5 text-center sm:w-lg">
            <VenueMap venue={venue} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificVenue;
