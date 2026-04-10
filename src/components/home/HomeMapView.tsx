import { useRef, useEffect, useState, type MutableRefObject } from 'react';
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
import { getGalleryName, getGalleryCity, getGalleryShortDescription, getGalleryAddress } from '../../utils/gallery';
import { geocodeAddress, sanitizeAndBuildQueries } from '../../utils/geocode';
import { useTheme } from '../../hooks/useTheme';

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
  <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#2563EB"/>
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

import { GALLERY_COORDINATES, CITY_COORDINATES, seededRandom } from '../../utils/maps';

/* ===================== MAP CONSTANTS ===================== */

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
  const { theme } = useTheme();

  // 1. Try to use API galleries
  // 2. Determine coordinates (API or Lookup)
  // 3. If list empty, use MOCK

  const [points, setPoints] = useState<(Gallery & { coords: [number, number] })[]>([]);

  useEffect(() => {
    let isMounted = true;
    let sourceData = apiGalleries.length > 0 ? apiGalleries : MOCK_GALLERIES;

    const loadPoints = async () => {
      // First pass: fast coordinates
      const immediatePoints = sourceData.map((g) => {
        let lat = g.latitude;
        let lng = g.longitude;

        if ((lat == null || lng == null) && g.slug && GALLERY_COORDINATES[g.slug]) {
          [lat, lng] = GALLERY_COORDINATES[g.slug];
        }

        const cityName = getGalleryCity(g, i18n.language) || '';
        const hasExact = lat != null && lng != null;

        if (!hasExact && cityName && CITY_COORDINATES[cityName]) {
          const [cityLat, cityLng] = CITY_COORDINATES[cityName];
          const latJitter = (seededRandom(g.slug + 'lat') - 0.5) * 0.01;
          const lngJitter = (seededRandom(g.slug + 'lng') - 0.5) * 0.01;
          lat = cityLat + latJitter;
          lng = cityLng + lngJitter;
        }

        return { 
          ...g, 
          coords: (lat != null && lng != null) ? [Number(lat), Number(lng)] as [number, number] : null, 
          _hasExact: hasExact 
        };
      }).filter(g => g.coords !== null) as (Gallery & { coords: [number, number], _hasExact: boolean })[];

      if (isMounted) setPoints(immediatePoints);

      // Async pass: fine geocoding
      for (const g of immediatePoints) {
        if (!isMounted) break;
        if (g._hasExact) continue;

        const address = getGalleryAddress(g, i18n.language) || '';
        const cityName = getGalleryCity(g, i18n.language) || '';
        
        const queries = sanitizeAndBuildQueries(address, cityName);

        if (queries.length > 0) {
           const addressKey = `${cityName}-${address}`;
           const geocoded = await geocodeAddress(addressKey, queries);
           if (geocoded && isMounted) {
              setPoints(prev => prev.map(p => p.id === g.id ? { ...p, coords: geocoded, _hasExact: true } : p));
           }
        }
      }
    };

    loadPoints();

    return () => { isMounted = false; };
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
        <div className="h-[550px] rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white relative z-10 transition-all duration-300">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer 
              key={theme}
              url={theme === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} 
            />

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
