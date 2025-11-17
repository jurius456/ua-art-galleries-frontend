import { ArrowRight, ArrowLeft, Filter, MapPin } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-6 py-8 space-y-16">
      
      {/* 1. Секція Банера (Hero Section) */}
      <section className="relative bg-gray-200 h-64 md:h-96 rounded-lg flex items-center justify-between px-4">
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowLeft /></button>
        <span className="text-gray-400 font-medium">Hero Banner / Slider</span>
        <button className="p-2 bg-white/50 rounded-full hover:bg-white transition"><ArrowRight /></button>
      </section>

      {/* 2. Секція Новин (News) */}
      <section>
        <h2 className="text-xl font-bold mb-6">News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-200 h-48 rounded-md hover:shadow-lg transition cursor-pointer"></div>
            ))}
        </div>
      </section>

      {/* 3. Секція Карти та Фільтрів */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Galleries / Filters</h2>
            <button className="p-2 hover:bg-gray-100 rounded-md">
                <Filter size={24} />
            </button>
        </div>
        {/* Заглушка для карти */}
        <div className="bg-yellow-100 border-2 border-yellow-300 h-[500px] rounded-lg relative flex items-center justify-center">
            <span className="text-yellow-800 font-bold flex flex-col items-center gap-2">
                <MapPin size={48} />
                Інтерактивна Карта України (буде тут)
            </span>
            {/* Імітація пінів на карті */}
            <div className="absolute top-1/3 left-1/4 text-black"><MapPin fill="black" /></div>
            <div className="absolute top-1/2 left-1/2 text-black"><MapPin fill="black" /></div>
            <div className="absolute bottom-1/3 right-1/3 text-black"><MapPin fill="black" /></div>
        </div>
      </section>

      {/* 4. Секція Про Проєкт (About) */}
      <section className="pb-12">
        <h2 className="text-xl font-bold mb-6">About the project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
            {/* Ліва велика колонка */}
            <div className="bg-gray-200 rounded-lg h-full flex items-end p-6">
                <span className="font-medium">Our mission</span>
            </div>
            {/* Права колонка з сіткою 2х2 */}
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