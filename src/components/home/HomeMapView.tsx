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

const INITIAL_CENTER: [number, number] = [48.3794, 31.1656]; // Geometric center of Ukraine
const INITIAL_ZOOM = 6;
const FOCUS_ZOOM = 15;

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

// Custom SVG Pin Icon
const pinSvg = encodeURIComponent(`
<svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#18181B"/>
  <circle cx="15" cy="15" r="6" fill="white"/>
</svg>
`);

const galleryIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=utf-8,${pinSvg}`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -36],
});

interface Cluster {
  getChildCount: () => number;
}

const createClusterIcon = (cluster: Cluster) => {
  const count = cluster.getChildCount();

  return new L.DivIcon({
    className: 'bg-transparent',
    html: `
      <div class="w-12 h-12 bg-blue-600 text-white font-black text-sm rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.45)] border-4 border-white transform transition-transform hover:scale-110">
        ${count}
      </div>
    `,
    iconSize: [48, 48],
  });
};

/* ===================== DATA ENRICHMENT ===================== */

// Mapping slugs to coordinates (since backend often misses them)
const GALLERY_COORDINATES: Record<string, [number, number]> = {
  // Kyiv
  'pinchuk-art-centre': [50.4418, 30.5222],
  'mystetskyi-arsenal': [50.4363, 30.5540],
  'national-art-museum': [50.4495, 30.5305],
  'khanenko-museum': [50.4410, 30.5144],
  'shcherbenko-art-centre': [50.4365, 30.5160],
  'voloshyn-gallery': [50.4420, 30.5150],
  'ya-gallery-kyiv': [50.4600, 30.5000],
  'the-naked-room': [50.4501, 30.5234],
  'avangarden': [50.4550, 30.4900],

  // Lviv
  'lviv-gallery': [49.8377, 24.0254],
  'pm-gallery': [49.8400, 24.0300],
  'iconart': [49.8420, 24.0320],
  'green-sofa': [49.8410, 24.0290],
  'yaremi-gallery': [49.8390, 24.0280],
  'dzyga': [49.8430, 24.0330],

  // Odesa
  'ofam': [46.4947, 30.7303],
  'invogue': [46.4800, 30.7400],
  'hudpromo': [46.4850, 30.7350],

  // Kharkiv
  'yermilov': [50.0050, 36.2300],
  'municipal-kh': [50.0000, 36.2350],

  // Dnipro
  'artsvit': [48.4647, 35.0462],

  // Ivano-Frankivsk
  'promprylad': [48.9200, 24.7100],
  'csa': [48.9220, 24.7120],
};

/* ===================== MOCK DATA (Fallback) ===================== */
const MOCK_GALLERIES: Gallery[] = [
  {
    id: 'm1', name: 'PinchukArtCentre', city: 'Київ', slug: 'pinchuk-art-centre', short_desc: 'Сучасне мистецтво',
    address: 'test address', image: null, socials: [], year: 2006, latitude: 50.4418, longitude: 30.5222
  },
  {
    id: 'm2', name: 'Мистецький Арсенал', city: 'Київ', slug: 'mystetskyi-arsenal', short_desc: 'Культурний комплекс - Мистецький Арсенал',
    address: 'test address', image: null, socials: [], year: 2011, latitude: 50.4363, longitude: 30.5540
  },
  {
    id: 'm3', name: 'Львівська Галерея Мистецтв', city: 'Львів', slug: 'lviv-gallery', short_desc: 'Найбільший художній музей України',
    address: 'test address', image: null, socials: [], year: 1907, latitude: 49.8377, longitude: 24.0254
  },
  {
    id: 'm4', name: 'Одеський Художній Музей', city: 'Одеса', slug: 'ofam', short_desc: 'Одеський національний художній музей',
    address: 'test address', image: null, socials: [], year: 1899, latitude: 46.4947, longitude: 30.7303
  },
  {
    id: 'm5', name: 'ArtSvit', city: 'Дніпро', slug: 'artsvit', short_desc: 'Галерея сучасного мистецтва',
    address: 'test address', image: null, socials: [], year: 2013, latitude: 48.4647, longitude: 35.0462
  },
];

/* ===================== COMPONENT ===================== */

const HomeMapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const { data: apiGalleries = [] } = useGalleriesQuery();

  // 1. Try to use API galleries
  // 2. Determine coordinates (API or Lookup)
  // 3. If list empty, use MOCK

  const points = useMemo(() => {
    let sourceData = apiGalleries.length > 0 ? apiGalleries : MOCK_GALLERIES;

    const mapped = sourceData.map((g: Gallery) => {
      // Priority: 1. API coords, 2. Lookup coords
      let lat = g.latitude;
      let lng = g.longitude;

      if ((lat == null || lng == null) && g.slug && GALLERY_COORDINATES[g.slug]) {
        [lat, lng] = GALLERY_COORDINATES[g.slug];
      }

      return {
        ...g,
        coords: (lat && lng) ? [Number(lat), Number(lng)] : null,
      };
    });

    return mapped.filter((g) => g.coords !== null) as (Gallery & { coords: [number, number] })[];
  }, [apiGalleries]);

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
