import React, { useState } from "react";
import { API_PROFILES } from "../utils/constants";
import { getHeaders } from "../utils/headers";

async function updateProfileApi({ userName, body, token, apiKey }) {
  const res = await fetch(`${API_PROFILES}/${userName}`, {
    method: "PUT",
    headers: getHeaders(apiKey, token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}

export default function UpdateProfileModal({
  isOpen,
  onClose,
  userData,
  apiKey,
  token,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !userData) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const profileImageUrl = formData.get("profileImageUrl");
    const bannerImageUrl = formData.get("bannerImageUrl");

    try {
      await updateProfileApi({
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
          Edit Profile
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label
              htmlFor="profileImageUrl"
              className="font-nunito text-lg font-bold"
            >
              Profile Image Url
            </label>
            <input
              id="profileImageUrl"
              name="profileImageUrl"
              type="url"
              defaultValue={userData?.avatar.url}
              className="w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter profile image URL"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bannerImageUrl"
              className="font-nunito text-lg font-bold"
            >
              Banner Image Url
            </label>
            <input
              id="bannerImageUrl"
              name="bannerImageUrl"
              type="url"
              defaultValue={userData?.banner.url}
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
              {loading ? "Updating..." : "Update profile"}
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
