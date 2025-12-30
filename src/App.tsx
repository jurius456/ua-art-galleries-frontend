import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Імпорт сторінок
import AboutPage from './pages/About'; 
import EventsPage from './pages/Events';
import ProfilePage from './pages/Profile';
import GalleriesPage from './pages/Galleries'; 
import HomePage from './pages/Home'; 
import GalleryPage from './pages/Gallery';
import AuthPage from './pages/Auth';

function App() {
  const location = useLocation();
  
  // Приховуємо футер на сторінці логіну
  const isAuthPage = location.pathname.startsWith('/login'); 
  
  return (
    <div className="flex flex-col min-h-screen bg-white"> 
      
      <Header />
      
      <main className="flex-grow w-full"> 
        <Routes>
          {/* Публічні маршрути */}
          <Route path="/" element={<HomePage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route path="/gallery/:slug" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* ЗАХИЩЕНІ МАРШРУТИ (Тільки для авторизованих) */}
          <Route element={<ProtectedRoute />}>
             <Route path="/profile" element={<ProfilePage />} />
             {/* Сюди можна додати /settings або /admin в майбутньому */}
          </Route>

          {/* Сторінка 404 */}
          <Route path="*" element={<div className="text-center py-20 text-2xl">404 Page Not Found</div>} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;