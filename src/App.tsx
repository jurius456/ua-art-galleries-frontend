import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import HomePage from "./pages/Home";
import GalleriesPage from "./pages/Galleries";
import GalleryPage from "./pages/Gallery";
import AboutPage from "./pages/About";
import EventsPage from "./pages/Events";
import AuthPage from "./pages/Auth";
import ProfilePage from "./pages/Profile";

// settings
import SettingsPage from "./pages/Settings";
import ChangePasswordPage from "./pages/Settings/ChangePassword";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow w-full">
        <Routes>
          {/* ===== Public routes ===== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route path="/gallery/:slug" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* ===== Protected routes ===== */}
          <Route element={<ProtectedRoute />}>
            {/* Об'єднуємо все під спільним лейаутом SettingsLayout */}
            <Route element={<SettingsPage />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/settings"
                element={<div>Тут будуть загальні налаштування</div>}
              />
              <Route
                path="/settings/password"
                element={<ChangePasswordPage />}
              />
            </Route>
          </Route>

          {/* ===== 404 ===== */}
          <Route
            path="*"
            element={
              <div className="text-center py-20 text-2xl text-gray-600">
                404 Page Not Found
              </div>
            }
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
