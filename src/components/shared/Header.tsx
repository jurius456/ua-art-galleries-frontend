import { Link } from 'react-router-dom';

const Header = () => {
    // Я припускаю, що ваш Header має таку базову структуру
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Логотип */}
                <Link to="/" className="text-xl font-bold text-neutral-800 hover:text-neutral-600 transition">
                    UA Galleries
                </Link>

                {/* Desktop Навігація */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                    <Link to="/artworks" className="hover:text-black transition">Artworks</Link> 
                    <Link to="/galleries" className="hover:text-black transition">Galleries</Link>
                    
                    {/* НОВІ ПОСИЛАННЯ */}
                    <Link to="/events" className="hover:text-black transition">Events</Link> 
                    <Link to="/about" className="hover:text-black transition">About Us</Link> 
                </nav>

                {/* Auth Кнопка */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium border border-transparent rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 transition">
                        Log In
                    </Link>
                </div>
                
                {/* Тут може бути іконка для мобільного меню */}
            </div>
        </header>
    );
};

export default Header;