import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // закриття dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-neutral-800 hover:text-neutral-600 transition"
        >
          UA Galleries
        </Link>

        {/* Navigation */}
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

        {/* Auth area */}
        <div className="hidden md:flex items-center relative" ref={menuRef}>
          {isLoading ? null : user ? (
            <>
              {/* Username button */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-neutral-800"
              >
                <span>{user.first_name || user.username}</span>

                {/* minimalist arrow */}
                <svg
                  className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6 8L10 12L14 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 text-sm">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>

                  <div className="my-1 border-t" />

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 transition"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
