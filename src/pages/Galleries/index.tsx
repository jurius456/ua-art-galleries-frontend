// src/pages/Galleries/index.tsx - ВИПРАВЛЕНО
// Рядок 2: ВИПРАВЛЕНО імпорт типу ChangeEvent
import { useEffect, useState, useMemo, type ChangeEvent } from 'react'; 
// Рядок 3: ДОДАНО ChevronDown (для стилізації select)
import { Filter, ChevronLeft, ChevronRight, Search, MapPin, ChevronDown } from 'lucide-react'; 
import { Link } from 'react-router-dom';

// 🚨 МОК-ДАНІ: Додано поле 'city' для фільтрації
const MOCK_DATA = [
  { id: '1', title: 'Галерея Кузня', description: 'Сучасне мистецтво Києва.', slug: 'halereya-kuznya', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg', city: 'Київ' },
  { id: '2', title: 'PinchukArtCentre', description: 'Фонд сучасного мистецтва.', slug: 'pinchuk-art-centre', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg', city: 'Київ' },
  { id: '3', title: 'The Naked Room', description: 'Експериментальний простір.', slug: 'the-naked-room', imageUrl: null, city: 'Київ' },
  { id: '4', title: 'Арт-центр Світ', description: 'Львівська галерея живопису.', slug: 'art-centre-lviv', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg', city: 'Львів' },
  { id: '5', title: 'Музей ССМ', description: 'Широкий спектр мистецтва.', slug: 'muzej-suchasnogo-mystetstva', imageUrl: null, city: 'Одеса' },
  { id: '6', title: 'Я Галерея', description: 'Проєкт Павла Гудімова.', slug: 'ya-galereya', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg', city: 'Львів' },
  { id: '7', title: 'Галерея 7', description: 'Одеський простір.', slug: 'galereya-7', imageUrl: null, city: 'Одеса' },
  { id: '8', title: 'M17 Contemporary', description: 'Великий виставковий зал.', slug: 'm17-art-center', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg', city: 'Київ' },
  { id: '9', title: 'АРТ-КЛАССИК', description: 'Класичне мистецтво.', slug: 'art-classic', imageUrl: null, city: 'Київ' },
  { id: '10', title: 'Дім Митця', description: 'Для перевірки пагінації.', slug: 'dop-galereya', imageUrl: null, city: 'Харків' },
];

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  city: string; // Нове поле
}

const itemsPerPage = 9; 

const GalleriesPage = () => {
  // 🚨 СТАН ДЛЯ ФІЛЬТРАЦІЇ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // СТАН ДЛЯ ВІДОБРАЖЕННЯ
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Встановлюємо false для мок-даних

  
  // 🚨 ФІЛЬТРОВАНИЙ МАСИВ (на основі пошуку та міста)
  const filteredData = useMemo(() => {
    let data = MOCK_DATA;

    // 1. Фільтрація за містом
    if (selectedCity) {
      data = data.filter(item => item.city === selectedCity);
    }

    // 2. Фільтрація за пошуковим рядком
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.trim().toLowerCase();
      data = data.filter(item => 
        item.title.toLowerCase().includes(lowerCaseSearch) ||
        item.description.toLowerCase().includes(lowerCaseSearch) ||
        item.city.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    return data;
  }, [searchTerm, selectedCity]);

  
  // Кількість сторінок розраховується на основі ФІЛЬТРОВАНИХ ДАНИХ
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); 
  
  // 🚨 ЛОГІКА ЗАВАНТАЖЕННЯ ТА ПАГІНАЦІЇ
  useEffect(() => {
    // Скидаємо сторінку на 1 при зміні фільтрів
    if (currentPage !== 1) {
        setCurrentPage(1);
        return; // Повторний запуск через зміну currentPage
    }
    
    setLoading(true);
    
    const skip = (currentPage - 1) * itemsPerPage;
    const end = skip + itemsPerPage;

    // Імітуємо запит з пагінацією на основі filteredData
    setTimeout(() => {
      const paginatedData = filteredData.slice(skip, end) as ProjectItem[];
      setProjects(paginatedData);
      setLoading(false);
    }, 300); 

  }, [currentPage, filteredData]); // Залежність від filteredData

  // Обробники
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Виділяємо унікальні міста для фільтра
  const uniqueCities = Array.from(new Set(MOCK_DATA.map(item => item.city)));

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen">
      
      {/* 1. Блок Пошуку та Фільтрації */}
      <header className="mb-10 pt-4">
        <h1 className="text-3xl font-bold mb-4">Каталог галерей</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Пошук за назвою */}
            <div className="relative w-full md:w-1/3">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Пошук за назвою, описом..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-neutral-500 focus:border-neutral-500 transition"
                />
            </div>
            
            {/* Фільтр по місту */}
            <div className="relative w-full md:w-1/5">
                <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-neutral-500 focus:border-neutral-500 transition"
                >
                    <option value="">Усі міста</option>
                    {uniqueCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Кількість знайдених */}
            <span className="text-sm text-gray-500">
                Знайдено {filteredData.length} галерей
            </span>
        </div>
      </header>

      {/* 2. Секція Проектів (Список) */}
      <section className="pb-10">
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Завантаження даних...</div>
        ) : (
          <>
            {filteredData.length === 0 && (
                <div className="col-span-3 text-gray-500 py-10 text-center">Проектів не знайдено за вашими критеріями.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {projects.map((item) => {
                return (
                  <Link 
                    to={`/gallery/${item.slug}`} 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-md hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col h-full"
                  >
                     {item.imageUrl ? (
                       <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                     ) : (
                       <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                     )}
                     
                     <div className="p-4 flex flex-col flex-grow">
                       <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                       <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin size={14} className="mr-1" /> {item.city}
                       </div>
                       {item.description && (
                         <p className="text-gray-600 text-sm line-clamp-3">
                           {item.description}
                         </p>
                       )}
                     </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
      
      {/* 3. Пагінація */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 pb-10">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className={`
              p-2 rounded-full border transition 
              ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-200'}
            `}
          >
            <ChevronLeft size={24} />
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Сторінка {currentPage} з {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className={`
              p-2 rounded-full border transition 
              ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-200'}
            `}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
      
    </div>
  );
};

export default GalleriesPage;