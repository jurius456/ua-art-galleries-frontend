import React from 'react';

const HomeAbout = () => {
  return (
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
  );
};

export default HomeAbout;