// src/pages/Galleries/index.tsx - РЕФАКТОРИНГ НА МОК-ДАНІ
import { useEffect, useState } from 'react';
// import { client } from '../../api/contentful.ts'; <-- ВИДАЛЕНО
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 

// 🚨 МОК-ДАНІ: Імітуємо те, що поверне ваш майбутній бекенд
const MOCK_DATA = [
  { id: '1', title: 'Галерея Кузня (МОК)', description: 'Сучасне мистецтво Києва.', slug: 'halereya-kuznya', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg' },
  { id: '2', title: 'PinchukArtCentre (МОК)', description: 'Фонд сучасного мистецтва.', slug: 'pinchuk-art-centre', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg' },
  { id: '3', title: 'The Naked Room (МОК)', description: 'Експериментальний простір.', slug: 'the-naked-room', imageUrl: null },
  { id: '4', title: 'Арт-центр (МОК)', description: 'Львівська галерея живопису.', slug: 'art-centre-lviv', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg' },
  { id: '5', title: 'Музей сучасного мистецтва (МОК)', description: 'Широкий спектр мистецтва.', slug: 'muzej-suchasnogo-mystetstva', imageUrl: null },
  { id: '6', title: 'Я Галерея (МОК)', description: 'Проєкт Павла Гудімова.', slug: 'ya-galereya', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg' },
  { id: '7', title: 'Галерея 7 (МОК)', description: 'Одеський простір.', slug: 'galereya-7', imageUrl: null },
  { id: '8', title: 'M17 Contemporary Art Center (МОК)', description: 'Великий виставковий зал.', slug: 'm17-art-center', imageUrl: 'https://images.ctfassets.net/h8g9g6b3j3c0/3B1X8F4wBwYgU9lRjV2p/102c1e8d6f5f3e9e3c9a6a8b5c9a4a7f/placeholder.jpg' },
  { id: '9', title: 'АРТ-КЛАССИК (МОК)', description: 'Класичне мистецтво.', slug: 'art-classic', imageUrl: null },
  { id: '10', title: 'Додаткова Галерея (МОК)', description: 'Для перевірки пагінації.', slug: 'dop-galereya', imageUrl: null },
];

// Тип даних, який ми очікуємо від бекенду
interface ProjectItem {
  id: string; // ID
  title: string; // Назва
  description: string; // Опис
  slug: string; // Slug
  imageUrl: string | null; // URL картинки
}

const GalleriesPage = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 
  // Розраховуємо загальну кількість сторінок на основі мок-даних
  const totalPages = Math.ceil(MOCK_DATA.length / itemsPerPage); 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚨 ІМІТАЦІЯ ЗАПИТУ ДО БЕКЕНДУ:
    const fetchMockData = () => {
      setLoading(true);
      
      const skip = (currentPage - 1) * itemsPerPage;
      const end = skip + itemsPerPage;

      // Імітуємо затримку (як при реальному API-запиті)
      setTimeout(() => {
        const paginatedData = MOCK_DATA.slice(skip, end) as ProjectItem[];
        setProjects(paginatedData);
        setLoading(false);
      }, 500); // Затримка 500 мс
    };

    fetchMockData();
  }, [currentPage]); 

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

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen">
      
      {/* ... (Блок Пошуку та Фільтрації - БЕЗ ЗМІН) ... */}
      <header className="mb-10 pt-4">
        <h1 className="text-3xl font-bold mb-4">Каталог галерей (Мок-дані)</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Пошук */}
            <div className="relative w-full md:w-1/3">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Пошук за назвою, містом..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                />
            </div>
            
            {/* Фільтр */}
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition w-full md:w-auto justify-center">
                <Filter size={20} />
                Фільтрація (Спеціалізація, Рік)
            </button>
            
            {/* Кількість знайдених */}
            <span className="text-sm text-gray-500">
                Відображається {projects.length} з {MOCK_DATA.length} галерей
            </span>
        </div>
      </header>

      {/* 2. Секція Проектів (Список) */}
      <section className="pb-10">
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Завантаження даних...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 && (
                <div className="col-span-3 text-gray-500 py-10 text-center">Проектів не знайдено на цій сторінці.</div>
            )}
            
            {/* Малюємо картки: використовуємо мок-дані */}
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
                     <h3 className="font-bold text-lg mb-2">{item.title}</h3>
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
        )}
      </section>
      
      {/* 3. Пагінація */}
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
      
    </div>
  );
};

export default GalleriesPage;