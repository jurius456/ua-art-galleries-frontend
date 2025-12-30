import { Outlet, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const SettingsPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Завантаження…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="bg-white border rounded-xl shadow-lg p-8 space-y-6">
        
        {/* HEADER */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Налаштування</h1>
          <p className="text-sm text-gray-500">
            Основна інформація акаунта
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="space-y-4">
          <Field label="Username" value={user.username} icon={<User />} />
          <Field label="Email" value={user.email || "—"} icon={<Mail />} />

          {/* CHANGE PASSWORD LINK */}
          <Link
            to="password"
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition text-sm"
          >
            <Lock className="text-gray-400" size={18} />
            <span className="font-medium">Змінити пароль</span>
          </Link>
        </div>

        {/* 👇 ВАЖЛИВО: OUTLET МАЄ БУТИ ТУТ */}
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;

/* helper */

const Field = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 border-b pb-3">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);
