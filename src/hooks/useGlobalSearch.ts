import { useMemo } from "react";
import { useGalleriesQuery } from "./useGalleriesQuery";
import { MOCK_EVENTS, type ArtEvent } from "../pages/Events/index";
import type { Gallery } from "../api/galleries";

export interface SearchResults {
    galleries: Gallery[];
    events: ArtEvent[];
    isLoading: boolean;
    hasResults: boolean;
}

export function useGlobalSearch(query: string): SearchResults {
    const { data: galleries = [], isLoading } = useGalleriesQuery();

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        // Не шукаємо, якщо менше 2 символів
        if (q.length < 2) {
            return { galleries: [], events: [] };
        }

        // Фільтруємо галереї
        const galleriesArray = Array.isArray(galleries) ? galleries : [];
        const filteredGalleries = galleriesArray.filter(
            (g: Gallery) =>
                g.name.toLowerCase().includes(q) ||
                g.city.toLowerCase().includes(q)
        ).slice(0, 5); // Максимум 5 результатів

        // Фільтруємо події
        const filteredEvents = MOCK_EVENTS.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                e.galleryName.toLowerCase().includes(q) ||
                e.city.toLowerCase().includes(q)
        ).slice(0, 5); // Максимум 5 результатів

        return {
            galleries: filteredGalleries,
            events: filteredEvents,
        };
    }, [query, galleries]);

    return {
        ...results,
        isLoading,
        hasResults: results.galleries.length > 0 || results.events.length > 0,
    };
}
