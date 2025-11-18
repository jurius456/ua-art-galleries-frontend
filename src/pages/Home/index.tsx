import { useEffect, useState } from 'react';
import { client } from '../../api/contentful';
import { ArrowRight, ArrowLeft, Filter, MapPin } from 'lucide-react';

// 1. Додаємо description в інтерфейс
interface ProjectItem {
  sys: { id: string };
  fields: {
    title: string;
    description?: string; // <-- Додали це поле (знак ? означає, що воно може бути пустим)
    galleryImages?: Array<{
      fields: {
        file: {
          url: string;
        };
      };
    }>;
  };
}

const HomePage = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'project',
        });

        // @ts-ignore
        setProjects(response.items);
        console.log("Дані з Contentful:", response.items);
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 space-y-16">
      
      {/* Секція Банера */}
      <section className="relative bg-gray-200 h-64 md:h-96 rounded-lg flex items-center justify-between px-4">
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowLeft /></button>
        <span className="text-gray-400 font-medium">Hero Banner / Slider</span>
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowRight /></button>
      </section>

      {/* Секція Проектів */}
      <section>
        <h2 className="text-xl font-bold mb-6">Проекти (з Contentful)</h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Завантаження даних...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((item) => {
              const title = item.fields.title || "Без назви";
              const description = item.fields.description || ""; // Отримуємо опис
              
              // Беремо першу картинку з масиву
              const firstImage = item.fields.galleryImages?.[0];
              const imageUrl = firstImage?.fields?.file?.url 
                ? 'https:' + firstImage.fields.file.url 
                : null;

              return (
                <div key={item.sys.id} className="bg-white border border-gray-200 rounded-md hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col h-full">
                   {/* Картинка */}
                   {imageUrl ? (
                     <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
                   ) : (
                     <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                   )}
                   
                   {/* Текстова частина */}
                   <div className="p-4 flex flex-col flex-grow">
                     <h3 className="font-bold text-lg mb-2">{title}</h3>
                     
                     {/* Виведення опису */}
                     {description && (
                       <p className="text-gray-600 text-sm line-clamp-3">
                         {description}
                       </p>
                     )}
                     {/* line-clamp-3 обріже текст трьома рядками, якщо він дуже довгий */}
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Секція Карти */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Galleries / Filters</h2>
            <button className="p-2 hover:bg-gray-100 rounded-md"><Filter size={24} /></button>
        </div>
        <div className="bg-yellow-100 border-2 border-yellow-300 h-[500px] rounded-lg relative flex items-center justify-center">
            <span className="text-yellow-800 font-bold flex flex-col items-center gap-2">
                <MapPin size={48} />
                Інтерактивна Карта
            </span>
        </div>
      </section>

    </div>
  );
};

export default HomePage;