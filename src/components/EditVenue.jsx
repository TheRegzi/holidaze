import { getHeaders } from "../utils/headers";
import { API_VENUE } from "../utils/constants";
import { useState, useEffect } from "react";

function EditVenue({ venue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState({
    venueName: "",
    venueDescription: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    price: "",
    guests: "",
    rating: "",
    facilities: [],
    address: "",
    city: "",
    zipcode: "",
    country: "",
  });

  useEffect(() => {
    if (isOpen && venue && venue.data) {
      setFormValues({
        venueName: venue.data.name || "",
        venueDescription: venue.data.description || "",
        imageUrl1: venue.data.media?.[0]?.url || "",
        imageUrl2: venue.data.media?.[1]?.url || "",
        imageUrl3: venue.data.media?.[2]?.url || "",
        price: venue.data.price ?? "",
        guests: venue.data.maxGuests ?? "",
        rating: venue.data.rating ?? "",
        facilities: [
          ...(venue.data.meta?.wifi ? ["wifi"] : []),
          ...(venue.data.meta?.breakfast ? ["breakfast"] : []),
          ...(venue.data.meta?.parking ? ["parking"] : []),
          ...(venue.data.meta?.pets ? ["pets"] : []),
        ],
        address: venue.data.location?.address || "",
        city: venue.data.location?.city || "",
        zipcode: venue.data.location?.zip || "",
        country: venue.data.location?.country || "",
      });
    }
  }, [isOpen, venue]);

  function handleOpenModal() {
    setIsOpen(true);
  }
  function handleCloseModal() {
    setIsOpen(false);
    setSuccess(null);
    setError(null);
  }

  function onFormChange(e) {
    const { name, value, checked } = e.target;
    if (name === "facilities") {
      setFormValues((prev) => {
        let facilities = prev.facilities || [];
        if (checked) {
          return { ...prev, facilities: [...facilities, value] };
        } else {
          return { ...prev, facilities: facilities.filter((v) => v !== value) };
        }
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleEditVenue(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      venueName,
      venueDescription,
      imageUrl1,
      imageUrl2,
      imageUrl3,
      price,
      guests,
      rating,
      facilities,
      address,
      city,
      zipcode,
      country,
    } = formValues;
    const media = [
      ...(imageUrl1
        ? [{ url: imageUrl1, alt: `Image 1 for ${venueName}` }]
        : []),
      ...(imageUrl2
        ? [{ url: imageUrl2, alt: `Image 2 for ${venueName}` }]
        : []),
      ...(imageUrl3
        ? [{ url: imageUrl3, alt: `Image 3 for ${venueName}` }]
        : []),
    ];
    const meta = {
      wifi: facilities.includes("wifi"),
      parking: facilities.includes("parking"),
      breakfast: facilities.includes("breakfast"),
      pets: facilities.includes("pets"),
    };
    const location = {
      address,
      city,
      zip: zipcode,
      country,
    };

    try {
      const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
      const token = localStorage.getItem("accessToken");
      const body = {
        name: venueName,
        description: venueDescription,
        media,
        price: Number(price),
        maxGuests: Number(guests),
        rating: Number(rating),
        meta,
        location,
      };

      const response = await fetch(API_VENUE(venue.data.id), {
        method: "PUT",
        headers: getHeaders(apiKey, token),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      setSuccess("Venue updated!");
      setTimeout(() => {
        setSuccess(null);
        handleCloseModal();
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError("Could not update venue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="tramsition-transform mt-2 w-[170px] rounded-lg border-2 border-accent bg-accent p-2 font-montserrat font-semibold shadow-lg hover:scale-105"
        onClick={handleOpenModal}
      >
        Edit venue
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="mx-4 max-h-[80vh] w-[900px] overflow-y-auto bg-white p-8 py-16 shadow-xl sm:px-16">
            <h2 className="mb-6 text-center font-nunito text-3xl font-semibold text-shadow-lg">
              Edit venue
            </h2>
            <form onSubmit={handleEditVenue} className="mx-auto max-w-[500px]">
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
                  value={formValues.venueName}
                  onChange={onFormChange}
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
                  value={formValues.venueDescription}
                  onChange={onFormChange}
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
                  value={formValues.imageUrl1}
                  onChange={onFormChange}
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
                  value={formValues.imageUrl2}
                  onChange={onFormChange}
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
                  value={formValues.imageUrl3}
                  onChange={onFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="font-nunito text-lg font-bold"
                >
                  Price per night
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
                  placeholder="Enter price"
                  required
                  value={formValues.price}
                  onChange={onFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="guests"
                  className="font-nunito text-lg font-bold"
                >
                  Maximum guests
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
                  placeholder="Enter maximum guests"
                  required
                  value={formValues.guests}
                  onChange={onFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="font-nunito text-lg font-bold"
                >
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
                  value={formValues.rating}
                  onChange={onFormChange}
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
                      checked={formValues.facilities.includes("wifi")}
                      onChange={onFormChange}
                    />
                    Wifi
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="facilities"
                      value="breakfast"
                      className="mr-2 h-5 w-5"
                      checked={formValues.facilities.includes("breakfast")}
                      onChange={onFormChange}
                    />
                    Breakfast
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="facilities"
                      value="parking"
                      className="ml-2 mr-2 h-5 w-5"
                      checked={formValues.facilities.includes("parking")}
                      onChange={onFormChange}
                    />
                    Parking
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="facilities"
                      value="pets"
                      className="mr-2 h-5 w-5"
                      checked={formValues.facilities.includes("pets")}
                      onChange={onFormChange}
                    />
                    Pets
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="font-nunito text-lg font-bold"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
                  placeholder="Enter address"
                  required
                  value={formValues.address}
                  onChange={onFormChange}
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
                  value={formValues.city}
                  onChange={onFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="zipcode"
                  className="font-nunito text-lg font-bold"
                >
                  Zipcode
                </label>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
                  placeholder="Enter zipcode"
                  required
                  value={formValues.zipcode}
                  onChange={onFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="country"
                  className="font-nunito text-lg font-bold"
                >
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  className="mt-1 w-full rounded-lg border-2 border-accentLight3 px-3 py-2 font-openSans"
                  placeholder="Enter country"
                  required
                  value={formValues.country}
                  onChange={onFormChange}
                />
              </div>
              <div className="mx-auto mt-7 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[200px] rounded-xl border-2 border-accent bg-accent py-2 font-montserrat text-lg font-semibold shadow shadow-lg transition-transform hover:scale-105"
                >
                  {loading ? "Saving..." : "Edit Venue"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-[200px] rounded-xl border-2 border-darkGrey bg-white py-2 font-montserrat text-lg font-semibold text-darkGrey shadow-lg transition-transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
              {success && (
                <div className="mb-t text-center font-semibold text-green">
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
      )}
    </div>
  );
}

export default EditVenue;
