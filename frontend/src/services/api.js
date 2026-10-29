const API_BASE_URL = "http://127.0.0.1:8000/api/accounts";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.detail ||
      data.email?.[0] ||
      data.username?.[0] ||
      data.password?.[0] ||
      data.non_field_errors?.[0] ||
      data.error ||
      "Request failed. Please try again.";

    throw new Error(message);
  }

  return data;
}

export async function signupUser(userData) {
  const response = await fetch(`${API_BASE_URL}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
}