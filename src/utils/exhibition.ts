import type { Exhibition } from '../api/galleries';

/**
 * Визначає чи виставка є активною (поточною) на основі дати та поля is_active.
 * Пріоритет: is_active=false → завжди архів; end_date → об'єктивний критерій дати.
 */
export const isExhibitionActive = (ex: Exhibition): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Якщо is_active явно false — завжди архів
  if (typeof ex.is_active === 'boolean' && !ex.is_active) return false;

  // Якщо є end_date — це головний критерій (дата об'єктивніша за флаг)
  if (ex.end_date) {
    const end = new Date(ex.end_date);
    end.setHours(23, 59, 59, 999); // кінець дня
    return end >= now;
  }

  // Немає end_date: довіряємо is_active або показуємо як активну
  return true;
};
