import { useQuery } from "@tanstack/react-query";
import { fetchGalleryReviews } from "../api/galleries";

export type GalleryRating = {
  avgRating: number;
  reviewsCount: number;
};

export function useGalleryRating(slug: string) {
  return useQuery<GalleryRating>({
    queryKey: ["gallery-rating", slug],
    queryFn: async () => {
      const reviews = await fetchGalleryReviews(slug);
      if (!reviews || reviews.length === 0) {
        return { avgRating: 0, reviewsCount: 0 };
      }
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      return {
        avgRating: total / reviews.length,
        reviewsCount: reviews.length,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache — same as galleries list
    enabled: !!slug,
  });
}
