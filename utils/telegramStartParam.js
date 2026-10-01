const DATE_SHORTCUTS = new Set(['today', 'tomorrow', 'weekend']);

const CATEGORY_BY_ID = {
  1: 'Концерт',
  2: 'Другое',
  3: 'Кино',
  4: 'Лекция',
  5: 'Культура',
  6: 'Фестиваль',
  7: 'Театр',
  8: 'Вечеринка',
  9: 'Перформанс',
  10: 'Стендап',
  11: 'Выставка',
  12: 'Мастер-класс',
  13: 'Экскурсия',
};

const CATEGORY_BY_ALIAS = {
  concert: 'Концерт',
  concerts: 'Концерт',
  other: 'Другое',
  cinema: 'Кино',
  movie: 'Кино',
  lecture: 'Лекция',
  lectory: 'Лекция',
  culture: 'Культура',
  festival: 'Фестиваль',
  theater: 'Театр',
  theatre: 'Театр',
  party: 'Вечеринка',
  performance: 'Перформанс',
  perfomance: 'Перформанс',
  standup: 'Стендап',
  exhibition: 'Выставка',
  exibition: 'Выставка',
  workshop: 'Мастер-класс',
  tour: 'Экскурсия',
};

const ORDER_VALUES = new Set([
  'date-asc',
  'date-desc',
  'price-asc',
  'price-desc',
  'title-asc',
  'title-desc',
  'ad-asc',
  'ad-desc',
  'id-asc',
  'id-desc',
]);

function splitToken(token) {
  const separatorIndex = token.indexOf('-');

  if (separatorIndex === -1) {
    return [token, ''];
  }

  return [token.slice(0, separatorIndex), token.slice(separatorIndex + 1)];
}

function toIsoDate(value) {
  if (!/^\d{8}$/.test(value)) {
    return null;
  }

  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);

  return `${year}-${month}-${day}`;
}

function resolveCategories(value) {
  return value
    .split('-')
    .map((category) => {
      const normalizedCategory = category.toLowerCase();

      return CATEGORY_BY_ID[category] || CATEGORY_BY_ALIAS[normalizedCategory];
    })
    .filter(Boolean);
}

export function parseTelegramStartParam(startParam) {
  if (!startParam || typeof startParam !== 'string') {
    return null;
  }

  if (startParam.startsWith('event_')) {
    const eventId = startParam.slice('event_'.length);

    return eventId ? `/events/${encodeURIComponent(eventId)}` : null;
  }

  if (startParam !== 'events' && !startParam.startsWith('events__')) {
    return null;
  }

  const params = new URLSearchParams();
  const tokens = startParam.split('__').slice(1).filter(Boolean);

  tokens.forEach((token) => {
    const [key, value] = splitToken(token);

    if (!value) return;

    if ((key === 'date' || key === 'd') && DATE_SHORTCUTS.has(value)) {
      params.set('date', value);
      return;
    }

    if ((key === 'date' || key === 'd') && /^\d{8}-\d{8}$/.test(value)) {
      const [startDate, endDate] = value.split('-').map(toIsoDate);

      if (startDate && endDate) {
        params.set('startDate', startDate);
        params.set('endDate', endDate);
      }

      return;
    }

    if ((key === 'date' || key === 'd') && toIsoDate(value)) {
      const date = toIsoDate(value);

      params.set('startDate', date);
      params.set('endDate', date);
      return;
    }

    if (key === 'from' && toIsoDate(value)) {
      params.set('startDate', toIsoDate(value));
      return;
    }

    if (key === 'to' && toIsoDate(value)) {
      params.set('endDate', toIsoDate(value));
      return;
    }

    if (key === 'cat' || key === 'cats' || key === 'c') {
      const categories = resolveCategories(value);

      if (categories.length > 0) {
        params.set('tags', categories.join(','));
      }

      return;
    }

    if (key === 'price' && /^\d+$/.test(value)) {
      params.set('price', value);
      return;
    }

    if (key === 'order' && ORDER_VALUES.has(value)) {
      params.set('order', value);
      return;
    }

    // Подборка из поста: events__sel-412 (секция идёт последней)
    if (key === 'sel' && /^\d+$/.test(value)) {
      params.set('sel', value);
    }
  });

  const queryString = params.toString();

  return queryString ? `/events?${queryString}` : '/events';
}
