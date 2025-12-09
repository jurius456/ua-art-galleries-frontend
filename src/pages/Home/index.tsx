// src/pages/Home/index.tsx
import React from 'react';
import HomeHero from '../../components/home/HomeHero.tsx';
import HomeNews from '../../components/home/HomeNews.tsx';
import HomeMapView from '../../components/home/HomeMapView.tsx';
import HomeAbout from '../../components/home/HomeAbout.tsx';

const HomePage = () => {
  return (
    <div className="container mx-auto px-6 py-8 space-y-16">
      <HomeHero />
      <HomeNews />
      <HomeMapView />
      <HomeAbout />
    </div>
  );
};

export default HomePage;