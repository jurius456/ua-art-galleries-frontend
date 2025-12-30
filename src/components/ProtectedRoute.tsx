import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  // Якщо токена немає, перенаправляємо на сторінку входу
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Якщо токен є, показуємо вкладений маршрут (ProfilePage)
  return <Outlet />;
};

export default ProtectedRoute;