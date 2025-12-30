import { useEffect, useState } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type UserData = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/auth/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Завантаження профілю…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="bg-white border rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User /> Профіль
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={16} /> Вийти
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Username" value={user.username} icon={<User />} />
          <Field label="Email" value={user.email || "—"} icon={<Mail />} />
          <Field
            label="Імʼя"
            value={user.first_name || "—"}
            icon={<User />}
          />
          <Field
            label="Прізвище"
            value={user.last_name || "—"}
            icon={<User />}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* -------- helper -------- */

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
