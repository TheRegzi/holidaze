import { API_VENUES } from "../../utils/constants";

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
