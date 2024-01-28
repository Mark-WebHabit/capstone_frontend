// Function to convert from "YYYY-MM-DD" to "Month Day, Year" format
export function convertToReadableFormat(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

// Function to convert from "Month Day, Year" to "YYYY-MM-DD" format
export function convertToISOFormat(readableDate) {
  const date = new Date(readableDate); // enforce UTC time
  return date.toISOString().split("T")[0];
}
