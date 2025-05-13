import { getHeaders } from "../../utils/headers";
import { API_VENUE } from "../../utils/constants";

/**
 * Handles the submission of an edit venue form.
 * Prepares the venue update payload and sends a PUT request to update the venue.
 *
 * @async
 * @function
 * @param {Event} e - The form submission event.
 * @returns {Promise} A promise that resolved when the operation is complete.
 */

export async function handleEditVenue(
  e,
  { formValues, venue, setLoading, setSuccess, setError, handleCloseModal }
) {
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
    ...(imageUrl1 ? [{ url: imageUrl1, alt: `Image 1 for ${venueName}` }] : []),
    ...(imageUrl2 ? [{ url: imageUrl2, alt: `Image 2 for ${venueName}` }] : []),
    ...(imageUrl3 ? [{ url: imageUrl3, alt: `Image 3 for ${venueName}` }] : []),
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
  } catch (error) {
    setError(`Could not update venue: ${error.message}`);
  } finally {
    setLoading(false);
  }
}
