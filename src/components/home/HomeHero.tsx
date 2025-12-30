import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const SLIDES = [
  { id: 1, title: 'Відкрийте нове мистецтво', subtitle: 'Досліджуйте українські галереї', color: 'bg-indigo-600' },
  { id: 2, title: 'Спеціальна виставка', subtitle: 'ПінчукАртЦентр: Весняна колекція', color: 'bg-red-600' },
  { id: 3, title: 'На карті світу', subtitle: 'Знайдіть галереї у вашому місті', color: 'bg-green-600' },
];

const HomeHero = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === SLIDES.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? SLIDES.length - 1 : prevIndex - 1));
  };

  return (
    <section
      className={`
        relative overflow-hidden z-0
        h-64 md:h-96 rounded-lg flex items-center justify-between p-4 transition-colors duration-500
        ${currentSlide.color} text-white
      `}
    >
      {/* Arrow Left */}
      <button
        onClick={handlePrev}
        className="relative z-10 p-3 bg-white/50 rounded-full hover:bg-white hover:text-gray-900 transition"
      >
        <ArrowLeft />
      </button>

      {/* Slider Content */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-16">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">{currentSlide.title}</h1>
        <p className="text-lg md:text-xl font-medium">{currentSlide.subtitle}</p>
        <span className="mt-4 text-sm font-light">
          Слайд {currentSlide.id} з {SLIDES.length}
        </span>
      </div>

      {/* Arrow Right */}
      <button
        onClick={handleNext}
        className="relative z-10 p-3 bg-white/50 rounded-full hover:bg-white hover:text-gray-900 transition"
      >
        <ArrowRight />
      </button>
    </section>
  );
};

export default HomeHero;
