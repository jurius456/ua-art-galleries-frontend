// src/pages/Gallery/index.tsx - РЕФАКТОРИНГ НА МОК-ДАНІ
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { client } from '../../api/contentful'; <-- ВИДАЛЕНО

// МОК-ДАНІ для деталей (щоб сторінка не була порожньою)
const MOCK_DETAILS_DATA = {
    'halereya-kuznya': {
        name: "Галерея Кузня (МОК ДЕТАЛІ)",
        location: "Київ, вул. Нижній Вал 37/20",
        status: "Active",
        specialization: "Сучасне українське мистецтво",
        yearOfFoundation: 2018,
        description: "Це місце для демонстрації мистецтва в контексті міста. Тут проходять найцікавіші виставки.",
    },
    'pinchuk-art-centre': {
        name: "PinchukArtCentre (МОК ДЕТАЛІ)",
        location: "Київ, вул. Велика Васильківська, 1/3-2",
        status: "Active",
        specialization: "Міжнародне сучасне мистецтво",
        yearOfFoundation: 2006,
        description: "Міжнародний центр сучасного мистецтва для нової генерації.",
    }
    // ... інші галереї можуть бути тут додані пізніше
};

// Тип даних, який ми очікуємо від бекенду
interface GalleryDetails {
  name: string;
  location: string;
  status: string;
  specialization: string;
  yearOfFoundation: number;
  description: string;
}

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>(); 
  
  const [activeTab, setActiveTab] = useState('about');
  const [gallery, setGallery] = useState<GalleryDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; 

    const fetchMockGallery = () => {
      setLoading(true);

      // 🚨 ІМІТАЦІЯ ЗАПИТУ ДО БЕКЕНДУ:
      setTimeout(() => {
        const data = MOCK_DETAILS_DATA[slug as keyof typeof MOCK_DETAILS_DATA];
        
        if (data) {
            setGallery(data);
        } else {
            setGallery(null); // Не знайдено, або не має мок-даних
        }
        setLoading(false);
      }, 500); 
    };

    fetchMockGallery();
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-center">Завантаження деталей галереї...</div>;
  }

  if (!gallery) {
    return <div className="container mx-auto px-6 py-12 text-center text-red-500">Галерею "{slug}" не знайдено в мок-даних.</div>;
  }

  const { name, location, status, specialization, yearOfFoundation, description } = gallery;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-10">
        
        {/* 1. Блок Назви та Кнопки */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{name || "Галерея без назви"}</h1>
          <p className="text-lg text-gray-500 mb-4">{location || 'Місце не вказано'}</p>
          {/* ... (Кнопка Follow) ... */}
        </div>

        {/* 2. Навігація вкладками (Tabs) */}
        {/* ... (БЕЗ ЗМІН) ... */}
        
        {/* 3. Контент вкладок */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Ліва колонка */}
          <div className="col-span-2">
             {activeTab === 'about' && (
                <div className="p-6 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">{description}</p>
                </div>
             )}
          </div>

          {/* Права колонка (About Details) */}
          <div className="lg:col-span-1 p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            {activeTab === 'about' && (
              <ul className="space-y-3 text-sm">
                {/* ... (Details list) ... */}
                <li className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="text-green-600 font-semibold">{status || 'N/A'}</span>
                </li>
                {/* ... (Інші поля) ... */}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GalleryPage;