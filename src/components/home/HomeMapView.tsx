import { useState } from 'react';
import { MapPin, ArrowRight, Heart, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

// Дані залишаємо для стабільності
const GALLERIES_WITH_COORDS = [
  { id: 1, slug: 'halereya-kuznya', name: 'Галерея Кузня', city: 'Київ', coords: [50.4633, 30.5130], type: "Contemporary" },
  { id: 2, slug: 'pinchuk-art-centre', name: 'PinchukArtCentre', city: 'Київ', coords: [50.4411, 30.5208], type: "Contemporary" },
  { id: 3, slug: 'the-naked-room', name: 'The Naked Room', city: 'Київ', coords: [50.4531, 30.5115], type: "Photo" },
  { id: 4, slug: 'art-svit', name: 'Арт-центр Світ', city: 'Львів', coords: [49.8397, 24.0297], type: "Classic" },
  { id: 5, slug: 'museum-ssm', name: 'Музей ССМ', city: 'Одеса', coords: [46.4825, 30.7233], type: "Classic" },
  { id: 6, slug: 'ya-gallery', name: 'Я Галерея', city: 'Львів', coords: [49.8324, 24.0351], type: "Mix" },
];

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  if (center) map.flyTo(center, zoom, { duration: 1.5 });
  return null;
};

const createCustomIcon = (isActive: boolean) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-zinc-800/10 rounded-full animate-ping ${isActive ? 'opacity-100' : 'opacity-0'}"></div>
      <div class="w-3.5 h-3.5 ${isActive ? 'bg-blue-600 scale-125' : 'bg-zinc-800'} border-2 border-white rounded-full shadow-md transition-all duration-300"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const HomeMapView = () => {
  const initialPosition: [number, number] = [50.4501, 30.5234];
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section className="space-y-8 py-16">
      {/* 1. Header: Вирівняно по ширині інших елементів */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-blue-600"></span>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">Карта Архіву</p>
            </div>
            {/* Текст змінено та зменшено за твоїм запитом */}
            <h2 className="text-2xl md:text-3xl font-black text-zinc-800 tracking-tighter uppercase leading-tight">
              Карта <span className="text-zinc-300">Галерей</span>
            </h2>
          </div>
          
          <button 
            onClick={() => { setActiveCoords(initialPosition); setActiveId(null); }}
            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            <Maximize2 size={12} /> Центрувати мапу
          </button>
        </div>
      </div>

      {/* 2. Map Container: Ширина max-w-6xl */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="relative h-[550px] w-full rounded-[32px] overflow-hidden border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
          
          <MapContainer 
            center={initialPosition} 
            zoom={6} 
            className="h-full w-full"
            scrollWheelZoom={false}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapController center={activeCoords || initialPosition} zoom={activeCoords ? 14 : 6} />
            
            {GALLERIES_WITH_COORDS.map((g) => (
              <Marker 
                key={g.id} 
                position={g.coords as [number, number]} 
                icon={createCustomIcon(activeId === g.id)}
                eventHandlers={{ click: () => { setActiveCoords(g.coords as [number, number]); setActiveId(g.id); } }}
              >
                <Popup closeButton={false} className="custom-popup">
                  <div className="p-4 space-y-4 min-w-[220px]">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{g.type}</span>
                      <button className="text-zinc-200 hover:text-red-500 transition-colors"><Heart size={14} /></button>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-zinc-800 leading-none mb-1">{g.name}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase"><MapPin size={10} /> {g.city}</div>
                    </div>
                    <Link to={`/galleries/${g.slug}`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all group/link">
                      Відкрити архів <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Швидкий вибір */}
          <div className="absolute bottom-6 left-6 z-[1000] flex gap-1.5 overflow-x-auto no-scrollbar max-w-[80%]">
            {GALLERIES_WITH_COORDS.slice(0, 4).map(g => (
              <button
                key={g.id}
                onClick={() => { setActiveCoords(g.coords as [number, number]); setActiveId(g.id); }}
                className={`flex-shrink-0 px-4 py-2 bg-white/90 backdrop-blur-md border rounded-2xl text-[8px] font-black uppercase tracking-tight transition-all ${activeId === g.id ? 'border-blue-600 text-blue-600 shadow-md scale-105' : 'border-zinc-100 text-zinc-400 hover:text-zinc-800'}`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMapView;