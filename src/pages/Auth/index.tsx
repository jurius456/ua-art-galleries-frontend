import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Mail, Lock, User, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
// http://127.0.0.1:8000/api

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  /* ---------------- helpers ---------------- */

  const toggleView = () => {
    setIsLogin((v) => !v);
    setFormData({
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
    setErrors({});
    setApiError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = "Введіть ім'я користувача.";
    }

    if (!isLogin) {
      if (!formData.email) {
        newErrors.email = "Введіть електронну пошту.";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Невірний формат пошти.";
      }
    }

    if (!formData.password) {
      newErrors.password = "Введіть пароль.";
    }

    if (!isLogin && formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Паролі не співпадають.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;
    setLoading(true);

    const endpoint = isLogin ? "/auth/login/" : "/auth/register/";

    const payload = isLogin
      ? {
          username: formData.username,
          password: formData.password,
        }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.passwordConfirm,
        };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(data?.detail || "Помилка авторизації.");
        return;
      }

      if (!data?.access) {
        setApiError("Сервер не повернув токен.");
        return;
      }

      localStorage.setItem("authToken", data.access);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setApiError("Сервер недоступний.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border">
        <h2 className="text-3xl font-extrabold text-center">
          {isLogin ? "Вхід до системи" : "Реєстрація"}
        </h2>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Немає облікового запису?" : "Вже є обліковий запис?"}
          <button
            type="button"
            onClick={toggleView}
            className="ml-1 font-medium text-neutral-700 hover:text-neutral-500"
          >
            {isLogin ? "Зареєструватися" : "Увійти"}
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {apiError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex gap-2">
              <AlertTriangle size={16} />
              {apiError}
            </div>
          )}

          {/* username */}
          <Input
            icon={<User size={20} />}
            name="username"
            placeholder="Ім'я користувача"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          {/* email */}
          {!isLogin && (
            <Input
              icon={<Mail size={20} />}
              name="email"
              type="email"
              placeholder="Електронна пошта"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          )}

          {/* password */}
          <Input
            icon={<Lock size={20} />}
            name="password"
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {/* confirm */}
          {!isLogin && (
            <Input
              icon={<Lock size={20} />}
              name="passwordConfirm"
              type="password"
              placeholder="Підтвердіть пароль"
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : isLogin ? "Увійти" : "Створити акаунт"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

/* -------- reusable input -------- */

type InputProps = {
  icon: React.ReactNode;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ icon, error, ...props }: InputProps) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);
