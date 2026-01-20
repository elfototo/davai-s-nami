import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

import { formatDateRange } from '../../../utils/formatDateRange';

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

describe('formatDateRange', () => {
  /**
   * Фиксируем таймзону,
   * чтобы тесты не падали на CI / другой машине
   */
  beforeAll(() => {
    process.env.TZ = 'UTC';
  });

  test('возвращает заглушку, если нет from_date', () => {
    expect(formatDateRange(null, null)).toBe('Скоро будет дата');
  });

  test('если есть только from_date — показывает день недели и дату', () => {
    const result = formatDateRange(
      '2024-11-16 16:00:00 +00:00',
      null
    );

    expect(result).toBe('Сб, 16 ноября');
  });

  test('если from_date и to_date одинаковые — одна дата', () => {
    const date = '2024-11-16 16:00:00 +00:00';

    const result = formatDateRange(date, date);

    expect(result).toBe('Сб, 16 ноября');
  });

  test('если одна дата, но разное время — одна дата', () => {
    const result = formatDateRange(
      '2024-11-16 10:00:00 +00:00',
      '2024-11-16 19:00:00 +00:00'
    );

    expect(result).toBe('Сб, 16 ноября');
  });

  test('если to_date в 00:00 — возвращает дату и 00:00', () => {
    const result = formatDateRange(
      '2024-11-16 16:00:00 +00:00',
      '2024-11-17 21:00:00 +00:00'
    );

    expect(result).toBe('Сб, 16 ноября - 00:00');
  });

  test('если событие на несколько дней — возвращает диапазон дат', () => {
    const result = formatDateRange(
      '2024-11-16 16:00:00 +00:00',
      '2024-11-18 19:00:00 +00:00'
    );

    expect(result).toBe('Сб, 16 ноября - Пн, 18 ноября');
  });
});