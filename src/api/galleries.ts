import { http } from "./http";
import type { Document } from '@contentful/rich-text-types';

export type Gallery = {
  id: string;
  slug: string;
  status: boolean;
  name_ua: string;
  name_en: string;
  image: string | null;
  cover_image: string | null;
  short_description_ua?: string;
  short_description_en?: string;
  description_ua?: string;
  description_en?: string;
  description?: string;
  specialization_ua: string | null;
  specialization_en: string | null;
  city_ua: string;
  city_en: string;
  address_ua: string;
  address_en: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  social_links: Record<string, string> | string[] | null;
  founding_year: string | null;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
};

export type Exhibition = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  source_url: string;
  is_active: boolean;
  artists: string;
};

export type GalleryDetail = Gallery & {
  full_description_ua: Document | string;
  full_description_en: Document | string;
  founders_ua: string | null;
  founders_en: string | null;
  curators_ua: string | null;
  curators_en: string | null;
  artists_ua: string | null;
  artists_en: string | null;
  exhibitions?: Exhibition[];
};

// GET /api/galleries/
export async function fetchGalleries(): Promise<Gallery[]> {
  const data = await http<Gallery[] | { results: Gallery[] }>("/api/galleries/");
  // API може повертати масив або об'єкт з results
  return Array.isArray(data) ? data : (data.results || []);
}

// GET /api/galleries/:slug/
export function fetchGalleryBySlug(slug: string) {
  return http<GalleryDetail>(`/api/galleries/${slug}/`);
}

export type Review = {
  id: number;
  user: number;
  username: string;
  rating: number;
  text: string;
  created_at: string;
};

// GET /api/galleries/:slug/reviews/
export function fetchGalleryReviews(slug: string): Promise<Review[]> {
  return http<Review[]>(`/api/galleries/${slug}/reviews/`);
}

// POST /api/galleries/:slug/reviews/
export function createGalleryReview(
  slug: string,
  payload: { rating: number; text: string }
): Promise<Review> {
  return http<Review>(`/api/galleries/${slug}/reviews/`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}
