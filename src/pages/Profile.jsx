import { useProfileData } from "../api/profile/fetchProfileData";
import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const token = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const { userdata, error } = useProfileData(userName, apiKey, token);

  if (!userName) return <div>Error: No profile name found.</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userdata) return <div>Loading...</div>;

  const bookings = userdata.bookings || [];

  console.log("Loaded user data:", userdata);

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
            className="absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full shadow-lg"
            src={userdata.avatar.url}
            alt={userdata.avatar.alt || "Profile Avatar image"}
          />
        </div>
        <div className="pt-28">
          <h1 className="my-5 text-center font-nunito text-3xl font-semibold text-shadow-lg">
            {userdata.name}
          </h1>
          <div className="mb-9 mt-3 flex justify-center">
            <button className="hover:pointer rounded-xl border-2 border-accentLight bg-white px-7 py-2 text-center font-montserrat text-lg font-semibold shadow-lg transition-transform hover:scale-105">
              Edit profile
            </button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mt-8 text-center font-nunito text-2xl font-bold">
          My bookings
        </h2>
        {error && <div className="text-red-500">{error}</div>}
        {!bookings && <div>Loading bookings...</div>}
        {bookings && bookings.length === 0 && (
          <div>You have no bookings yet.</div>
        )}
        {bookings && bookings.length > 0 && (
          <ul className="mx-auto flex w-sm flex-col sm:flex-row">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="mx-auto mt-2 rounded-lg bg-secondary px-4 py-2 shadow-md"
              >
                <Link
                  to={`/specific-venue/${b.venue.id}`}
                  className="w-full"
                  key={b.id}
                >
                  <img className="w-sm" src={b.venue.media[0]?.url}></img>
                  <h3>{b.venue.name}</h3>
                  <p>{b.venue.price} NOK / night</p>
                  <p>
                    Booked dates: {b.dateFrom} - {b.dateTo}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
