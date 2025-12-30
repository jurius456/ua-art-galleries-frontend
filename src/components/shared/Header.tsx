import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const isAuthenticated = Boolean(token);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Логотип */}
        <Link
          to="/"
          className="text-xl font-bold text-neutral-800 hover:text-neutral-600 transition"
        >
          UA Galleries
        </Link>

        {/* Desktop Навігація */}
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

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 transition"
            >
              Log In
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-800 border border-neutral-300 hover:bg-gray-100 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
