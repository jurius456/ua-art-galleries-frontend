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
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import type { Gallery } from '../../api/galleries';

/* ===================== MAP CONSTANTS ===================== */

const INITIAL_CENTER: [number, number] = [50.4501, 30.5234];
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
  className: '',
  html: `
    <div style="
      width:14px;
      height:14px;
      background:#18181b;
      border:3px solid white;
      border-radius:9999px;
      box-shadow:0 3px 8px rgba(0,0,0,.35);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ⚠️ deliberately untyped (JS boundary)
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();

  return new L.DivIcon({
    className: '',
    html: `
      <div style="
        width:44px;
        height:44px;
        background:#2563eb;
        color:white;
        font-weight:900;
        font-size:14px;
        border-radius:9999px;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 8px 20px rgba(37,99,235,.45);
        border:4px solid white;
      ">
        ${count}
      </div>
    `,
    iconSize: [44, 44],
  });
};

/* ===================== COMPONENT ===================== */

const HomeMapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const { data: galleries = [] } = useGalleriesQuery();

  const points = useMemo(() => {
    return (galleries as Gallery[])
      .filter((g) => g.latitude && g.longitude)
      .map((g) => ({
        ...g,
        coords: [g.latitude!, g.longitude!] as [number, number],
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
          className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-800"
        >
          <ZoomOut size={12} /> Огляд мапи
        </button>
      </div>

      {/* MAP */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="h-[550px] rounded-[32px] overflow-hidden border border-zinc-100">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            className="h-full w-full"
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
                  <Popup closeButton={false}>
                    <div className="p-4 space-y-3 min-w-[220px]">
                      {/* 
                         У мок-даних був 'type'. В реальних даних його немає.
                         Можна вивести першу літеру назви або прибрати цей бейдж.
                         Поки приберемо або замінимо на city, якщо хочеться.
                      */}

                      <div>
                        <h4 className="font-black text-zinc-800">{g.name}</h4>
                        <p className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase">
                          <MapPin size={10} /> {g.city}
                        </p>
                      </div>

                      <Link
                        to={`/galleries/${g.slug}`}
                        className="flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600"
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
