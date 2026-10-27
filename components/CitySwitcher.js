'use client';

import { FaMapMarkerAlt } from 'react-icons/fa';
import { useCity } from '../context/CityContext';
import { getActiveCities } from '../utils/cities';

const CitySwitcher = ({ className = '' }) => {
  const { city, setCity } = useCity();
  const cities = getActiveCities();

  // Пока активен один город, переключатель не нужен
  if (cities.length < 2) {
    return null;
  }

  return (
    <label
      className={`relative flex items-center text-gray-700 dark:text-gray-200 ${className}`}
    >
      <FaMapMarkerAlt className="pointer-events-none absolute left-3 text-gray-400" />
      <select
        aria-label="Город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-md border bg-white py-2 pl-9 pr-4 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      >
        {cities.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CitySwitcher;
