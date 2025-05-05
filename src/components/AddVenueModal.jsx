import React, { useState } from "react";
import { API_VENUES } from "../utils/constants";
import { getHeaders } from "../utils/headers";

async function addVenue({ body, token, apiKey }) {
  const res = await fetch(`${API_VENUES}`, {
    method: "POST",
    headers: getHeaders(apiKey, token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}

function AddVenueModal({ isOpen, onClose, userData, apiKey, token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !userData) return null;

  const handleAddVenue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const profileImageUrl = formData.get("profileImageUrl");
    const bannerImageUrl = formData.get("bannerImageUrl");

    try {
      await addVenue({
        userName: userData.name,
        body: {
          avatar: {
            url: profileImageUrl,
            alt: `Profile picture of ${userData.name}`,
          },
          banner: { url: bannerImageUrl, alt: `Banner for ${userData.name}` },
        },
        token,
        apiKey,
      });
      onClose();
    } catch (err) {
      setError("Could not update profile.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="mx-4 w-[550px] bg-white p-8 py-14 shadow-xl md:p-16">
        <h2 className="mb-6 text-center font-nunito text-3xl font-semibold text-shadow-lg">
          Add new venue
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleAddVenue}>
          <div className="mb-4">
            <label
              htmlFor="venueName"
              className="font-nunito text-lg font-bold"
            >
              Name of the venue
            </label>
            <input
              id="venueName"
              name="venueName"
              type="text"
              className="w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="venueDescription"
              className="font-nunito text-lg font-bold"
            >
              Description
            </label>
            <input
              id="venueDescription"
              name="venueDescription"
              type="text"
              className="w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter banner image URL"
            />
          </div>
          <div className="mx-auto mt-7 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-[200px] rounded-xl bg-accent py-2 font-montserrat text-lg font-semibold shadow shadow-lg transition-transform hover:scale-105"
            >
              {loading ? "Adding venue..." : "Add Venue"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-[200px] rounded-xl border-2 border-darkGrey bg-white py-2 font-montserrat text-lg font-semibold shadow shadow-lg transition-transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenueModal;
