import { useState } from "react";
import { API_VENUE } from "../utils/constants";
import { getHeaders } from "../utils/headers";
import { useNavigate } from "react-router-dom";

function DeleteVenue({ id }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleDeleteVenue() {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(API_VENUE(id), {
        method: "DELETE",
        headers: getHeaders(apiKey, token),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      setSuccess("Venue deleted.");
      setTimeout(() => {
        setSuccess(null);

        navigate("/profile");
      }, 1200);
    } catch (err) {
      setError("Could not delete venue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="mt-2 w-[170px] rounded-lg border-2 border-red bg-white p-2 font-montserrat font-semibold text-red shadow-lg transition-transform hover:scale-105"
        onClick={handleDeleteVenue}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete venue"}
      </button>
      {success && (
        <div className="text-md mt-2 font-openSans font-semibold text-green">
          {success} Redirecting to profile.
        </div>
      )}
      {error && (
        <div className="text-md mt-2 font-openSans font-semibold text-red">
          {error}
        </div>
      )}
    </div>
  );
}

export default DeleteVenue;
