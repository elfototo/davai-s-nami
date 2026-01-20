'use client';

import HeroSearch from '../../components/HeroSearch';
import { useEffect, useState, useRef } from 'react';
import PlaceCard from '../../components/PlaceCard';
import { useEvents } from '../../context/SwrContext';
import useSWRInfinite from "swr/infinite";
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';

function PagePlaces({ sortedPlaces, isLoadingDataPlaces }) {

  if (isLoadingDataPlaces && sortedPlaces.length < 0) {
    return (
      <div className="space-y-4">

        <div className="t-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">

          <section className="w-full">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[290px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>
          </section>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <div className='w-full grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto'>
        {
          sortedPlaces?.length > 0 ? (
            sortedPlaces?.map((card) => (
              <PlaceCard
                id={card.id}
                key={card.id}
                place_name={card.place_name}
                place_address={card.place_address}
                place_metro={card.place_metro}
                place_city={card.place_city}
                image={card.place_image}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg font-semibold">
              Нет доступных Мест.
            </div>
          )
        }

      </div>

    </>
  )
}

export default function Places({initialPlaces}) {
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const loadedPlacesIdsRef = useRef(new Set());
  const limit = 20;


  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length < limit) return null;
    const offset = pageIndex * limit;

    return `/api/data?query=${search}&page=${pageIndex}&offset=${offset}`;
  };

  const fetcherPlaces = async (url) => {

    const urlObj = new URL(url, API_URL_PL);
    const pageIndex = parseInt(urlObj.searchParams.get('page'), limit) || 0;

    let places = [];

    if (search) {
      try {
        const res = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(search)}&type=place`, {
          method: 'GET',
          headers: API_HEADERS,
        });

        if (!res.ok) throw new Error('Ошибка поиска');
        const result = await res.json();


        places = Array.isArray(result) ? result :
          Array.isArray(result.places) ? result.places :
            [];
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    } else {
      try {
        const res = await fetch(API_URL_PL, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({
            fields: [
              'id',
              'place_name',
              'place_address',
              'place_metro',
              'place_image'
            ],
            page: pageIndex,
            limit: limit,
            order_by: 'id-asc'
          }),
        });

        if (!res.ok) {
          throw new Error('Ошибка получения task_id: ', res.statusText);
        };

        const result = await res.json();


        let newEvents = [];


        if (Array.isArray(result)) {
          newEvents = result;
        } else if (result.result && Array.isArray(result.result)) {
          newEvents = result.result;
        } else if (result.result.places && Array.isArray(result.result.places)) {
          newEvents = result.result.places;
        } else {
          console.log('Неизвестная структура данных');
        }

        return newEvents || [];
      } catch (error) {
        console.log('Ошибка создания задачи', error);
      }
    }

    return places;
  };

  const {
    data: dataPlaces,
    error: errorDataPlaces,
    isLoading: isLoadingDataPlaces,
    mutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, fetcherPlaces, {
    revalidateFirstPage: false,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    fallbackData: [initialPlaces],
    initialSize: 1,
  });


  useEffect(() => {
    if (dataPlaces) {
      setHasMore(dataPlaces?.[dataPlaces.length - 1]?.length === limit);

      // Объединяем все страницы данных в один массив
      const newEvents = dataPlaces.flat();

      // Фильтруем события, чтобы избежать дубликатов
      const uniquePlaces = newEvents.filter(place => !loadedPlacesIdsRef.current.has(place.id));

      // Добавляем новые события в allEvents
      if (uniquePlaces.length > 0) {
        setAllPlaces(prevPlaces => [...prevPlaces, ...uniquePlaces]);

        // Обновляем loadedPlacesIdsRef
        uniquePlaces.forEach(place => loadedPlacesIdsRef.current.add(place.id));
      }
    }
  }, [dataPlaces]);

  useEffect(() => {
    if (allPlaces.length > 0) {
      // Фильтрация событий
      const filtered = allPlaces.filter((place) => {

        const matchesSearch = search
          ? (
            (place.place_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (place.place_address && place.place_address.toString().includes(search)) ||
            (place.place_metro?.toLowerCase() || '').includes(search.toLowerCase())
          )
          : true;

        return matchesSearch;
      });

      setSortedPlaces(filtered);

      // Проверка, нужно ли загружать больше событий
      if (filtered.length < limit || filtered.length % limit !== 0) {
        loadMorePlaces();
      }
    }
  }, [allPlaces, search]);

  const loadMorePlaces = () => {
    if (isLoadingDataPlaces || !hasMore) return;
    if (hasMore) setSize(size + 1);
  };

  return (
    <div>

      <HeroSearch
        search={search}
        setSearch={setSearch}
        value={'Найти место'}
      />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center '>
        <PagePlaces
          sortedPlaces={sortedPlaces}
          isLoadingDataPlaces={isLoadingDataPlaces}
        />
      </div>
      <div className='mx-auto flex justify-center gap-6 mt-10'>
        {hasMore ? <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => loadMorePlaces()}>{isValidating ? "Загрузка..." : "Загрузить еще"}</button> : <button className='px-4 py-2 bg-blue-200 text-white cursor-default rounded disabled:bg-gray-300' onClick={() => loadMorePlaces()}>Загрузить еще</button>}
      </div>

    </div>
  )
}