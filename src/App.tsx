// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

// Імпорт нової сторінки для повного списку галерей
import GalleriesPage from './pages/Galleries'; 

// Імпорт старих сторінок
import HomePage from './pages/Home'; 
import GalleryPage from './pages/Gallery';
import AuthPage from './pages/Auth';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          {/* Головна сторінка */}
          <Route path="/" element={<HomePage />} />
          
          {/* НОВИЙ МАРШРУТ: Сторінка зі списком усіх галерей та пагінацією */}
          <Route path="/galleries" element={<GalleriesPage />} />
          
          {/* Сторінка конкретної галереї */}
          <Route path="/gallery/:slug" element={<GalleryPage />} />
          
          {/* Сторінка входу */}
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;