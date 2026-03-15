// Core Backend API Utility
const API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // send cookies
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ error: "An error occurred" }));

    const message =
      (errorBody && (errorBody.error || errorBody.message)) ||
      `HTTP error! status: ${response.status}`;

    throw new Error(message);
  }

  return response.json();
}
