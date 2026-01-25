import { http } from "./http";

export type Gallery = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  image: string | null;
  socials: { platform: string; url: string }[];
  short_desc: string;
  year: number | null;
  latitude?: number;
  longitude?: number;
};

export type GalleryDetail = Gallery & {
  description: any;
  founders?: string;
  curators?: string;
  artists?: string[];
  contacts?: {
    email?: string;
    phone?: string;
    website?: string;
  };
};

// GET /api/galleries/
export function fetchGalleries() {
  return http<Gallery[]>("/api/galleries/");
}

// GET /api/galleries/:slug/
export function fetchGalleryBySlug(slug: string) {
  return http<GalleryDetail>(`/api/galleries/${slug}/`);
}
