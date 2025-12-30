// src/api/auth.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // http://127.0.0.1:8000/api

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

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Помилка авторизації");
  const token = data.access || data.token;
  if (!token) throw new Error("Сервер не повернув токен");
  return token as string;
}

export async function register(payload: {
  username: string;
  email?: string;
  password: string;
  password2?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Помилка реєстрації");
  const token = data.access || data.token;
  if (!token) throw new Error("Сервер не повернув токен");
  return token as string;
}

export async function fetchMe(token: string): Promise<UserDTO> {
  const res = await fetch(`${API_BASE_URL}/auth/user/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 401/403 — токен битий/протух
  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Не вдалося отримати користувача");
  return data as UserDTO;
}
