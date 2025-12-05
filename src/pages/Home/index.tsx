// src/pages/Home/index.tsx - ФІНАЛЬНА ЧИСТА ВЕРСІЯ
import { ArrowRight, ArrowLeft, Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-6 py-8 space-y-16">
      
      {/* 1. Секція Банера */}
      <section className="relative bg-gray-200 h-64 md:h-96 rounded-lg flex items-center justify-between px-4">
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowLeft /></button>
        <span className="text-gray-400 font-medium">Hero Banner / Slider</span>
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowRight /></button>
      </section>

      {/* 2. Секція Новин */}
      <section>
        <h2 className="text-xl font-bold mb-6">News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-200 h-48 rounded-md hover:shadow-lg transition cursor-pointer"></div>
            ))}
        </div>
      </section>

      {/* 🛑 ВИДАЛЕНО: Тут був довгий список галерей */}
      
      {/* 3. Секція Карти (Placeholder) */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Galleries / Map View</h2>
            {/* Посилання на нову сторінку зі списком */}
            <Link to="/galleries" className="p-2 hover:bg-gray-100 rounded-md">
                <Filter size={24} />
            </Link>
        </div>
        <div className="bg-yellow-100 border-2 border-yellow-300 h-[500px] rounded-lg relative flex items-center justify-center">
            <span className="text-yellow-800 font-bold flex flex-col items-center gap-2">
                <MapPin size={48} />
                Інтерактивна Карта України (буде тут)
            </span>
        </div>
      </section>

      {/* 4. Секція Про Проєкт (About) */}
      <section className="pb-12">
        <h2 className="text-xl font-bold mb-6">About the project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
            <div className="bg-gray-200 rounded-lg h-full flex items-end p-6">
                <span className="font-medium">Our mission</span>
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
                <div className="bg-gray-200 rounded-lg flex items-end p-4">Team</div>
                <div className="bg-gray-200 rounded-lg flex items-end p-4">Roadmap</div>
                <div className="bg-gray-200 rounded-lg flex items-end p-4">Contacts</div>
                <div className="bg-gray-200 rounded-lg flex items-end p-4">Partners</div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;