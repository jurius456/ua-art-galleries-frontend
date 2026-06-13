import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Mail, Lock, User, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useGoogleLogin } from "@react-oauth/google";
import RegistrationSuccessModal from "../../components/Auth/RegistrationSuccessModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

/* -------- Google SVG logo -------- */
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.552c0-1.636-.132-3.228-.388-4.776H24.48v9.036h12.984c-.564 2.988-2.232 5.52-4.752 7.22v6h7.68c4.488-4.14 7.14-10.236 7.14-17.48z" fill="#4285F4"/>
    <path d="M24.48 48c6.504 0 11.964-2.148 15.948-5.832l-7.68-6c-2.136 1.44-4.872 2.292-8.268 2.292-6.348 0-11.724-4.284-13.656-10.044H2.88v6.192C6.852 42.972 15.108 48 24.48 48z" fill="#34A853"/>
    <path d="M10.824 28.416A14.46 14.46 0 0 1 9.96 24c0-1.536.264-3.024.864-4.416v-6.192H2.88A23.988 23.988 0 0 0 .48 24c0 3.876.924 7.548 2.4 10.608l7.944-6.192z" fill="#FBBC05"/>
    <path d="M24.48 9.54c3.564 0 6.756 1.224 9.276 3.624l6.948-6.948C36.432 2.388 30.984 0 24.48 0 15.108 0 6.852 5.028 2.88 13.392l7.944 6.192C12.756 13.824 18.132 9.54 24.48 9.54z" fill="#EA4335"/>
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
    setFormData({ username: "", email: "", password: "", passwordConfirm: "" });
    setErrors({});
    setApiError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = t('auth.enterUsername');
    }
    if (!isLogin) {
      if (!formData.email) {
        newErrors.email = t('auth.enterEmail');
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = t('auth.invalidEmail');
      }
    }
    if (!formData.password) {
      newErrors.password = t('auth.enterPassword');
    } else if (!isLogin) {
      if (formData.password.length < 8) {
        newErrors.password = t('auth.passwordMinLength');
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = t('auth.passwordUppercase');
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = t('auth.passwordNumber');
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = t('auth.passwordSpecial');
      }
    }
    if (!isLogin && formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = t('auth.passwordMismatch');
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
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password, password2: formData.passwordConfirm };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(data?.detail || t('auth.authError'));
        return;
      }
      if (isLogin) {
        await login(data.key);
        navigate("/");
      } else {
        setShowSuccessModal(true);
      }
    } catch {
      setApiError(t('auth.serverUnavailable'));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Google ---------------- */

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_access_token: tokenResponse.access_token }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setApiError(data.detail || t('auth.googleError'));
          return;
        }
        await login(data.access || data.key);
        navigate("/");
      } catch {
        setApiError(t('auth.serverUnavailable'));
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setApiError(t('auth.googleError')),
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="flex justify-center items-center px-4 min-h-[calc(100vh-80px)]">
      {showSuccessModal && (
        <RegistrationSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="w-full max-w-md p-6 sm:p-10 space-y-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] border border-zinc-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900">
            {isLogin ? t('auth.login') : t('auth.register')}
          </h2>
          <p className="text-sm font-bold text-zinc-400">
            {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
            <button
              type="button"
              onClick={toggleView}
              className="ml-2 font-black tracking-widest uppercase text-[10px] text-zinc-900 hover:text-blue-600 transition-colors border-b border-zinc-200 hover:border-blue-600 pb-0.5"
            >
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </div>

        {/* Google button — custom design */}
        <button
          type="button"
          onClick={() => googleLogin()}
          disabled={googleLoading || loading}
          className="w-full h-[52px] flex items-center justify-center gap-3 rounded-2xl border-2 border-zinc-200 bg-white hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin text-zinc-400" />
          ) : (
            <GoogleLogo />
          )}
          <span className="text-sm font-black text-zinc-800 tracking-wide group-hover:text-zinc-900 transition-colors">
            {isLogin ? t('auth.googleSignIn') : t('auth.googleSignUp')}
          </span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-zinc-100" />
          <span className="flex-shrink-0 mx-4 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {t('auth.or')}
          </span>
          <div className="flex-grow border-t border-zinc-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {apiError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 rounded-xl flex gap-2 items-start border border-red-100">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {apiError}
            </div>
          )}

          <Input
            icon={<User size={18} />}
            name="username"
            placeholder={t('auth.username')}
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            autoComplete="username"
          />

          {!isLogin && (
            <Input
              icon={<Mail size={18} />}
              name="email"
              type="email"
              placeholder={t('auth.email')}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
          )}

          <div className="space-y-1">
            <Input
              icon={<Lock size={18} />}
              name="password"
              type="password"
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {!isLogin && !errors.password && (
              <p className="text-[11px] text-zinc-400 font-medium px-1">
                {t('auth.passwordHint')}
              </p>
            )}
          </div>

          {!isLogin && (
            <Input
              icon={<Lock size={18} />}
              name="passwordConfirm"
              type="password"
              placeholder={t('auth.confirmPassword')}
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
              autoComplete="new-password"
            />
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-4 rounded-2xl text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto w-4 h-4" />
            ) : isLogin ? (
              t('auth.signIn')
            ) : (
              t('auth.createAccount')
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
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
      {icon}
    </div>
    <input
      {...props}
      className={`w-full pl-11 pr-4 py-3.5 bg-zinc-50 border rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 transition-all outline-none ${
        error ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400" : "border-zinc-200 hover:border-zinc-300"
      }`}
    />
    {error && (
      <p className="text-xs text-red-500 font-medium mt-1.5 pl-1 flex items-center gap-1">
        <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
        {error}
      </p>
    )}
  </div>
);
