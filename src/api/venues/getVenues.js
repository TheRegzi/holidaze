import { API_VENUES } from "../../utils/constants";

/**
 * Function to fetch the venues from the api.
 * There are 100 results at a time. Results are sorted so that the newest created venues appear first.
 * Continues to request each page of results until the API indicates the last page has been reached.
 *
 * @async
 * @function
 * @throws {Error} If any fetch request fails.
 * @returns {Promise<Array>} Resolves to an array of all venue objects.
 */
export async function fetchAllVenues() {
  let allVenues = [];
  let page = 1;
  let isLastPage = false;
  const limit = 100;

  while (!isLastPage) {
    const response = await fetch(
      `${API_VENUES}?page=${page}&limit=${limit}&sort=created&sortOrder=desc`
    );
    if (!response.ok) throw new Error("Failed to fetch venues");
    const data = await response.json();
    allVenues = [...allVenues, ...data.data];
    isLastPage = data.meta?.isLastPage;
    page++;
  }

  return allVenues;
}
