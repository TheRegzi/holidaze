/**
 * Capitalizes the first letter of each word in the input string, converts the string to lowercase before capitalizing, and
 * then limits the result to a maximum of 18 characters.
 * @param {string} str -The input string to process.
 * @returns {string} The capitalized and trimmed string.
 */
export const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, 18);
};

/**
 * Formats a string by capitalizing the first letter of each word.
 * If the resulting string exceeds 25 characters, truncates it to 20 characters
 * and appends ellipsis ("...").
 *
 * @param {string} str - The title string to format.
 * @returns {string} The formatted and possibly truncated title string.
 */
export function formatTitle(str) {
  const capitalized = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return capitalized.length > 25
    ? capitalized.slice(0, 20).trim() + "..."
    : capitalized;
}

/**
 * Formats a date string into "YYYY-MM-DD" format using Norwegian locale ("nb-NO").
 *
 * @param {string} dateString - The date string to format (should be recognized by Date).
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", options);
}
