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

function SpecificVenue() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: venueId } = useParams();

  useEffect(() => {
    if (!venueId) return;
    const fetchVenue = async () => {
      try {
        const response = await fetch(API_VENUE(venueId));
        if (!response.ok) throw new Error("Venue not found");
        const data = await response.json();
        console.log(data);
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

  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <div>
      <div>
        <img
          src={venue.data.media[0].url}
          alt={venue.data.media[0].alt || "Venue image"}
        />
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
        <div className="mx-5 mx-auto my-4 flex w-80 flex-col items-center justify-center rounded-lg border-2 border-accentLight p-4 text-center sm:w-96">
          <h2 className="mb-2 mt-3 font-nunito text-lg font-bold text-black">
            Check availability
          </h2>
          <p className="text-md mb-2 font-montserrat text-black">
            <b>{venue.data.price} NOK /</b> night
          </p>
          {isLoggedIn ? null : (
            <p>Log in now to book the holiday venue of your dreams!</p>
          )}
          <button>Go to login</button>
        </div>
        <div>
          <div className="px-6">
            <h2 className="mb-2 mt-3 text-center font-nunito text-lg font-bold text-black">
              Description
            </h2>
            <p>{venue.data.description}</p>
          </div>
          <div>
            <h2 className="mb-2 mt-3 text-center font-nunito text-lg font-bold text-black">
              Facilities
            </h2>
            <ul className="mx-6 font-montserrat text-black">
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
        <div>
          <h2 className="mb-2 mt-3 text-center font-nunito text-lg font-bold text-black">
            Explore the area
          </h2>
          <div className="mx-6 mx-auto mb-12 mt-6 text-center sm:w-lg">
            <VenueMap venue={venue} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificVenue;
