import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addVenue } from "../api/venues/create";

/**
 * A modal React component for adding a new venue.
 * Collects venue details via form submission and creates a new venue
 * by calling the API. Displays success or error messages,
 * and navigates to the new venue page upon success.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls whether the modal is rendered.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object} props.userData - The current user's data (required for context, may include id, role, etc).
 * @param {string} props.apiKey - API key for authentication.
 * @param {string} props.token - API access token.
 *
 * @returns {JSX.Element|null} The modal dialog, or null if not open/user invalid.
 *
 * @example
 * <AddVenueModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   userData={user}
 *   apiKey={apiKey}
 *   token={token}
 * />
 */

function AddVenueModal({ isOpen, onClose, userData, apiKey, token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  if (!isOpen || !userData) return null;

  const handleAddVenue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const name = formData.get("venueName");
    const description = formData.get("venueDescription");
    const media = [
      { url: formData.get("imageUrl1"), alt: `Image 1 for ${name}` },
      ...(formData.get("imageUrl2")
        ? [{ url: formData.get("imageUrl2"), alt: `Image 2 for ${name}` }]
        : []),
      ...(formData.get("imageUrl3")
        ? [{ url: formData.get("imageUrl3"), alt: `Image 3 for ${name}` }]
        : []),
    ];
    const price = parseFloat(formData.get("price"));
    const maxGuests = parseInt(formData.get("guests"), 10);
    const rating = parseFloat(formData.get("rating") || "0");
    const facilities = formData.getAll("facilities");
    const meta = {
      wifi: facilities.includes("wifi"),
      parking: facilities.includes("parking"),
      breakfast: facilities.includes("breakfast"),
      pets: facilities.includes("pets"),
    };
    const location = {
      address: formData.get("address"),
      city: formData.get("city"),
      zip: formData.get("zipcode"),
      country: formData.get("country"),
    };

    try {
      const venueData = await addVenue({
        body: {
          name,
          description,
          media,
          price,
          maxGuests,
          rating,
          meta,
          location,
        },
        token,
        apiKey,
      });
      setSuccess("Venue added successfully!");
      setTimeout(() => {
        setSuccess("");
        onClose();
        navigate(`/specific-venue/${venueData.data.id}`);
      }, 1200);
    } catch (error) {
      setError(`Could not add venue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="mx-4 max-h-[80vh] w-[900px] overflow-y-auto bg-white p-8 py-16 shadow-xl sm:px-16">
        <h2 className="mb-6 text-center font-nunito text-3xl font-semibold text-shadow-lg">
          Add new venue
        </h2>
        <form onSubmit={handleAddVenue} className="mx-auto max-w-[500px]">
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
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="venueDescription"
              className="font-nunito text-lg font-bold"
            >
              Description
            </label>
            <textarea
              id="venueDescription"
              name="venueDescription"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter venue description"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl1"
              className="font-nunito text-lg font-bold"
            >
              Image URL 1
            </label>
            <input
              id="imageUrl1"
              name="imageUrl1"
              type="url"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter image URL 1"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl2"
              className="font-nunito text-lg font-bold"
            >
              Image URL 2
            </label>
            <input
              id="imageUrl2"
              name="imageUrl2"
              type="url"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter image URL 2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl3"
              className="font-nunito text-lg font-bold"
            >
              Image URL 3
            </label>
            <input
              id="imageUrl3"
              name="imageUrl3"
              type="url"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter image URL 3"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="font-nunito text-lg font-bold">
              Price per night
            </label>
            <input
              id="price"
              name="price"
              type="number"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter price"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="guests" className="font-nunito text-lg font-bold">
              Maximum guests
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter maximum guests"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="font-nunito text-lg font-bold">
              Rating (1-5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter rating"
              min={1}
              max={5}
              step={0.1}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="facilities"
              className="font-nunito text-lg font-bold"
            >
              Facilities
            </label>
            <p className="text-md mb-4 mt-1 text-darkGrey">
              Select all facilities available at this venue by checking the
              appropriate boxes.
            </p>
            <div className="text-md mt-2 grid grid-cols-2 gap-x-8 gap-y-2 font-openSans text-black">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facilities"
                  value="wifi"
                  className="ml-2 mr-2 h-5 w-5"
                />
                Wifi
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facilities"
                  value="breakfast"
                  className="mr-2 h-5 w-5"
                />
                Breakfast
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facilities"
                  value="parking"
                  className="ml-2 mr-2 h-5 w-5"
                />
                Parking
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="facilities"
                  value="pets"
                  className="mr-2 h-5 w-5"
                />
                Pets
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="font-nunito text-lg font-bold">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="font-nunito text-lg font-bold">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter city"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="zipcode" className="font-nunito text-lg font-bold">
              Zipcode
            </label>
            <input
              id="zipcode"
              name="zipcode"
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter zipcode"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="font-nunito text-lg font-bold">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
              placeholder="Enter country"
              required
            />
          </div>
          <div className="mx-auto mt-7 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-[200px] rounded-xl border-2 border-accent bg-accent py-2 font-montserrat text-lg font-semibold shadow shadow-lg transition-transform hover:scale-105"
            >
              {loading ? "Adding venue..." : "Add Venue"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-[200px] rounded-xl border-2 border-darkGrey bg-white py-2 font-montserrat text-lg font-semibold text-darkGrey shadow-lg transition-transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
          {success && (
            <div className="mt-4 text-center font-openSans font-semibold text-green">
              <p>{success}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 text-center font-openSans font-semibold text-red">
              <p>Error: {error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddVenueModal;
