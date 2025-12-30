import React from 'react';
import { User, LogOut, Mail, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Додано імпорт

const ProfilePage = () => {
  const navigate = useNavigate(); // 2. Хук викликається ТУТ (всередині компонента)

  // 🚨 МОК-ДАНІ про користувача
  const user = {
    name: "Роман Масляна",
    email: "roman@ua-galleries.com",
    role: "Адміністратор галереї",
    location: "Київ",
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Видаляємо токен
    navigate('/login'); // Тепер ця функція знає, що таке navigate
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-150px)]">
      
      <header className="flex items-center justify-between mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <User size={30} />
          Кабінет Користувача
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Вийти
        </button>
      </header>

      <section className="bg-white p-8 border border-gray-200 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-800">Персональні дані</h2>

        <div className="flex items-center gap-4 border-b pb-3">
          <Mail size={20} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-lg">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b pb-3">
          <User size={20} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Повне ім'я</p>
            <p className="font-medium text-lg">{user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <MapPin size={20} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Місто</p>
            <p className="font-medium text-lg">{user.location}</p>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-neutral-800">Ваша Роль:</h3>
          <span className="inline-block px-3 py-1 mt-2 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
            {user.role}
          </span>
        </div>
        
        <div className="pt-6 border-t mt-6">
             <Link to="/settings" className="text-blue-600 hover:text-blue-800 transition font-medium">
                Редагувати профіль та налаштування →
             </Link>
        </div>
      </section>

    </div>
  );
};

export default ProfilePage;