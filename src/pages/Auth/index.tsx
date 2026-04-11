import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Mail, Lock, User, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import RegistrationSuccessModal from "../../components/Auth/RegistrationSuccessModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface FormErrors {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  passwordConfirm?: string;
}

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const endpoint = isLogin ? "/api/auth/login/" : "/api/auth/register/";

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

      // 🔥 ЄДИНЕ МІСЦЕ ЛОГІНУ
      await login(data.key);

      if (!isLogin) {
        setShowSuccessModal(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setApiError("Сервер недоступний.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex justify-center items-center px-4 min-h-[calc(100vh-80px)]">
      {showSuccessModal && (
        <RegistrationSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="w-full max-w-md p-6 sm:p-10 space-y-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] border border-zinc-100 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-3xl font-black tracking-tight text-center text-zinc-900">
          {isLogin ? t('auth.login', 'Вхід до системи') : t('auth.register', 'Реєстрація')}
        </h2>

        <p className="text-center text-sm font-bold text-zinc-400">
          {isLogin ? t('auth.noAccount', 'Немає облікового запису?') : t('auth.haveAccount', 'Вже є обліковий запис?')}
          <button
            type="button"
            onClick={toggleView}
            className="ml-2 font-black tracking-widest uppercase text-[10px] text-zinc-900 hover:text-blue-600 transition-colors border-b border-zinc-200 hover:border-blue-600 pb-0.5"
          >
            {isLogin ? t('auth.signUp', 'Зареєструватися') : t('auth.signIn', 'Увійти')}
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {apiError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex gap-2">
              <AlertTriangle size={16} />
              {apiError}
            </div>
          )}

          <Input
            icon={<User size={20} />}
            name="username"
            placeholder={t('auth.username', "Ім'я користувача")}
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          {!isLogin && (
            <Input
              icon={<Mail size={20} />}
              name="email"
              type="email"
              placeholder={t('auth.email', 'Електронна пошта')}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}

            />
          )}



          <Input
            icon={<Lock size={20} />}
            name="password"
            type="password"
            placeholder={t('auth.password', 'Пароль')}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {!isLogin && (
            <Input
              icon={<Lock size={20} />}
              name="passwordConfirm"
              type="password"
              placeholder={t('auth.confirmPassword', 'Підтвердіть пароль')}
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto w-4 h-4" />
            ) : isLogin ? (
              t('auth.signIn', 'Увійти')
            ) : (
              t('auth.createAccount', 'Створити акаунт')
            )}
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
      className={`w-full pl-11 pr-4 py-3.5 bg-zinc-50 border rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 transition-all outline-none ${error ? "border-red-500 bg-red-50" : "border-zinc-200"
        }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);
