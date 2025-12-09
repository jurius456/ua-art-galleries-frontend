import React from 'react';

const HomeNews = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-6">News</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-200 h-48 rounded-md hover:shadow-lg transition cursor-pointer"></div>
          ))}
      </div>
    </section>
  );
};

export default HomeNews;