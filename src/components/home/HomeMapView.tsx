import { useRef, useEffect, useMemo } from 'react';
import { MapPin, ArrowRight, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import type { Gallery } from '../../api/galleries';

/* ===================== MAP CONSTANTS ===================== */

const INITIAL_CENTER: [number, number] = [49.0, 31.0]; // Center of Ukraine roughly
const INITIAL_ZOOM = 6;
const FOCUS_ZOOM = 14;

/* ===================== MAP REF CONTROLLER ===================== */

const MapRefController = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  return null;
};

/* ===================== ICONS ===================== */

const galleryIcon = new L.DivIcon({
  className: 'bg-transparent', // Wrapper class
  html: `
    <div class="w-3.5 h-3.5 bg-zinc-900 border-[3px] border-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.35)]"></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface Cluster {
  getChildCount: () => number;
}

const createClusterIcon = (cluster: Cluster) => {
  const count = cluster.getChildCount();

  return new L.DivIcon({
    className: 'bg-transparent',
    html: `
      <div class="w-11 h-11 bg-blue-600 text-white font-black text-sm rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.45)] border-4 border-white">
        ${count}
      </div>
    `,
    iconSize: [44, 44],
  });
};

/* ===================== MOCK DATA (Fallback) ===================== */
// Expanded mock data to evince clustering
const MOCK_GALLERIES: Partial<Gallery>[] = [
  // Kyiv
  { id: '1', name: 'PinchukArtCentre', city: 'Київ', latitude: 50.4418, longitude: 30.5222, slug: 'pinchuk', short_desc: 'Сучасне мистецтво' },
  { id: '2', name: 'Мистецький Арсенал', city: 'Київ', latitude: 50.4363, longitude: 30.5540, slug: 'arsenal', short_desc: 'Культурний комплекс' },
  { id: '3', name: 'The Naked Room', city: 'Київ', latitude: 50.4501, longitude: 30.5234, slug: 'naked-room', short_desc: 'Галерея сучасного мистецтва' },
  { id: '4', name: 'Ya Gallery', city: 'Київ', latitude: 50.4550, longitude: 30.5100, slug: 'ya-gallery-kyiv', short_desc: 'Арт-центр Павла Гудімова' },
  { id: '5', name: 'Vartsash', city: 'Київ', latitude: 50.4600, longitude: 30.5000, slug: 'vartsash', short_desc: 'Експериментальний простір' },

  // Lviv
  { id: '6', name: 'Львівська Галерея Мистецтв', city: 'Львів', latitude: 49.8377, longitude: 24.0254, slug: 'lviv-gallery', short_desc: 'Музей європейського мистецтва' },
  { id: '7', name: 'PM Gallery', city: 'Львів', latitude: 49.8400, longitude: 24.0300, slug: 'pm-gallery', short_desc: 'Простір сучасного мистецтва' },
  { id: '8', name: 'Iconart', city: 'Львів', latitude: 49.8420, longitude: 24.0320, slug: 'iconart', short_desc: 'Галерея сучасного сакрального мистецтва' },
  { id: '9', name: 'Зелена Канапа', city: 'Львів', latitude: 49.8410, longitude: 24.0290, slug: 'green-sofa', short_desc: 'Мистецька галерея' },

  // Odesa
  { id: '10', name: 'Одеський Художній Музей', city: 'Одеса', latitude: 46.4947, longitude: 30.7303, slug: 'ofam', short_desc: 'Класичне та сучасне мистецтво' },
  { id: '11', name: 'Invogue#Art', city: 'Одеса', latitude: 46.4800, longitude: 30.7400, slug: 'invogue', short_desc: 'Галерея сучасного мистецтва' },

  // Kharkiv
  { id: '12', name: 'YermilovCentre', city: 'Харків', latitude: 50.0050, longitude: 36.2300, slug: 'yermilov', short_desc: 'Центр сучасного мистецтва' },
  { id: '13', name: 'Municipal Gallery', city: 'Харків', latitude: 50.0000, longitude: 36.2350, slug: 'municipal-kh', short_desc: 'Муніципальна галерея' },

  // Dnipro
  { id: '14', name: 'ArtSvit', city: 'Дніпро', latitude: 48.4647, longitude: 35.0462, slug: 'artsvit', short_desc: 'Галерея сучасного мистецтва' },
];

/* ===================== COMPONENT ===================== */

const HomeMapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const { data: apiGalleries = [] } = useGalleriesQuery();

  // Use API data only if it has coordinates, otherwise fallback to MOCK
  const hasValidCoords = apiGalleries.some((g: Gallery) => g.latitude && g.longitude);
  const galleries = hasValidCoords ? apiGalleries : MOCK_GALLERIES;

  const points = useMemo(() => {
    return (galleries as Gallery[])
      .filter((g) => g.latitude && g.longitude)
      .map((g) => ({
        ...g,
        coords: [Number(g.latitude), Number(g.longitude)] as [number, number],
      }));
  }, [galleries]);

  const zoomOut = () => {
    mapRef.current?.setView(INITIAL_CENTER, INITIAL_ZOOM, { animate: true });
  };

  const zoomToGallery = (coords: [number, number]) => {
    mapRef.current?.setView(coords, FOCUS_ZOOM, { animate: true });
  };

  return (
    <section className="space-y-8 py-16">
      {/* HEADER */}
      <div className="container mx-auto px-6 max-w-6xl flex justify-between items-end">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">
            Карта архіву
          </p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            Карта <span className="text-zinc-300">галерей</span>
          </h2>
        </div>

        <button
          onClick={zoomOut}
          className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          <ZoomOut size={12} /> Огляд мапи
        </button>
      </div>

      {/* MAP */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="h-[550px] rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

            <MapRefController mapRef={mapRef} />

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterIcon}
            >
              {points.map((g) => (
                <Marker
                  key={g.id}
                  position={g.coords}
                  icon={galleryIcon}
                  eventHandlers={{
                    click: (e) => {
                      zoomToGallery(g.coords);
                      e.target.openPopup();
                    },
                  }}
                >
                  <Popup closeButton={false} className="custom-popup">
                    <div className="p-4 space-y-3 min-w-[220px]">
                      <div>
                        <h4 className="font-black text-zinc-800 text-lg leading-tight">{g.name}</h4>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase mt-1">
                          <MapPin size={10} /> {g.city}
                        </p>
                      </div>

                      {g.short_desc && (
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {g.short_desc}
                        </p>
                      )}

                      <Link
                        to={`/galleries/${g.slug}`}
                        className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                      >
                        Відкрити <ArrowRight size={12} />
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default HomeMapView;
