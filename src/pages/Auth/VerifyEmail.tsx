import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      setMessage(t('verify.invalidLink'));
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-email/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, token }),
        });
        const data = await res.json();
        if (res.ok && data.key) {
          await login(data.key);
          setStatus("success");
          setMessage(t('verify.successMessage'));
          setTimeout(() => navigate("/"), 2000);
        } else {
          setStatus("error");
          setMessage(data.detail || t('verify.confirmError'));
        }
      } catch {
        setStatus("error");
        setMessage(t('verify.serverError'));
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center px-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md p-6 sm:p-10 space-y-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] border border-zinc-100 text-center animate-in fade-in zoom-in-95 duration-500">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 animate-spin text-zinc-900 mb-4" />
            <h2 className="text-xl font-bold">{t('verify.loading')}</h2>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('verify.success')}</h2>
            <p className="text-zinc-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-2xl text-white bg-zinc-900 hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              {t('verify.toHome')}
            </button>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('verify.error')}</h2>
            <p className="text-zinc-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 rounded-2xl text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              {t('verify.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
