import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../api/contentful'; 

// Список вкладок (як на макеті)
const TABS = [
  { id: 'artists', name: 'Artists' },
  { id: 'showroom', name: 'Showroom' },
  { id: 'artworks', name: 'Artworks' },
  { id: 'about', name: 'About' },
];

// Тип даних (поля з твого Contentful) - ОНОВЛЕНО
interface GalleryEntry {
  fields: {
    name: string; // <--- ВИПРАВЛЕНО
    city: string; // <--- ВИПРАВЛЕНО
    address: string; // <--- ВИПРАВЛЕНО
    // Решта полів, які потрібні для правої панелі (поки що N/A, бо їх немає в Contentful)
    status: string;
    specialization: string;
    yearOfFoundation: number;
  };
}

const GalleryPage = () => {
  // Зчитуємо slug з URL
  const { slug } = useParams<{ slug: string }>(); 
  
  const [activeTab, setActiveTab] = useState('about');
  const [gallery, setGallery] = useState<GalleryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; 

    const fetchGallery = async () => {
      
      try {
        // ЗАПИТ: Фільтруємо за полем 'fields.slug'
        const response = await client.getEntries({
          content_type: 'project', 
          'fields.slug': slug, 
        });
        
        if (response.items.length > 0) {
            setGallery(response.items[0] as unknown as GalleryEntry);
        } else {
            setGallery(null);
        }

      } catch (error) {
        console.error("Помилка завантаження детальної галереї:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-center">Завантаження деталей галереї...</div>;
  }

  if (!gallery) {
    return <div className="container mx-auto px-6 py-12 text-center text-red-500">Галерею "{slug}" не знайдено.</div>;
  }

  // ВИПРАВЛЕНО: Використовуємо 'name', 'city', 'address'
  const { name, city, address, status, specialization, yearOfFoundation } = gallery.fields;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-10">
        
        {/* 1. Блок Назви та Кнопки */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{name || "Галерея без назви"}</h1>
          {/* ВИПРАВЛЕНО: Виводимо Місто та Адресу */}
          <p className="text-lg text-gray-500 mb-4">{city || 'N/A'}{city && address ? ', ' : ''}{address || 'Місце не вказано'}</p> 
          <button className="bg-orange-500 text-white font-medium py-2 px-6 rounded-md hover:bg-orange-600 transition">
            Follow
          </button>
        </div>

        {/* 2. Навігація вкладками (Tabs) */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-3 text-sm font-medium transition duration-150 ease-in-out
                  ${activeTab === tab.id 
                    ? 'border-b-2 border-black text-black' 
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Контент вкладок */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Ліва колонка (Placeholder/Image) */}
          <div className="col-span-2">
             {activeTab === 'about' && (
                <div className="bg-gray-100 w-full h-80 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500">Основний опис / Фото / Rich Text</p>
                </div>
             )}
          </div>

          {/* Права колонка (About Details) - ВИКОРИСТОВУЄМО ОНОВЛЕНІ ЗМІННІ */}
          <div className="lg:col-span-1 p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            {activeTab === 'about' && (
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="text-green-600 font-semibold">{status || 'N/A'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-700">Specialisation:</span>
                  <span>{specialization || 'N/A'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-700">Year of foundation:</span>
                  <span>{yearOfFoundation || 'N/A'}</span>
                </li>
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GalleryPage;