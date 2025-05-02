import { useState, useEffect } from "react";
import { API_PROFILE } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

export function useProfileData(userName, apiKey, token) {
  const [userdata, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userName) {
      setError("No profile name found.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${API_PROFILE(userName)}?_bookings=true&_venues=true`,
          {
            method: "GET",
            headers: getHeaders(apiKey, token),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userName, apiKey, token]);

  return { userdata, error };
}
