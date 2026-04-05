const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5285";
const BASE_URL = `${API_HOST.replace(/\/$/, "")}/api`;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const requestOptions: RequestInit = {
        credentials: "include",
        ...options,
    };

    const response = await fetch(url, requestOptions);

    // 🚨 CENTRALIZED ERROR INTERCEPTOR
    if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        type ErrorPayload = {
            errors?: Record<string, string[]>;
            message?: string;
        };

        const responseText = await response.text().catch(() => "");
        let errorData: ErrorPayload | null = null;

        try {
            // Try to parse the C# error payload from text once.
            errorData = responseText ? JSON.parse(responseText) : null;

            // 1. Is it an ASP.NET Core Validation Error? (400 Bad Request)
            if (errorData && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join(' ');
            } 
            // 2. Is it from our Custom Exception Middleware? (500 Internal Server Error)
            else if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // If the server didn't send JSON (e.g., a hard 404 text page), use raw text.
            if (responseText) errorMessage = responseText;
        }

        // Handle suspended accounts centrally within the same interceptor.
        if (
            response.status === 403 &&
            errorData?.message &&
            errorData.message.includes("Account suspended")
        ) {
            // 1. Destroy their frontend identity
            localStorage.removeItem('userRoles');
            localStorage.removeItem('isLoggedIn');

            // 2. Alert them so they know why they are being kicked out
            alert("SECURITY ALERT: Your account has been suspended by an administrator. You are being logged out.");

            // 3. Force them back to the login page
            await fetch(`${BASE_URL}/Auth/logout`, { method: 'POST', credentials: 'include' });
            window.location.href = '/login';

            // Stop execution so the rest of the app doesn't try to render
            throw new Error("Account Suspended");
        }

        // Throw the clean, readable string!
        throw new Error(errorMessage);
    }

    // If everything is OK, just return the response as normal
    return response;
}