export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // Try to refresh the token
    const refreshToken = localStorage.getItem("refresh_token");
    const refreshRes = await fetch("http://127.0.0.1:8000/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("token", data.access_token);
      
      // Retry the original request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${data.access_token}`
        }
      });
    } else {
      // Refresh failed, redirect to login
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return response;
}