'use client';

import HeroSearch from '../components/HeroSearch';
import { useEffect, useState, useRef } from 'react';
import PlaceCard from '../components/PlaceCard';
import { SiMoscowmetro } from "react-icons/si";
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../../context/SwrContext';
import { Suspense } from 'react';
import Loading from './loading';

export default function Places() {
  const { cache, findDataById } = useEvents();
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [indexPlaces, setIndexPlace] = useState(0);

  const [places, setPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const loadedPlacesIdsRef = useRef(new Set());


  let limit = 8;

  console.log("cache", cache)
  const loadMorePlaces = () => {
    if (isLoadingDataPlaces || !hasMore) return;
    const nextPage = indexPlaces + 1;
    setIndexPlace(nextPage);
    console.log('дополнить loadMoreEvents после пагинации');
  };

  const fetcherPlaces = async () => {

    try {
      const res = await fetch('http://159.223.239.75:8005/api/get_places/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zevgEv-vimned-ditva8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: [
            'id',
            'place_name',
            'place_address',
            'place_metro',
            'place_image'
          ],
          page: indexPlaces,
          limit: limit,
          order_by: 'id-asc'
        }),
      });

      if (!res.ok) {
        throw new Error('Ошибка получения task_id: ', res.statusText);
      };

      const result = await res.json();

      console.log('result для пагинации', result);

      let newEvents = [];

      if (result.task_id) {
        const taskId = result.task_id;

        console.log('есть result.task_i')

        const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

        try {
          const statusResponse = await fetch(statusUrl, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer zevgEv-vimned-ditva8',
              'Content-Type': 'application/json',
            },
          });

          if (!statusResponse.ok) {
            throw new Error('Ошибка запроса данных: ', statusResponse.statusText);
          }

          const statusResult = await statusResponse.json();
          console.log('statusResult', statusResult);

          if (Array.isArray(statusResult)) {
            newEvents = statusResult;
          } else if (statusResult.places && Array.isArray(statusResult.places)) {
            newEvents = statusResult.places;
          } else if (statusResult.result.places && Array.isArray(statusResult.result.places)) {
            newEvents = statusResult.result.places;
          } else {
            console.log('Неизвестная структура данных');
          }

          console.log('newEvents', newEvents);

          if (newEvents.length < limit) {
            setHasMore(false);
          }

          return newEvents;

        } catch (error) {
          console.log(`Ошибка запроса: `, error);
        }
      } else {
        console.log('Возвращаем result без task_id', result)

        if (Array.isArray(result)) {
          newEvents = result;
        } else if (result.result && Array.isArray(result.result)) {
          newEvents = result.result;
        } else if (result.result.places && Array.isArray(result.result.places)) {
          newEvents = result.result.places;
        } else {
          console.log('Неизвестная структура данных');
        }

        console.log('newEvents', newEvents);

        if (newEvents.length < limit) {
          setHasMore(false);
        }
        return newEvents;
      }
    } catch (error) {
      console.log('Ошибка создания задачи', error);
    }
  };

  const {
    data: dataPlaces,
    error: errorDataPlaces,
    isLoading: isLoadingDataPlaces,
  } = useSWR(`/api/data?place_page=${indexPlaces}`,
    fetcherPlaces);

  console.log('dataPlaces', dataPlaces);

  useEffect(() => {

    let placesSort = [...allPlaces];

    allPlaces.forEach(place => loadedPlacesIdsRef.current.add(place.id));

    console.log('allPlaces', allPlaces);
    console.log('cache.size', cache.size);
    console.log('cache', cache);

    if (cache && cache.size > 0) {
      console.log('берем данные из кэша');

      for (let i = 0; i < cache.size; i++) {
        const cachedData = cache.get(`/api/data?place_page=${i}`)?.data;

        if (Array.isArray(cachedData)) {

          cachedData.forEach(place => {

            if (!loadedPlacesIdsRef.current.has(place.id)) {
              loadedPlacesIdsRef.current.add(place.id);
              placesSort.push(place);
            };
          });
        }
      }

    } else if (dataPlaces && dataPlaces.length > 0) {
      console.log('Берем данные с сервера');

      dataPlaces.forEach(place => {
        if (!loadedPlacesIdsRef.current.has(place.id)) {
          loadedPlacesIdsRef.current.add(place.id);
          placesSort.push(place);
        }
      });
    }

    if (placesSort.length > 0) {

      setAllPlaces(placesSort);

      const filteredPlaces = placesSort.filter((place) => {
        const matchesSearch = search
          ? (
            (place.place_name?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
            (place.place_address?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
            (place.place_metro?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '')
          )
          : true;

        return matchesSearch || '';
      })

      console.log('filteredPlaces', filteredPlaces);

      // if (filteredPlaces?.length === 0 || filteredPlaces?.length % limit !==0) {
      //   loadMorePlaces();
      // }
      console.log('loadedPlacesIdsRef в самом конце', loadedPlacesIdsRef);


      setPlaces(filteredPlaces);
      console.log('places в конце', places);
    }

  }, [dataPlaces, search]);

  if (!places || places.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-[65px] w-[100%] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>

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
    <div>
      {/* <Suspense fallback={<Loading />}> */}
      <HeroSearch
        search={search}
        setSearch={setSearch}
      />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center '>
        <div className='w-full grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto'>
          {
            places?.length > 0 ? (
              places?.map((card) => (
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

      </div>
      <div className='mx-auto flex justify-center gap-6 mt-10'>
        {hasMore ? <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => loadMorePlaces()}>Загрузить еще</button> : <button className='px-4 py-2 bg-blue-200 text-white cursor-default rounded disabled:bg-gray-300' onClick={() => loadMorePlaces()}>Загрузить еще</button>}
      </div>
      {/* </Suspense> */}
    </div>
  )
}