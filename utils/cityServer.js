import { cookies } from 'next/headers';
import { CITY_COOKIE, normalizeCity } from './cities';

// Текущий город для серверных компонентов (из куки, которую ставит CityProvider)
export function getServerCity() {
  return normalizeCity(cookies().get(CITY_COOKIE)?.value);
}
