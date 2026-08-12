import { parseTelegramStartParam } from '../../../utils/telegramStartParam';

describe('parseTelegramStartParam', () => {
  test('сохраняет старый формат открытия мероприятия', () => {
    expect(parseTelegramStartParam('event_TIMEPAD-3096349')).toBe(
      '/events/TIMEPAD-3096349',
    );
  });

  test('открывает список мероприятий без фильтров', () => {
    expect(parseTelegramStartParam('events')).toBe('/events');
  });

  test('переводит выходные в URL фильтра мероприятий', () => {
    expect(parseTelegramStartParam('events__date-weekend')).toBe(
      '/events?date=weekend',
    );
  });

  test('поддерживает категории по id без запятых в start_param', () => {
    expect(parseTelegramStartParam('events__date-weekend__cat-1-3')).toBe(
      '/events?date=weekend&tags=%D0%9A%D0%BE%D0%BD%D1%86%D0%B5%D1%80%D1%82%2C%D0%9A%D0%B8%D0%BD%D0%BE',
    );
  });

  test('поддерживает категории по алиасам', () => {
    expect(parseTelegramStartParam('events__c-theater-standup')).toBe(
      '/events?tags=%D0%A2%D0%B5%D0%B0%D1%82%D1%80%2C%D0%A1%D1%82%D0%B5%D0%BD%D0%B4%D0%B0%D0%BF',
    );
  });

  test('поддерживает диапазон дат в компактном формате', () => {
    expect(parseTelegramStartParam('events__d-20260815-20260816')).toBe(
      '/events?startDate=2026-08-15&endDate=2026-08-16',
    );
  });

  test('игнорирует неизвестный формат', () => {
    expect(parseTelegramStartParam('place_10')).toBeNull();
  });
});
