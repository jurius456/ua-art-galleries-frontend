import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-zinc-100 py-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* ЛІВА ЧАСТИНА: Лого та опис (4 колонки) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-lg font-black text-zinc-900 hover:text-zinc-600 transition-all tracking-tighter uppercase"
            >
              UA Galleries
            </Link>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xs">
              Платформа для об'єднання українського мистецтва в єдиний цифровий простір.
            </p>
          </div>

          {/* ПРАВА ЧАСТИНА: Колонки посилань (8 колонок) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <FooterColumn title="About">
              <FooterLink to="/about">Team</FooterLink>
              <FooterLink to="/about">Mission</FooterLink>
            </FooterColumn>

            <FooterColumn title="Partnership">
              <FooterLink to="/galleries">Galleries</FooterLink>
            </FooterColumn>

            <FooterColumn title="Support">
              <FooterLink to="/faq">FAQ</FooterLink>
            </FooterColumn>

            <FooterColumn title="Artists">
              <FooterLink to="/join">Join us</FooterLink>
            </FooterColumn>
          </div>
        </div>

        {/* НИЖНЯ ПАНЕЛЬ */}
        <div className="pt-6 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
          <p>© {currentYear} UA Galleries Team. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- Допоміжні компоненти --- */

const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
      {title}
    </h4>
    <nav className="flex flex-col gap-2.5">
      {children}
    </nav>
  </div>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors duration-300 tracking-tight"
  >
    {children}
  </Link>
);

export default Footer;