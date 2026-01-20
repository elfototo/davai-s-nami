'use client';

import { places, data } from '../../data/events';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Card from '../../../components/Card';
import { useEvents } from '../../../context/SwrContext';
import useSWR, { SWRConfig } from 'swr';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import {
  API_URL,
  API_URL_PL,
  SEARCH_URL,
  API_HEADERS,
  API_URL_PL_BY_ID,
} from '../../../config';
import BackButton from '../../../components/BackButton';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function EventPlace({ initialPalce, initialPalcesEvents, id }) {
  const { cache, findDataByIdPlace } = useEvents();

  const [eventsInPlace, setEventsInPlace] = useState([]);
  const [place, setPlace] = useState(null);

  const idNumber = parseInt(id);

  const fetchPlaceById = async (id) => {
    try {
      const res = await fetch(`${API_URL_PL_BY_ID}${id}`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          fields: [
            'id',
            'place_name',
            'place_address',
            'place_url',
            'place_metro',
            'place_image',
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка поиска id ${res.statusText}`);
      }

      const result = await res.json();

      if (result && Array.isArray(result)) {
        return result[0];
      } else if (result.result && Array.isArray(result.result)) {
        return result.result[0];
      } else if (result.result.places && Array.isArray(result.result.places)) {
        // setPlace(result.result.places[0]);
        return result.result.places[0];
      } else if (result.places && Array.isArray(result.places)) {
        // setPlace(result.places[0]);
        return result.places[0];
      } else {
        console.error('Неизвестная структура данных:', result);
      }
    } catch (error) {
      return null;
    }
  };

  const {
    data: dataPlaceById,
    error: errorPlaceByID,
    isLoading: isLoadingById,
  } = useSWR(
    idNumber ? `/api/data?place_id=${idNumber}` : null,
    () => fetchPlaceById(idNumber),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData: initialPalce,
    },
  );

  const fetchEventsInPlaceByID = async (id) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          place: [id],
          fields: [
            'event_id',
            'id',
            'title',
            'image',
            'url',
            'price',
            'address',
            'from_date',
            'full_text',
            'place_id',
            'main_category_id',
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка поиска id для events ${res.statusText}`);
      }

      const result = await res.json();

      if (result && Array.isArray(result)) {
        return result;
      } else if (result.result && Array.isArray(result.result)) {
        return result.result;
      } else if (result.result.events && Array.isArray(result.result.events)) {
        return result.result.events;
      } else if (result.events && Array.isArray(result.events)) {
        return result.events;
      } else {
        console.error('Неизвестная структура данных для events:', result);
      }
    } catch (error) {
      return null;
    }
  };

  const {
    data: dataEventsByPlaceId,
    error: errorEventsPlaceId,
    isLoading: isLoadingEventsPlaceId,
  } = useSWR(
    idNumber ? `/api/data?event_from_place=${idNumber}` : null,
    () => fetchEventsInPlaceByID(idNumber),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
      fallbackData: [initialPalcesEvents],
    },
  );

  const cacheEvents = findDataByIdPlace(idNumber);

  useEffect(() => {
    let result = [];

    if (dataPlaceById && !isLoadingById) {
      setPlace(dataPlaceById);
    }

    if (cacheEvents) {
      // Удаляем дубликаты внутри cacheEvents
      const uniqueCacheEvents = cacheEvents.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.id === event.id),
      );

      setEventsInPlace(uniqueCacheEvents);
    }

    if (
      !isLoadingEventsPlaceId &&
      dataEventsByPlaceId &&
      cacheEvents?.length < 4
    ) {
      result = [...cacheEvents, ...dataEventsByPlaceId].filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.id === event.id),
      );

      setEventsInPlace(result);
    }
  }, [
    dataPlaceById,
    isLoadingById,
    dataEventsByPlaceId,
    isLoadingEventsPlaceId,
    place,
  ]);

  if (isLoadingById || isLoadingEventsPlaceId || !place) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-violet-500 border-t-transparent"></div>
          <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-300 border-r-transparent"></div>
          <div className="absolute h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-200 border-l-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-custom-container">
      {/* <BackButton className='lg:hidden'/> */}

      <div className="relative flex">
        <div className="min-h-scree mx-auto flex w-full flex-col justify-center px-6 py-5 md:py-10 lg:inset-x-0">
          <div className="rounded-xl bg-[#fff] p-10 lg:flex lg:items-center">
            <div className="h-60 overflow-hidden rounded-xl shadow-xl md:h-96">
              <Image
                className="h-60 w-full transform cursor-pointer object-cover object-center transition-all duration-300 hover:scale-105 md:h-96 lg:w-[32rem]"
                src={place?.place_image || '/img/cat.png'}
                width={1000}
                height={1000}
                alt="avatar"
                priority
              />
            </div>

            <div className="mt-8 lg:mt-0 lg:px-10">
              <h1 className="mx-1 my-0 mb-5 font-roboto text-2xl font-bold text-[#333] lg:text-3xl">
                {place?.place_name}
              </h1>

              <div className="mx-1 mb-3 w-full rounded-2xl bg-[#f4f4f9] p-5 lg:min-w-[300px]">
                <div className="mb-3 flex">
                  <p className="text-[#777]">Метро: </p>
                  <p className="text-gray-[#333] ml-[20px] font-roboto text-[#333] lg:w-72">
                    {place?.place_metro}
                  </p>
                </div>

                <div className="mt-3 flex items-baseline">
                  <p className="text-[#777]">Адрес: </p>

                  <p className="ml-6 font-roboto text-[#333]">
                    {place?.place_address}
                  </p>
                </div>
              </div>
              <div className="flex"></div>
            </div>
          </div>
          {eventsInPlace?.length > 0 ? (
            <h1 className="font-roboto font-bold">Мероприятия в этом месте</h1>
          ) : (
            <h1 className="font-roboto font-bold">
              Мероприятий в ближайшее время нет
            </h1>
          )}

          <div className="grid-rows-auto grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {eventsInPlace?.map((card) => (
              <Card
                type="mini"
                to_date={card.to_date}
                category={card.category}
                main_category_id={card.main_category_id}
                price={card.price}
                title={card.title}
                from_date={card.from_date}
                address={card.address}
                key={card.event_id}
                id={card.id}
                data={card}
                image={card.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
