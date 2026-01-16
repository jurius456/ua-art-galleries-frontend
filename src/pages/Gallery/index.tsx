import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

type GalleryDetail = {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  image: string | null;
  socials: any[];
  short_desc: string;
  year: number | null;

  description: any;
  founders: string;
  curators: string;
  artists: string[];
  contacts: {
    email: string;
    phone: string;
    website: string;
  };
};

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);

    fetch(`http://localhost:8000/api/galleries/${slug}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setGallery(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 text-[10px] font-black uppercase tracking-widest">
        Loading_Gallery_Data...
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
          404_DATA_NOT_FOUND
        </p>
        <Link
          to="/galleries"
          className="text-zinc-800 font-black uppercase text-[10px] tracking-widest border-b border-zinc-800"
        >
          Повернутись
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-32 animate-in fade-in duration-700">
      <div className="container mx-auto px-6 max-w-6xl pt-12">
        {/* BACK */}
        <Link
          to="/galleries"
          className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-800 transition-all text-[10px] font-black uppercase tracking-widest mb-16"
        >
          <ArrowLeft size={14} />
          Архів галерей
        </Link>

        {/* TITLE */}
        <h1 className="text-5xl md:text-7xl font-black text-zinc-800 tracking-tighter uppercase mb-4">
          {gallery.name}
        </h1>

        <p className="text-zinc-500 font-bold mb-12">
          {gallery.city} — {gallery.address}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-10">
            {gallery.short_desc && (
              <p className="text-xl text-zinc-600 leading-relaxed">
                {gallery.short_desc}
              </p>
            )}

            {gallery.description && (
              <div className="prose prose-zinc max-w-none">
                {documentToReactComponents(gallery.description)}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-5">
            <div className="bg-white border border-zinc-100 rounded-[40px] p-10 space-y-8 shadow-sm">
              <div>
                <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                  Засновано
                </p>
                <p className="text-3xl font-black text-zinc-800">
                  {gallery.year ?? "—"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-zinc-800 font-bold text-sm">
                <MapPin size={16} />
                {gallery.address}
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-100">
                <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                  Контакти
                </p>
                {gallery.contacts.email && (
                  <p className="text-sm">{gallery.contacts.email}</p>
                )}
                {gallery.contacts.phone && (
                  <p className="text-sm">{gallery.contacts.phone}</p>
                )}
                {gallery.contacts.website && (
                  <a
                    href={gallery.contacts.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
