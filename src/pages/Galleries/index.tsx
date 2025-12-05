// src/pages/Galleries/index.tsx - ВИПРАВЛЕНО
import { useEffect, useState } from 'react';
import { client } from '../../api/contentful.ts'; // <--- FIX: Явно вказали розширення .ts
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react'; // <--- FIX: Прибрали невикористовувані Arrow icons
import { Link } from 'react-router-dom'; 

// Тип даних (зберігаємо той самий)
interface ProjectItem {
  sys: { id: string };
  fields: {
    title: string;
    description?: string;
    slug: string;
    galleryImages?: Array<{
      fields: {
        file: {
          url: string;
        };
      };
    }>;
  };
}

const GalleriesPage = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * itemsPerPage;

        const response = await client.getEntries({
          content_type: 'project',
          limit: itemsPerPage,
          skip: skip,
        });

        // @ts-ignore
        setProjects(response.items);
        
        // @ts-ignore
        const totalItems = response.total; 
        setTotalPages(Math.ceil(totalItems / itemsPerPage));

      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      
      {/* 1. Блок Пошуку та Заголовку */}
      <header className="mb-10 pt-4">
        <h1 className="text-3xl font-bold mb-4">Каталог галерей</h1>
        
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
                Знайдено {totalPages * itemsPerPage - (totalPages * itemsPerPage - projects.length)} з {totalPages * itemsPerPage} галерей
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
            
            {/* Малюємо картки */}
            {projects.map((item) => {
              const title = item.fields.title || "Без назви";
              const description = item.fields.description || "";
              
              const firstImage = item.fields.galleryImages?.[0];
              const imageUrl = firstImage?.fields?.file?.url 
                ? 'https:' + firstImage.fields.file.url 
                : null;

              return (
                <Link 
                  to={`/gallery/${item.fields.slug}`} 
                  key={item.sys.id} 
                  className="bg-white border border-gray-200 rounded-md hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col h-full"
                >
                   {imageUrl ? (
                     <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
                   ) : (
                     <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                   )}
                   
                   <div className="p-4 flex flex-col flex-grow">
                     <h3 className="font-bold text-lg mb-2">{title}</h3>
                     {description && (
                       <p className="text-gray-600 text-sm line-clamp-3">
                         {description}
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