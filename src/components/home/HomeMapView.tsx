import { useRef, useEffect, useMemo, type MutableRefObject } from 'react';
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
import { useTranslation } from 'react-i18next';
import { getGalleryName, getGalleryCity, getGalleryShortDescription } from '../../utils/gallery';

/* ===================== MAP CONSTANTS ===================== */

const INITIAL_CENTER: [number, number] = [48.3794, 31.1656]; // Geometric center of Ukraine
const INITIAL_ZOOM = 6;

/* ===================== MAP REF CONTROLLER ===================== */

const MapRefController = ({
  mapRef,
}: {
  mapRef: MutableRefObject<L.Map | null>;
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
      <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.5)] border-4 border-white transform transition-all duration-200 hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,99,235,0.6)] cursor-pointer">
        ${count}
      </div>
    `,
    iconSize: [56, 56],
  });
};

/* ===================== DATA ENRICHMENT ===================== */

// Mapping slugs to coordinates (Specific locations)
const GALLERY_COORDINATES: Record<string, [number, number]> = {
  // Kyiv
  'pinchukartcentre': [50.4418, 30.5222],
  'mystetskyi-arsenal': [50.4363, 30.5540],
  'national-art-museum': [50.4495, 30.5305],
  'khanenko-museum': [50.4410, 30.5144],
  'the-naked-room': [50.4501, 30.5234],
  'arttsentr-ya-halereya-kyyiv': [50.4600, 30.5000], // Ya Gallery
  'avangarden-gallery': [50.4550, 30.4900],
  'shcherbenko-art-centre': [50.4365, 30.5160],
  'voloshyn-gallery': [50.4420, 30.5150],

  // Lviv
  'lviv-gallery': [49.8377, 24.0254],
  'iconart': [49.8420, 24.0320],
  'pm-gallery': [49.8400, 24.0300],
  'dzyga': [49.8430, 24.0330],

  // Odesa
  'ofam': [46.4947, 30.7303], // Odesa Fine Arts Museum
  'dymchuk-gallery': [50.4600, 30.5100], // Dymchuk Gallery (Kyiv)
  'invogue': [46.4800, 30.7400],

  // Dnipro
  'halereya-artsvit-v-stinakh-dccc': [48.4647, 35.0462], // Artsvit

  // Kharkiv
  'yermilov': [50.0050, 36.2300],
  'municipal-kh': [50.0000, 36.2350],
};

const CITY_COORDINATES: Record<string, [number, number]> = {
  // Ukrainian cities (Ukrainian)
  'Київ': [50.4501, 30.5234],
  'Львів': [49.8397, 24.0297],
  'Одеса': [46.4825, 30.7233],
  'Дніпро': [48.4647, 35.0462],
  'Харків': [49.9935, 36.2304],
  'Івано-Франківськ': [48.9226, 24.7111],
  'Чернівці': [48.2909, 25.9348],
  'Ужгород': [48.6208, 22.2879],
  'Луцьк': [50.7472, 25.3254],
  'Тернопіль': [49.5535, 25.5948],
  'Вінниця': [49.2331, 28.4682],
  'Херсон': [46.6354, 32.6169],
  'Полтава': [49.5883, 34.5514],
  'Чернігів': [51.4982, 31.2893],
  'Запоріжжя': [47.8388, 35.1396],
  // Ukrainian cities (English)
  'Kyiv': [50.4501, 30.5234],
  'Lviv': [49.8397, 24.0297],
  'Odesa': [46.4825, 30.7233],
  'Dnipro': [48.4647, 35.0462],
  'Kharkiv': [49.9935, 36.2304],
  // International cities
  'Greenwich, Connecticut 06836, USA': [41.0262, -73.6282],
  'Greenwich, Connecticut': [41.0262, -73.6282],
  'Greenwich': [41.0262, -73.6282],
  'Connecticut': [41.6032, -73.0877],
  'Paphos': [34.7571, 32.4134],
  'Cyprus': [35.1264, 33.4299],
  'Пафос': [34.7571, 32.4134],
  'Кіпр': [35.1264, 33.4299],
};

/* ===================== MOCK DATA (Fallback) ===================== */
const MOCK_GALLERIES: Gallery[] = [
  {
    id: 'mock-pinchukartcentre', name_ua: 'PinchukArtCentre', name_en: 'PinchukArtCentre', city_ua: 'Київ', city_en: 'Kyiv', slug: 'pinchukartcentre',
    short_description_ua: 'Сучасне мистецтво', short_description_en: 'Contemporary art',
    address_ua: 'тестова адреса', address_en: 'test address', image: null, cover_image: null,
    email: null, phone: null, website: null, social_links: null, founding_year: '2006',
    latitude: 50.4418, longitude: 30.5222, status: true, specialization_ua: null, specialization_en: null,
    created_at: '', updated_at: ''
  },
];

/* ===================== COMPONENT ===================== */

const HomeMapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const { data: apiGalleries = [] } = useGalleriesQuery();
  const { i18n, t } = useTranslation();

  // 1. Try to use API galleries
  // 2. Determine coordinates (API or Lookup)
  // 3. If list empty, use MOCK

  const points = useMemo(() => {
    let sourceData = apiGalleries.length > 0 ? apiGalleries : MOCK_GALLERIES;

    console.log('Total source galleries:', sourceData.length);

    const mapped = sourceData.map((g: Gallery) => {
      let lat = g.latitude;
      let lng = g.longitude;

      // 1. Try Specific Lookup (if API coords are missing)
      if ((lat == null || lng == null) && g.slug && GALLERY_COORDINATES[g.slug]) {
        [lat, lng] = GALLERY_COORDINATES[g.slug];
        console.log(`Using specific coords for ${g.slug}:`, lat, lng);
      }

      // 2. Try City Lookup with Jitter (fallback if API and specific lookup are missing)
      const cityName = getGalleryCity(g, i18n.language);
      if ((lat == null || lng == null) && cityName && CITY_COORDINATES[cityName]) {
        const [cityLat, cityLng] = CITY_COORDINATES[cityName];
        // Add random jitter to avoid perfect stacking (approx 500m radius)
        lat = cityLat + (Math.random() - 0.5) * 0.01;
        lng = cityLng + (Math.random() - 0.5) * 0.01;
        console.log(`Using city coords for ${g.slug} (${cityName}):`, lat, lng);
      }

      const hasCoords = lat != null && lng != null;
      if (!hasCoords) {
        console.warn(`No coordinates found for gallery: ${g.slug} (${getGalleryName(g, i18n.language)})`);
      }

      return {
        ...g,
        coords: hasCoords ? [Number(lat), Number(lng)] as [number, number] : null,
      };
    });

    const withCoords = mapped.filter((g): g is Gallery & { coords: [number, number] } => g.coords !== null);
    console.log('Mapped with coords:', withCoords.length);

    return withCoords;
  }, [apiGalleries, i18n.language]);

  const zoomOut = () => {
    mapRef.current?.setView(INITIAL_CENTER, INITIAL_ZOOM, { animate: true });
  };

  return (
    <section className="space-y-8 py-16">
      {/* HEADER */}
      <div className="container mx-auto px-6 max-w-6xl flex justify-between items-end">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">
            {t('home.map.badge')}
          </p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            {t('home.map.titlePrefix')} <span className="text-zinc-300">{t('home.map.titleSuffix')}</span>
          </h2>
        </div>

        <button
          onClick={zoomOut}
          className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          <ZoomOut size={12} /> {t('home.map.zoomOut')}
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
              maxClusterRadius={60}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              zoomToBoundsOnClick={true}
              spiderfyDistanceMultiplier={1.5}
            >
              {points.map((g) => {
                const name = getGalleryName(g, i18n.language);
                const city = getGalleryCity(g, i18n.language);
                const shortDesc = getGalleryShortDescription(g, i18n.language);

                return (
                  <Marker
                    key={g.id}
                    position={g.coords}
                    icon={galleryIcon}
                    eventHandlers={{
                      click: (e) => {
                        // Don't zoom here - let cluster handle it
                        // Just open the popup
                        e.target.openPopup();
                      },
                    }}
                  >
                    <Popup closeButton={false} className="custom-popup">
                      <div className="p-4 space-y-3 min-w-[220px]">
                        <div>
                          <h4 className="font-black text-zinc-800 text-lg leading-tight">{name}</h4>
                          <p className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase mt-1">
                            <MapPin size={10} /> {city}
                          </p>
                        </div>

                        {shortDesc && (
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {shortDesc}
                          </p>
                        )}

                        <Link
                          to={`/galleries/${g.slug}`}
                          className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                        >
                          {t('home.map.open')} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default HomeMapView;
