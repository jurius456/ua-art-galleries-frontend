import { Outlet } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";
import { useAuth } from "../../hooks/useAuth";

const SettingsLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center pt-20 text-gray-400">Завантаження...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Обмежуємо ширину тільки для всього контейнера, щоб контент не розповзався на весь екран */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start gap-16">
          
          {/* Ліва частина: Заголовок + Навігація */}
          <div className="w-full md:w-64 sticky top-24">
            <h1 className="text-3xl font-bold tracking-tight mb-10 px-4 text-black">
              Налаштування
            </h1>
            <SettingsSidebar />
          </div>

          {/* Права частина: Тільки контент через Outlet */}
          <main className="flex-1 w-full pt-2">
            <Outlet />
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;