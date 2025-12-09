import { Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

// 🚨 ІМПОРТ REACT LEAFLET
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Обов'язкові стилі Leaflet

// 🚨 ВИПРАВЛЕННЯ ІКОНКИ LEAFLET
// Leaflet має проблему з пошуком іконок у пакувальниках, як Vite.
// Ми імпортуємо іконку вручну та перевизначаємо її
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


// 🚨 МОК-ДАНІ: Точки галерей
const MOCK_GALLERIES = [
    { id: 1, name: 'Галерея Кузня', lat: 50.4633, lng: 30.5186, city: 'Київ' },
    { id: 2, name: 'PinchukArtCentre', lat: 50.4435, lng: 30.5235, city: 'Київ' },
    { id: 3, name: 'Львівська Галерея', lat: 49.8397, lng: 24.0297, city: 'Львів' },
    { id: 4, name: 'Одеський Арт-Центр', lat: 46.4717, lng: 30.7303, city: 'Одеса' },
];

const HomeMapView = () => {
    // Координати центру України або великого міста (Київ)
    const position: [number, number] = [50.4501, 30.5234]; 
    const zoomLevel = 6; // Рівень зуму для охоплення більшої території України

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Галереї на мапі</h2>
                <Link to="/galleries" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                    <Filter size={20} />
                    Перейти до списку
                </Link>
            </div>
            
            {/* 🚨 КОМПОНЕНТ КАРТИ */}
            <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
                <MapContainer 
                    center={position} 
                    zoom={zoomLevel} 
                    scrollWheelZoom={false} 
                    className="h-full w-full"
                >
                    {/* Базовий шар (OpenStreetMap) */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Маркери з мок-даними */}
                    {MOCK_GALLERIES.map((gallery) => (
                        <Marker key={gallery.id} position={[gallery.lat, gallery.lng]}>
                            {/* Спливаюче вікно при кліку */}
                            <Popup>
                                <div className="font-bold">{gallery.name}</div>
                                <div className="text-sm text-gray-600">{gallery.city}</div>
                                <a href={`/gallery/${gallery.name.toLowerCase().replace(/\s/g, '-')}`} className="text-blue-500 text-xs mt-1 block">Деталі →</a>
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </section>
    );
};

export default HomeMapView;