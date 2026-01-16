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
};

// GET /api/galleries
export function fetchGalleries() {
  return http<Gallery[]>("/galleries");
}
