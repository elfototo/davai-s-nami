'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CITY_COOKIE, normalizeCity } from '../utils/cities';

const CityContext = createContext({
  city: normalizeCity(),
  setCity: () => {},
});

export const useCity = () => useContext(CityContext);

function saveCityCookie(code) {
  document.cookie = `${CITY_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

// initialCity приходит из куки на сервере (app/layout.js), поэтому SSR и
// первый рендер на клиенте совпадают
export const CityProvider = ({ initialCity, children }) => {
  const router = useRouter();
  const [city, setCityState] = useState(normalizeCity(initialCity));

  // refresh: перезапросить серверные компоненты с новым городом.
  // Не нужен, если сразу после смены города идёт навигация (router.replace/push).
  const setCity = useCallback(
    (code, { refresh = true } = {}) => {
      const nextCity = normalizeCity(code);

      saveCityCookie(nextCity);
      setCityState(nextCity);

      if (refresh) {
        router.refresh();
      }
    },
    [router],
  );

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};
