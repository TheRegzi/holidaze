import { useState, useEffect } from "react";
import { API_PROFILE } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

/**
 * React hook for fetching user profile data, including bookings and venues, from the API.
 * Uses the GET method and custom headers (apiKey + token) for authorization.
 * Sets error states for missing fields or failed requests.
 *
 * @param {string} userName - The username/profile name whose data should be fetched.
 * @param {string} apiKey - API key for authorization.
 * @param {string} token - Access token for authorization.
 * @returns {Object} result
 * @returns {Object|null} result.userdata - The fetched user data, or null if loading/error.
 * @returns {string|null} result.error - Error message (if any), or null.
 * @returns {boolean} result.loading - Loading state.
 *
 * @example
 *   const { userdata, error, loading } = useProfileData(userName, apiKey, token);
 */
export function useProfileData(userName, apiKey, token) {
  const [userdata, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setUserData(null);

    if (!userName) {
      setError("No profile name found. Please log in to continue.");
      return;
    }

    if (!token) {
      setError("You are not logged in. Please log in to continue.");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_PROFILE(userName)}?_bookings=true&_venues=true`,
          {
            method: "GET",
            headers: getHeaders(apiKey, token),
          }
        );

        if (!response.ok) {
          let errorMessage = "Network response was not ok";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            /* intentionally empty: ignore JSON parsing error */
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        setUserData(null);
        setError(err.message || "Unknown error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userName, apiKey, token]);

  return { userdata, error, loading };
}
