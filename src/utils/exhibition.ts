import type { Exhibition } from '../api/galleries';

/**
 * Визначає чи виставка є активною (поточною) на основі дати та поля is_active.
 *
 * Правила:
 * 1. is_active === false → завжди архів
 * 2. end_date є → головний критерій: end_date >= сьогодні → активна
 * 3. end_date немає + start_date є → активна лише якщо start_date >= сьогодні (тобто ще не почалась або починається сьогодні)
 *    Якщо start_date вже в минулому і end_date немає → архів
 * 4. Немає жодних дат → довіряємо is_active
 */
export const isExhibitionActive = (ex: Exhibition): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Якщо is_active явно false — завжди архів
  if (typeof ex.is_active === 'boolean' && !ex.is_active) return false;

  // Якщо є end_date — це головний критерій (дата об'єктивніша за флаг)
  if (ex.end_date) {
    const end = new Date(ex.end_date);
    end.setHours(23, 59, 59, 999);
    return end >= today;
  }

  // Немає end_date, але є start_date:
  // якщо start вже минув → в архів; якщо сьогодні або майбутнє → активна
  if (ex.start_date) {
    const start = new Date(ex.start_date);
    start.setHours(0, 0, 0, 0);
    return start >= today;
  }

  // Немає жодних дат — довіряємо is_active (або активна за замовчуванням)
  return typeof ex.is_active === 'boolean' ? ex.is_active : true;
};
