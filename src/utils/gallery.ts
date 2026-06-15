import type { Gallery, GalleryDetail } from '../api/galleries';

/**
 * Helper functions to get language-specific fields from Gallery objects
 * based on the current i18n language setting
 */

export function getGalleryName(gallery: Gallery, language: string): string {
    return language === 'en' ? (gallery.name_en || gallery.name_ua || 'Unnamed Gallery') : (gallery.name_ua || gallery.name_en || 'Unnamed Gallery');
}


// Frontend fallback translations for cities where city_ua is null in the DB
const CITY_UA_MAP: Record<string, string> = {
  // Спеціальні категорії
  'Other': 'Інше',
  'Online': 'Онлайн',
  'Abroad': 'За кордоном',
  // Основні міста
  'Kyiv': 'Київ',
  'Kiev': 'Київ',
  'Kharkiv': 'Харків',
  'Kharkov': 'Харків',
  'Lviv': 'Львів',
  'Lvov': 'Львів',
  'Odesa': 'Одеса',
  'Odessa': 'Одеса',
  'Dnipro': 'Дніпро',
  'Dnipropetrovsk': 'Дніпро',
  'Zaporizhzhia': 'Запоріжжя',
  'Zaporizhia': 'Запоріжжя',
  'Vinnytsia': 'Вінниця',
  'Vinnitsa': 'Вінниця',
  'Poltava': 'Полтава',
  'Chernivtsi': 'Чернівці',
  'Uzhhorod': 'Ужгород',
  'Uzhgorod': 'Ужгород',
  'Ivano-Frankivsk': 'Івано-Франківськ',
  'Ternopil': 'Тернопіль',
  'Lutsk': 'Луцьк',
  'Rivne': 'Рівне',
  'Sumy': 'Суми',
  'Mykolaiv': 'Миколаїв',
  'Nikolaev': 'Миколаїв',
  'Kherson': 'Херсон',
  'Cherkasy': 'Черкаси',
  'Chernihiv': 'Чернігів',
  'Khmelnytskyi': 'Хмельницький',
  'Kremenchuk': 'Кременчук',
  'Bila Tserkva': 'Біла Церква',
  'Mariupol': 'Маріуполь',
  'Kramatorsk': 'Краматорськ',
  'Brovary': 'Бровари',
  'Zhytomyr': 'Житомир',
  'Kropyvnytskyi': 'Кропивницький',
  'Zhovkva': 'Жовква',
  'Drohobych': 'Дрогобич',
};

export function getGalleryCity(gallery: Gallery, language: string): string {
    if (language === 'en') {
        return gallery.city_en || gallery.city_ua || 'Unknown City';
    }
    // For Ukrainian: prefer city_ua, then try the translation map, then fallback to city_en
    if (gallery.city_ua) return gallery.city_ua;
    if (gallery.city_en && CITY_UA_MAP[gallery.city_en]) return CITY_UA_MAP[gallery.city_en];
    return gallery.city_en || 'Unknown City';
}

export function getGalleryAddress(gallery: Gallery, language: string): string {
    return language === 'en' ? (gallery.address_en || gallery.address_ua || '') : (gallery.address_ua || gallery.address_en || '');
}

export function getGalleryShortDescription(gallery: Gallery, language: string): string {
    const descEn = gallery.description_en || gallery.short_description_en || gallery.description || '';
    const descUa = gallery.description_ua || gallery.short_description_ua || gallery.description || '';
    return language === 'en' ? (descEn || descUa) : (descUa || descEn);
}

export function getGallerySpecialization(gallery: Gallery, language: string): string | null {
    return language === 'en' ? gallery.specialization_en : gallery.specialization_ua;
}

// For GalleryDetail
export function getGalleryFullDescription(gallery: GalleryDetail, language: string): any {
    return language === 'en' ? (gallery.full_description_en || gallery.full_description_ua || '') : (gallery.full_description_ua || gallery.full_description_en || '');
}

export function getGalleryFounders(gallery: GalleryDetail, language: string): string | null {
    return language === 'en' ? gallery.founders_en : gallery.founders_ua;
}

export function getGalleryCurators(gallery: GalleryDetail, language: string): string | null {
    return language === 'en' ? gallery.curators_en : gallery.curators_ua;
}

export function getGalleryArtists(gallery: GalleryDetail, language: string): string | null {
    return language === 'en' ? gallery.artists_en : gallery.artists_ua;
}
