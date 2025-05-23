import { useProfileData } from "../api/profile/fetchProfileData";
import { Link } from "react-router-dom";
import { formatTitle, formatDate, capitalizeWords } from "../utils/helpers";
import { useState } from "react";
import UpdateProfileModal from "../components/EditProfileModal";
import AddVenueModal from "../components/AddVenueModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";

/**
 * Profile page component that displays the user's profile information.
 * Renders different sections based on whether the user is a venue manager or not.
 * - Shows profile banner, avatar, name, and profile edit options.
 * - If user is a venue manager: displays a list of created venues and "Add Venue" modal.
 * - Shows list of upcoming bookings for all users, and adds pagination that displays 6 venues at a time.
 *
 * Handles loading, error, and conditional rendering for robust UX.
 *
 * @returns {JSX.Element} The rendered profile page UI.
 */
function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const token = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const { userdata, error } = useProfileData(userName, apiKey, token);
  const [modalType, setModalType] = useState("");
  const [venuesPage, setVenuesPage] = useState(0);
  const [bookingsPage, setBookingsPage] = useState(0);

  const PAGE_SIZE = 6;

  if (!userName) {
    return (
      <div className="mt-10 text-center font-semibold text-red">
        Error: No profile name found.
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center font-semibold text-red">
        Error: {error}
      </div>
    );
  }

  if (!userdata) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const venues = userdata.venues || [];
  const sortedVenues = [...venues].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const venuesStart = venuesPage * PAGE_SIZE;
  const venuesEnd = venuesStart + PAGE_SIZE;
  const pagedVenues = sortedVenues.slice(venuesStart, venuesEnd);
  const venuesPageCount = Math.ceil(sortedVenues.length / PAGE_SIZE);

  const bookings = userdata.bookings || [];
  const now = new Date();
  const activeBookings = bookings.filter((b) => new Date(b.dateTo) >= now);
  const sortedBookings = [...activeBookings].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  );
  const bookingsStart = bookingsPage * PAGE_SIZE;
  const bookingsEnd = bookingsStart + PAGE_SIZE;
  const pagedBookings = sortedBookings.slice(bookingsStart, bookingsEnd);
  const bookingsPageCount = Math.ceil(sortedBookings.length / PAGE_SIZE);

  const isVenueManager = userdata.venueManager === true;

  return (
    <div>
      <div className="mx-auto rounded-b-3xl border-2 border-accentLight shadow-lg lg:w-xl">
        <div className="relative">
          <img
            className="h-[300px] w-full object-cover"
            src={userdata.banner?.url || "assets/placeholder-banner.jpg"}
            alt={userdata.banner?.alt || "Profile Banner image"}
            loading="lazy"
          />
          <img
            className="absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full object-cover shadow-lg"
            src={userdata.avatar?.url || "assets/placeholder-avatar.jpg"}
            alt={userdata.avatar?.alt || "Profile Avatar image"}
            loading="lazy"
          />
        </div>
        <div className="mb-10 pt-28">
          <h1 className="my-5 text-center font-nunito text-3xl font-semibold text-shadow-lg">
            {userdata.name}
          </h1>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setModalType("profile")}
              className="hover:pointer rounded-xl border-2 border-accentLight bg-white px-7 py-2 text-center font-montserrat text-lg font-semibold shadow-lg transition-transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
          {isVenueManager && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setModalType("venue")}
                className="hover:pointer rounded-xl border-2 border-accent bg-accent px-7 py-2 text-center font-montserrat text-lg font-semibold shadow-lg transition-transform hover:scale-105"
              >
                Add Venue
              </button>
            </div>
          )}
        </div>
      </div>
      <UpdateProfileModal
        isOpen={modalType === "profile"}
        onClose={() => setModalType("")}
        userData={userdata}
        apiKey={apiKey}
        token={token}
      />
      <AddVenueModal
        isOpen={modalType === "venue"}
        onClose={() => setModalType("")}
        userData={userdata}
        apiKey={apiKey}
        token={token}
      />
      {isVenueManager && (
        <div>
          <h2 className="mt-8 text-center font-nunito text-2xl font-bold text-shadow-lg">
            My venues
          </h2>
          <div className="container mx-auto mt-2 flex flex-col items-center">
            {sortedVenues.length > 0 ? (
              <>
                <ul className="mx-auto mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {pagedVenues.map((v) => (
                    <li
                      key={v.id}
                      className="mx-auto mt-5 rounded-b-xl bg-secondary shadow-lg transition-transform hover:scale-105"
                    >
                      <Link to={`/specific-venue/${v.id}`}>
                        <img
                          className="h-[220px] w-[350px] rounded-t-xl object-cover lg:w-[420px]"
                          src={
                            v.media?.[0]?.url || "assets/placeholder-image.jpg"
                          }
                          alt={v.media?.[0]?.alt || v.name || "Venue image"}
                          loading="lazy"
                        />
                        <div className="relative z-20 p-3">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-nunito text-xl font-semibold text-shadow-lg">
                                {formatTitle(v.name)}
                              </h3>
                            </div>
                            <div>
                              <p className="font-montserrat font-medium">
                                {v.rating}/5{" "}
                                <FontAwesomeIcon
                                  icon={faStar}
                                  className="mr-1 text-accentDark"
                                />
                              </p>
                            </div>
                          </div>
                          <p className="text-md font-openSans">
                            <b>{v.price} NOK</b> /night
                          </p>
                          <p className="text-md font-openSans">
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="mr-1.5 text-sm text-accentDark"
                            />
                            {v.location?.city && v.location?.country
                              ? `${capitalizeWords(v.location.city)}, ${capitalizeWords(v.location.country)}`
                              : v.location?.city
                                ? capitalizeWords(v.location.city)
                                : v.location?.country
                                  ? capitalizeWords(v.location.country)
                                  : "No location stated"}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {venuesPageCount > 1 && (
                  <div className="my-4 flex justify-center gap-2">
                    <button
                      className="rounded-lg border-2 border-darkGrey px-4 py-1 font-nunito font-medium"
                      onClick={() => setVenuesPage((p) => Math.max(p - 1, 0))}
                      disabled={venuesPage === 0}
                    >
                      Previous
                    </button>
                    <span className="flex items-center">
                      {venuesPage + 1} / {venuesPageCount}
                    </span>
                    <button
                      className="rounded-lg border-2 border-darkGrey px-4 py-1 font-nunito font-medium"
                      onClick={() =>
                        setVenuesPage((p) =>
                          Math.min(p + 1, venuesPageCount - 1)
                        )
                      }
                      disabled={venuesPage === venuesPageCount - 1}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-md text-center font-openSans font-semibold text-black">
                You have no venues yet.
              </div>
            )}
          </div>
        </div>
      )}
      <div>
        <h2 className="mt-8 text-center font-nunito text-2xl font-bold text-shadow-lg">
          My upcoming bookings
        </h2>
        <div className="container mx-auto mt-2 flex flex-col items-center">
          {sortedBookings.length > 0 ? (
            <>
              <ul className="mx-auto mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pagedBookings.map((b) => (
                  <li
                    key={b.id}
                    className="mx-auto mt-5 rounded-b-xl bg-secondary shadow-lg transition-transform hover:scale-105"
                  >
                    <Link to={`/specific-venue/${b.venue.id}`}>
                      <img
                        className="h-[220px] w-[350px] rounded-t-xl object-cover lg:w-[420px]"
                        src={
                          b.venue.media[0]?.url ||
                          "assets/placeholder-image.jpg"
                        }
                        alt={
                          b.venue.media[0]?.alt || b.venue.name || "Venue image"
                        }
                        loading="lazy"
                      />
                      <div className="p-3 text-black">
                        <h3 className="font-nunito text-lg font-semibold text-shadow-lg">
                          {formatTitle(b.venue.name)}
                        </h3>
                        <p className="text-md font-openSans">
                          <b>{b.venue.price} NOK</b> /night
                        </p>
                        <p className="text-md font-openSans">
                          <b>Booked dates:</b> {formatDate(b.dateFrom)} -{" "}
                          {formatDate(b.dateTo)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {bookingsPageCount > 1 && (
                <div className="mb-12 mt-3 flex justify-center gap-2">
                  <button
                    className="rounded-lg border-2 border-darkGrey px-4 py-1 font-nunito font-medium"
                    onClick={() => setBookingsPage((p) => Math.max(p - 1, 0))}
                    disabled={bookingsPage === 0}
                  >
                    Previous
                  </button>
                  <span className="flex items-center">
                    {bookingsPage + 1} / {bookingsPageCount}
                  </span>
                  <button
                    className="rounded-lg border-2 border-darkGrey px-4 py-1 font-nunito font-medium"
                    onClick={() =>
                      setBookingsPage((p) =>
                        Math.min(p + 1, bookingsPageCount - 1)
                      )
                    }
                    disabled={bookingsPage === bookingsPageCount - 1}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-md mt-5 text-center font-openSans text-black">
              You have no upcoming bookings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
