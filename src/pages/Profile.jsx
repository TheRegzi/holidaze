import { useProfileData } from "../api/profile/fetchProfileData";
import { Link } from "react-router-dom";
import { formatTitle, formatDate } from "../utils/helpers";
import { useState } from "react";
import UpdateProfileModal from "../components/EditProfileModal";
import AddVenueModal from "../components/AddVenueModal";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const token = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const { userdata, error } = useProfileData(userName, apiKey, token);
  const [modalType, setModalType] = useState("");

  if (!userName)
    return (
      <div className="mt-10 text-center font-semibold text-red">
        Error: No profile name found.
      </div>
    );
  if (error)
    return (
      <div className="mt-10 text-center font-semibold text-red">
        Error: {error}
      </div>
    );
  if (!userdata)
    return (
      <div className="mt-10 text-center font-semibold text-black">
        Loading...
      </div>
    );

  const bookings = userdata.bookings || [];

  console.log("Loaded user data:", userdata);

  const now = new Date();
  const activeBookings = bookings.filter((b) => new Date(b.dateTo) >= now);

  const sortedBookings = [...activeBookings].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  );

  const isVenueManager = userdata.venueManager === true;

  return (
    <div>
      <div className="mx-auto rounded-b-3xl border-2 border-accentLight shadow-lg lg:w-xl">
        <div className="relative">
          <img
            className="h-[300px] w-full object-cover"
            src={userdata.banner.url}
            alt={userdata.banner.alt || "Profile Banner image"}
          />
          <img
            className="absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full object-cover shadow-lg"
            src={userdata.avatar.url}
            alt={userdata.avatar.alt || "Profile Avatar image"}
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
          {isVenueManager ? (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setModalType("venue")}
                className="hover:pointer rounded-xl border-2 border-accent bg-accent px-7 py-2 text-center font-montserrat text-lg font-semibold shadow-lg transition-transform hover:scale-105"
              >
                Add Venue
              </button>
            </div>
          ) : null}
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
      <div>
        <h2 className="mt-8 text-center font-nunito text-2xl font-bold text-shadow-lg">
          My upcoming bookings
        </h2>
        {error && <div className="text-red">{error}</div>}
        {activeBookings.length === 0 && (
          <div className="text-md font-openSans text-black">
            You have no bookings yet.
          </div>
        )}
        <div className="container mx-auto mt-2 flex flex-col items-center">
          {bookings && bookings.length > 0 && (
            <ul className="mx-auto mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedBookings.map((b) => (
                <li
                  key={b.id}
                  className="mx-auto mt-5 rounded-b-xl bg-secondary shadow-lg transition-transform hover:scale-105"
                >
                  <Link to={`/specific-venue/${b.venue.id}`} key={b.id}>
                    <img
                      className="h-[220px] w-[350px] rounded-t-xl object-cover lg:w-[420px]"
                      src={b.venue.media[0]?.url}
                    ></img>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
