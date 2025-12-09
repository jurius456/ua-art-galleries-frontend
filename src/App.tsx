import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

// Імпорт нових сторінок
import AboutPage from './pages/About'; 
import EventsPage from './pages/Events';

// Імпорт існуючих сторінок
import GalleriesPage from './pages/Galleries'; 
import HomePage from './pages/Home'; 
import GalleryPage from './pages/Gallery';
import AuthPage from './pages/Auth';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login'); 
  
  return (
    <div className="flex flex-col min-h-screen bg-white"> 
      
      <Header />
      
      <main className="flex-grow w-full"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route path="/gallery/:slug" element={<GalleryPage />} />
          <Route path="/login" element={<AuthPage />} />
          
          {/* НОВІ МАРШРУТИ */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />

          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;