import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, ArrowLeft, Clock,
  Coffee, ShieldCheck, Accessibility
} from 'lucide-react';

const MOCK_DETAILS_DATA = {
  'halereya-kuznya': {
    name: "Галерея Кузня",
    location: "Київ, вул. Нижній Вал 37/20",
    status: "Active",
    specialization: "Сучасне українське мистецтво",
    yearOfFoundation: 2018,
    description: "Простір, що поєднує метал та дух сучасного міста. Галерея зосереджена на дослідженні традиційних матеріалів у сучасному контексті. Тут кожна виставка — це діалог між минулим та майбутнім через призму фізичної форми.",
    email: "info@kuznya.ua", 
    phone: "+380 44 123 45 67",
    hasCoffee: true,
    price: "Free"
  },
  'pinchuk-art-centre': {
    name: "PinchukArtCentre",
    location: "Київ, вул. Велика Васильківська, 1/3-2",
    status: "Active",
    specialization: "Міжнародне сучасне мистецтво",
    yearOfFoundation: 2006,
    description: "Найбільший приватний центр сучасного мистецтва в Центральній та Східній Європі, що став платформою для виставок світового рівня та підтримки молодих українських митців.",
    email: "contact@pinchukartcentre.org", 
    phone: "+380 44 590 08 58",
    hasCoffee: true,
    price: "Free"
  }
};

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>(); 
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const gallery = MOCK_DETAILS_DATA[slug as keyof typeof MOCK_DETAILS_DATA];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent font-mono text-[10px] tracking-widest text-zinc-400">
      SYSTEM_LOADING_DATA...
    </div>
  );

  if (!gallery) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">404_DATA_NOT_FOUND</p>
      <Link to="/galleries" className="text-zinc-800 font-black uppercase text-[10px] tracking-widest border-b border-zinc-800">Повернутись</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pb-32 animate-in fade-in duration-1000">
      
      <div className="container mx-auto px-6 max-w-6xl pt-12">
        {/* Navigation */}
        <Link to="/galleries" className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-800 transition-all text-[10px] font-black uppercase tracking-widest mb-20">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Архів галерей
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: Essential Data */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">ID: {slug?.toUpperCase()}</span>
                <div className="h-[1px] flex-grow bg-zinc-100"></div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-zinc-800 tracking-tighter uppercase leading-[0.85]">
                {gallery.name}
              </h1>
            </div>

            <div className="space-y-10">
              <div className="flex gap-12 border-b border-zinc-100">
                {['info', 'location', 'policy'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? "text-zinc-800" : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    {tab === 'info' && 'Дані'}
                    {tab === 'location' && 'Локація'}
                    {tab === 'policy' && 'Умови'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-zinc-800 animate-in fade-in" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[300px] animate-in fade-in duration-500">
                {activeTab === 'info' && (
                  <div className="space-y-8">
                    <p className="text-zinc-600 text-xl md:text-2xl leading-relaxed font-medium">
                      {gallery.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Програма виставок</h4>
                        <p className="text-sm font-bold text-zinc-800 leading-relaxed">Оновлюється щомісяця. Поточна експозиція триває до кінця тижня.</p>
                      </div>
                      <div className="p-8 bg-zinc-900 rounded-[32px] text-white">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest">Тип закладу</h4>
                        <p className="text-sm font-bold leading-relaxed">Сучасний архівний простір з відкритим доступом.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'location' && (
                  <div className="p-10 bg-zinc-50 rounded-[40px] border border-zinc-200/50 flex flex-col items-center justify-center text-center space-y-4">
                    <MapPin size={40} className="text-blue-600 mb-2" />
                    <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">{gallery.location}</h3>
                    <p className="text-sm text-zinc-400 font-bold max-w-xs uppercase">Для побудови маршруту використовуйте сервіси навігації.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Specs */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-zinc-100 rounded-[40px] p-10 space-y-12 shadow-sm">
              
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Засновано</p>
                    <p className="text-3xl font-black text-zinc-800">{gallery.yearOfFoundation}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Вхід</p>
                    <p className="text-xl font-black text-emerald-500 uppercase">{gallery.price}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-50 pb-2">Характеристики</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-zinc-800 font-bold text-xs">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center"><Clock size={14} /></div>
                      11:00 — 19:00
                    </div>
                    <div className="flex items-center gap-3 text-zinc-800 font-bold text-xs">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center"><Coffee size={14} /></div>
                      {gallery.hasCoffee ? 'Кав\'ярня' : 'Без кави'}
                    </div>
                    <div className="flex items-center gap-3 text-zinc-800 font-bold text-xs">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center"><ShieldCheck size={14} /></div>
                      Укриття поруч
                    </div>
                    <div className="flex items-center gap-3 text-zinc-800 font-bold text-xs">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center"><Accessibility size={14} /></div>
                      Доступність
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-zinc-100">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Напрямок</p>
                  <p className="text-lg font-black text-zinc-800 uppercase tracking-tighter">{gallery.specialization}</p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <a href={`tel:${gallery.phone}`} className="flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-800 transition-colors">Телефон</span>
                    <span className="text-xs font-black text-zinc-800 group-hover:text-blue-600 transition-colors">{gallery.phone}</span>
                  </a>
                  <a href={`mailto:${gallery.email}`} className="flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-800 transition-colors">E-mail</span>
                    <span className="text-xs font-black text-zinc-800 group-hover:text-blue-600 transition-colors">{gallery.email}</span>
                  </a>
                </div>
              </div>

              <button className="w-full py-5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-zinc-200/50">
                Отримати запрошення
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;