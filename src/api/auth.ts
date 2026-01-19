const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UserDTO = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

// --- Утиліти для роботи з токеном ---

export function getToken() {
  return localStorage.getItem("authToken");
}

export function setToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function clearToken() {
  localStorage.removeItem("authToken");
}

// --- Функції запитів до API ---

export async function login(payload: {
  username: string;
  password: string;
}) {
  // Додано /api/ перед /auth/ для відповідності Django urls.py
  const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data?.detail || "Помилка входу");
  }

  // Повертаємо access токен, який приходить від Django
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
  // Додано /api/ перед /auth/ для виправлення помилки 404
  const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    // Якщо бекенд повернув помилку (наприклад, користувач вже існує)
    throw new Error(data?.detail || "Помилка реєстрації");
  }

  return data.access as string;
}

export async function fetchMe(token: string): Promise<UserDTO> {
  // Додано /api/ перед /auth/
  const res = await fetch(`${API_BASE_URL}/api/auth/user/`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error("Не вдалося завантажити дані профілю");
  }

  return data as UserDTO;
}