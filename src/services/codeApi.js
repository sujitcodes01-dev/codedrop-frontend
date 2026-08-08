// Centralized API access.
// No other file in the app should call fetch() directly against
// the backend — everything goes through here.

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Thrown whenever the backend responds with a non-2xx status.
 * Carries the HTTP status so callers can branch on it (404 vs 410 vs 500)
 * without re-parsing anything.
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response, fallback) {
  try {
    const body = await response.json();

    if (
      body &&
      typeof body.message === "string" &&
      body.message.trim()
    ) {
      return body.message;
    }
  } catch {
    // Response body wasn't JSON (or was empty) — fall through to fallback.
  }

  return fallback;
}

/**
 * Creates a new temporary code snippet.
 *
 * @param {{
 *   content: string,
 *   language: string,
 *   expirationMinutes: number
 * }} data
 *
 * @returns {Promise<{
 *   accessCode: string,
 *   content: string,
 *   language: string,
 *   createdAt: string,
 *   expiresAt: string
 * }>}
 */
export async function createCode(data) {
  const response = await fetch(`${API_BASE_URL}/api/codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      "Something went wrong while sharing your code. Please try again."
    );

    throw new ApiError(response.status, message);
  }

  return response.json();
}

/**
 * Retrieves a shared code snippet by its access code.
 *
 * @param {string} accessCode
 *
 * @returns {Promise<{
 *   content: string,
 *   language: string,
 *   createdAt: string,
 *   expiresAt: string
 * }>}
 */
export async function getCode(accessCode) {
  const response = await fetch(
    `${API_BASE_URL}/api/codes/${encodeURIComponent(accessCode)}`
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? "The code you're looking for doesn't exist."
        : response.status === 410
          ? "This shared code is no longer available."
          : "Something went wrong while loading this code. Please try again.";

    const message = await parseErrorMessage(response, fallback);

    throw new ApiError(response.status, message);
  }

  return response.json();
}