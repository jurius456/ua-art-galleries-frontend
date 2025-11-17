import { Search, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between bg-white sticky top-0 z-50">
      {/* Логотип (кружечок з макету) */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <span className="text-xl font-bold hidden sm:block">UA Galleries</span>
      </Link>

      {/* Навігація (як на макеті) */}
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link to="#" className="hover:text-black transition">Artworks</Link>
        <Link to="#" className="hover:text-black transition">Galleries</Link>
        <Link to="#" className="hover:text-black transition">Events</Link>
      </nav>

      {/* Іконки (Пошук + Профіль) */}
      <div className="flex items-center gap-4">
        {/* Пошуковий рядок (імітація) */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-md w-64">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full"
            />
        </div>

        {/* Іконка пошуку для мобільних */}
        <button className="sm:hidden p-2 hover:bg-gray-100 rounded-full">
            <Search size={24} />
        </button>

        {/* Іконка профілю */}
        <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full">
            <User size={24} />
        </Link>
        
        {/* Меню бургер для мобільних */}
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;