import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
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
          
          {/* Сторінка галереї (поки що загальна) */}
          <Route path="/gallery" element={<GalleryPage />} />
          
          {/* Сторінка входу */}
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;