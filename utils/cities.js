// Список городов. В API пока нет эндпоинта со списком (GET /api/cities/),
// поэтому он захардкожен здесь. Код города — как в таблице city_city на бэкенде.
export const DEFAULT_CITY = 'spb';

// Кука с выбранным городом: читается и на сервере (SSR), и на клиенте
export const CITY_COOKIE = 'city';

export const CITIES = [
  {
    code: 'spb',
    name: 'Санкт-Петербург',
    nameIn: 'Санкт-Петербурге', // «в Санкт-Петербурге»
    nameOf: 'Санкт-Петербурга', // «события Санкт-Петербурга»
    telegram: 'https://t.me/DavaiSNami',
    vk: 'https://vk.com/davaisnamispb',
    active: true,
  },
  {
    code: 'kzn',
    name: 'Казань',
    nameIn: 'Казани',
    nameOf: 'Казани',
    // Каналов Казани пока нет — используются ссылки Петербурга
    telegram: null,
    vk: null,
    active: true,
  },
];

const CITY_BY_CODE = Object.fromEntries(CITIES.map((city) => [city.code, city]));

export function isKnownCity(code) {
  return typeof code === 'string' && Boolean(CITY_BY_CODE[code]);
}

// Неизвестный или пустой код -> город по умолчанию
export function normalizeCity(code) {
  return isKnownCity(code) ? code : DEFAULT_CITY;
}

export function getCity(code) {
  return CITY_BY_CODE[normalizeCity(code)];
}

export function getActiveCities() {
  return CITIES.filter((city) => city.active);
}

// Ссылки на соцсети города, с откатом на ссылки города по умолчанию
export function getCityLinks(code) {
  const city = getCity(code);
  const fallback = CITY_BY_CODE[DEFAULT_CITY];

  return {
    telegram: city.telegram || fallback.telegram,
    vk: city.vk || fallback.vk,
  };
}

// Город, к которому относится событие/площадка (поле city_id в ответе API).
// null, если поле не пришло.
export function getItemCity(item) {
  const code = item?.city_id;

  return isKnownCity(code) ? code : null;
}
