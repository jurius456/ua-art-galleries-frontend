const Footer = () => {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 text-sm text-gray-600">
          {/* Логотип зліва */}
          <div className="flex flex-col gap-4">
             <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
  
          {/* Колонки посилань (About us, Partnership...) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-black">About us</h4>
                  <a href="#" className="hover:text-black transition">Team</a>
                  <a href="#" className="hover:text-black transition">Mission</a>
              </div>
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-black">Partnership</h4>
                  <a href="#" className="hover:text-black transition">For Galleries</a>
              </div>
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-black">Support</h4>
                  <a href="#" className="hover:text-black transition">FAQ</a>
              </div>
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-black">Artists</h4>
                  <a href="#" className="hover:text-black transition">Join us</a>
              </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;