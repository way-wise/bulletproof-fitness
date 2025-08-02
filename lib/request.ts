export async function apiRequest<T = unknown>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
): Promise<{ data?: T; error?: { message: string } }> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: { message: result.message || "Unknown error" } };
    }

    return { data: result };
  } catch {
    return { error: { message: "Network error occurred" } };
  }
}
