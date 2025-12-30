import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-neutral-800 hover:text-neutral-600 transition"
        >
          UA Galleries
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link to="/about" className="hover:text-black transition">
            About Us
          </Link>
          <Link to="/galleries" className="hover:text-black transition">
            Galleries
          </Link>
          <Link to="/events" className="hover:text-black transition">
            Events
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium border border-transparent rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
