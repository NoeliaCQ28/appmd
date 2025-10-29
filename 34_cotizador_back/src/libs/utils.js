export const parseIntOrNull = (value) => {
  if (value === "" || value === undefined) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};

export const parseFloatOrNull = (value) => {
  if (value === "" || value === undefined) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

// Sanitize the filename to snake_case format
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^\w\s.-]/g, "") // Remove special characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/-+/g, "_") // Replace hyphens with underscores
    .replace(/\.+/g, ".") // Handle multiple dots
    .replace(/_+/g, "_") // Handle multiple underscores
    .toLowerCase(); // Convert to lowercase
};

export function splitIntoChunks(
  str,
  maxLength = 250,
  lineBreak = "&#10;&#10;",
) {
  const chunks = [];
  for (let i = 0; i < str.length; i += maxLength) {
    chunks.push(lineBreak + str.slice(i, i + maxLength));
  }
  return chunks;
}
