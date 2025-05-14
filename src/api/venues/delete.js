import { useState } from "react";
import { API_VENUE } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

/**
 * Custom React hook to delete a venue by sending a DELETE request to the API.
 *
 * @param {Object} params - Hook arguments.
 * @param {string} params.id - The ID of the venue to be deleted.
 * @param {function} [params.onSuccess] - Optional callback to invoke after successful deletion.
 * @returns {Object} Hook state and actions.
 * @returns {boolean} return.loading - Whether the deletion is in progress.
 * @returns {string|null} return.success - Success message after deletion.
 * @returns {string|null} return.error - Error message, if any.
 * @returns {function} return.deleteVenue - Function to trigger the deletion process.
 *
 * @example
 * const { loading, success, error, deleteVenue } = useDeleteVenue({
 *   id: "123",
 *   onSuccess: () => { // Optional callback
 *     // Do something after delete
 *   }
 * });
 *
 * <button onClick={deleteVenue} disabled={loading}>Delete Venue</button>
 * {success && <div>{success}</div>}
 * {error && <div>{error}</div>}
 */
export function useDeleteVenue({ id, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function deleteVenue() {
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
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(`Could not delete venue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  return { loading, success, error, deleteVenue };
}
