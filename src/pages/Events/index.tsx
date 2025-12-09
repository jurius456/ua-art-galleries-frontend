import React from 'react';

const EventsPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Події (Events)</h1>
      
      {/* Блок Фільтрів */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Тут будуть фільтри за містом, датою та типом події.</p>
      </div>

      {/* Секція Подій */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gray-300"></div> {/* Фото події */}
              <div className="p-4">
                <p className="text-sm text-orange-600 font-semibold mb-1">20-25 Грудня 2025</p>
                <h2 className="text-xl font-bold line-clamp-2">Назва виставки або події {i}</h2>
                <p className="text-sm text-gray-600 mt-2">Київ Арт Центр / Опис події...</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;