const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // у тебе = http://127.0.0.1:8000/api

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function getToken() {
  return localStorage.getItem('authToken');
}

export async function http<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    auth?: boolean; // якщо true — додасть Bearer
  } = {}
): Promise<T> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // якщо бекенд повертає HTML (помилка/дебаг), це теж зловимо
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }

  if (!res.ok) {
    const msg = data?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export type Me = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export function getMe() {
  return http<Me>('/auth/user/', { auth: true });
}

export function login(username: string, password: string) {
  return http<{ access: string }>('/auth/login/', {
    method: 'POST',
    body: { username, password },
  });
}

export function register(payload: {
  username: string;
  email?: string;
  password: string;
  password2?: string;
}) {
  return http<{ access: string }>('/auth/register/', {
    method: 'POST',
    body: payload,
  });
}
