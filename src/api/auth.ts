const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UserDTO = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export function getToken() {
  return localStorage.getItem("authToken");
}

export function setToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function clearToken() {
  localStorage.removeItem("authToken");
}

export async function login(payload: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Login error");

  return data.access as string;
}

export async function register(payload: {
  username: string;
  email?: string;
  password: string;
  password2?: string;
  first_name?: string;
  last_name?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Register error");

  return data.access as string;
}

export async function fetchMe(token: string): Promise<UserDTO> {
  const res = await fetch(`${API_BASE_URL}/auth/user/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Failed to fetch user");

  return data as UserDTO;
}
