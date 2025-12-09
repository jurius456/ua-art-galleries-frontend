import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Про нас (About Us)</h1>
      
      {/* Секція 1: Про проєкт */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg h-48">
              <p className="text-sm text-gray-700">Тут буде опис місії, історії або цінностей. {i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Секція 2: Команда */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Наша команда</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[4, 5].map(i => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-bold">Ім'я та Прізвище {i}</h3>
                <p className="text-sm text-gray-500">Позиція / Роль</p>
                <p className="mt-2 text-sm">Короткий опис внеску в проєкт.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default AboutPage;