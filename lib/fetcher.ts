const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function fetcher<T>(
  input: string | URL | globalThis.Request,
  options?: RequestInit,
): Promise<T> {
  if (!APP_URL) {
    throw new Error("APP_URL is not defined");
  }

  // Default headers for the request
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Merge default headers with any custom headers
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
  };

  const response = await fetch(`${APP_URL}/api/${input}`, mergedOptions);

  if (!response.ok) {
    throw new Error("Unexpected Api error");
  }

  return response.json();
}
