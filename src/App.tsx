import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// 1. Провайдери та Захист
import { FavoritesProvider } from "./context/FavoritesContext";
import ProtectedRoute from "./components/ProtectedRoute";

// 2. Спільні компоненти
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import BackgroundDecorator from "./components/shared/BackgroundDecorator";

// 3. Сторінки
import HomePage from "./pages/Home";
import GalleriesPage from "./pages/Galleries";
import GalleryPage from "./pages/Gallery";
import AboutPage from "./pages/About";
import EventsPage from "./pages/Events";
import EventDetail from "./pages/Events/EventDetailPage";
import AuthPage from "./pages/Auth";
import ProfilePage from "./pages/Profile";

// 4. Налаштування та Архів
import SettingsLayout from "./pages/Settings";
import ChangePasswordPage from "./pages/Settings/ChangePassword";
import GeneralSettingsPage from "./pages/Settings/GeneralSettingsPage";
import SavedGalleriesPage from "./pages/Galleries/SavedGalleriesPage";
import RoadmapPage from "./pages/Roadmap";
import ContactsPage from "./pages/Contacts";
import PartnersPage from "./pages/Partners";

// Компонент для автоматичного прокручування вгору
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  // Перевіряємо, чи ми на сторінці логіну, щоб приховати футер
  const isAuthPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen relative font-sans selection:bg-zinc-900 selection:text-white">
      <ScrollToTop />
      <BackgroundDecorator />
      <Header />

      <main className="flex-grow w-full relative z-10">
        <div className="animate-fade-in-up">
          <Routes>
            {/* Публічні маршрути */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/galleries" element={<GalleriesPage />} />
            <Route path="/galleries/:slug" element={<GalleryPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/login" element={<AuthPage />} />

            {/* Захищені маршрути */}
            <Route element={<ProtectedRoute />}>
              <Route element={<SettingsLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<GeneralSettingsPage />} />
                <Route path="/settings/password" element={<ChangePasswordPage />} />
                <Route path="/settings/archive" element={<SavedGalleriesPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div className="text-center py-40">
                <h1 className="text-9xl font-black text-zinc-100 uppercase tracking-tighter select-none">404</h1>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-4">Дані не знайдено в архіві</p>
              </div>
            } />
          </Routes>
        </div>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    // FavoritesProvider має бути найвищим, щоб усі сторінки мали доступ до бази
    <FavoritesProvider>
      {/* ВАЖЛИВО: Переконайся, що <BrowserRouter> знаходиться у файлі main.tsx 
         навколо компонента <App />. Якщо ні — додай його тут навколо <AppContent />
      */}
      <AppContent />
    </FavoritesProvider>
  );
}

export default App;