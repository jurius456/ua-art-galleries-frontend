import { Link, useLocation } from "react-router-dom";
import { User, Lock, Settings as SettingsIcon, Bookmark } from "lucide-react";

const SettingsSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/profile", label: "Профіль", icon: <User size={20} /> },
    { path: "/settings", label: "Налаштування", icon: <SettingsIcon size={20} /> },
    { path: "/settings/password", label: "Безпека", icon: <Lock size={20} /> },
    // Нова вкладка для вподобаного
    { path: "/settings/archive", label: "Мій Архів", icon: <Bookmark size={20} /> },
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive 
                ? "bg-gray-100 text-black shadow-sm" 
                : "text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;