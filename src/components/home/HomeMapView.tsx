import { Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const HomeMapView = () => {
  const position: [number, number] = [50.4501, 30.5234];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Географія</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Галереї на мапі</h2>
        </div>
        <Link to="/galleries" className="px-5 py-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all">
          <Filter size={18} /> Список галерей
        </Link>
      </div>

      <div className="relative h-[550px] w-full rounded-[40px] overflow-hidden border border-zinc-100 shadow-2xl shadow-zinc-200/50">
        <MapContainer center={position} zoom={6} className="h-full w-full z-0">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {/* ... Маркери залишаються тими ж ... */}
        </MapContainer>
      </div>
    </section>
  );
};

export default HomeMapView;