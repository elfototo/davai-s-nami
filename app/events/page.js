'use client';

import HeroSearch from '../components/HeroSearch';
import Filtres from '../components/Filtres';
import Card from '../components/Card'
import React, { useEffect, useState, useRef } from 'react';
import { categoriesID } from '../data/events';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSWRConfig } from 'swr';
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../../context/SwrContext';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function Page({ index, setIndex, search, isLoading, startDate, endDate, selectedTags, cache, category, sortPrice, loadMoreEvents, data, limit, selectedTagsId, setSelectedTagsId, sortedEvents, setSortedEvents }) {

  // const [sortedEvents, setSortedEvents] = useState([]);
  const [sortedEventsByCategories, setSortedEventsByCategories] = useState([]);

  const [allEvents, setAllEvents] = useState([]);
  const loadedEventIdsRef = useRef(new Set());
  const [filteredEvents, setfilteredEvents] = useState([]);

  console.log('sortedEvents в самом начале', sortedEvents);
  console.log('loadedEventIdsRef в самом начале', loadedEventIdsRef);

  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    return categoryObj ? categoryObj.id : null;
  };

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  // поиск по мероприятиям запросы
  // const fetcherSearch = async (target) => {
  //   try {
  //     console.log('fetcher target', target);

  //     const res = await fetch(`http://159.223.239.75:8005/api/search/?query=${target}&type=event`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': 'Bearer zevgEv-vimned-ditva8',
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Ошибка: ${res.statusText}`);
  //     }


  //     const result = await res.json();
  //     console.log('Task created с глобального поиска: ', result);

  //     let eventsfromFetcher = [];

  //     console.log('result', result);

  //     if (result.events && Array.isArray(result.events)) {
  //       console.log('result.events', result.events)
  //       eventsfromFetcher = eventsfromFetcher.concat(result.events);
  //     }

  //     if (result.places && Array.isArray(result.places)) {
  //       console.log('result.places', result.places)
  //       eventsfromFetcher = eventsfromFetcher.concat(result.places);
  //     }

  //     console.log('eventsfrom Search', eventsfromFetcher)

  //     return eventsfromFetcher;

  //   } catch (error) {
  //     console.log('Ошибка при выполнении задачи', error);
  //   }
  // };

  // const {
  //   data: dataEventSearch,
  //   error: errorSearch,
  //   isLoading: isLoadingsearch
  // } = useSWR(
  //   search ? `/api/search/?query=${search}&type=event` : null,
  //   () => fetcherSearch(search),
  // );

  // console.log('dataEventSearch', dataEventSearch)

  // запрос по категориям

  const fetcherForCategories = async (categories) => {

    try {
      const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zevgEv-vimned-ditva8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          // limit: limit,
          // page: index,
          category: categories,
        }),
      });

      if (!res.ok) {
        throw new Error('Ошибка получения task_id: ', res.statusText);
      };

      const result = await res.json();

      console.log('result для категорий', result);

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
          } else if (statusResult.events && Array.isArray(statusResult.events)) {
            newEvents = statusResult.events;
          } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
            newEvents = statusResult.result.events;
          } else {
            console.log('Неизвестная структура данных');
          }

          console.log('newEvents', newEvents);

          // if (newEvents.length < limit) {
          //   setHasMore(false);
          // }

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
        } else if (result.result.events && Array.isArray(result.result.events)) {
          newEvents = result.result.events;
        } else {
          console.log('Неизвестная структура данных');
        }

        console.log('newEvents', newEvents);

        // if (newEvents.length < limit) {
        //   setHasMore(false);
        // }
        return newEvents;
      }
    } catch (error) {
      console.log('Ошибка создания задачи', error);
    }
  };

  const {
    data: dataCategories,
    error: errorCategories,
    isLoading: isLoadingCategories
  } = useSWR(
    selectedTagsId.length ? `/api/search/?categories=${selectedTagsId.join(',')}` : null, () =>
    fetcherForCategories(selectedTagsId));

  useEffect(() => {
    if (selectedTags.length === 0) {
      setSortedEventsByCategories([]);
    }
  }, [selectedTags]);

  useEffect(() => {
    setSelectedTagsId(selectedTags.map((tag) => getCategoryIdByName(tag) || null));
    console.log('selectedTags to tags id');

  }, [selectedTags]);

  useEffect(() => {
    if (dataCategories && selectedTags.length > 0) {
      setSortedEventsByCategories(dataCategories);
    }
  }, [dataCategories, selectedTags]);

  console.log("запрос по категориям", dataCategories);
  console.log('selectedTags', selectedTags);
  console.log('selectedTagsId', selectedTagsId);

  useEffect(() => {
    let eventsToSort = [...allEvents];

    allEvents.forEach(event => loadedEventIdsRef.current.add(event.id));

    if (cache && cache.size > 0) {
      console.log('берем данные из кэша');

      for (let i = 0; i < cache.size; i++) {

        const cachedData = cache.get(`/api/data?page=${i}`)?.data;
        console.log('cachedData', cachedData);

        if (Array.isArray(cachedData)) {

          cachedData.forEach(event => {

            if (!loadedEventIdsRef.current.has(event.id)) {
              loadedEventIdsRef.current.add(event.id);
              eventsToSort.push(event);
            };
          });
        }
      }

    } else if (data && data.length > 0) {
      console.log('Берем данные с сервера');

      data.forEach(event => {
        if (!loadedEventIdsRef.current.has(event.id)) {
          loadedEventIdsRef.current.add(event.id);
          eventsToSort.push(event);
        }
      });
    }

    if (eventsToSort.length > 0) {

      setAllEvents(eventsToSort);

      setfilteredEvents(eventsToSort.filter((event) => {
        // const eventCategoryName = getCategoryNameById(event.main_category_id);
        // const matchesCategory = !category || eventCategoryName === category;

        const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow').startOf('day');
        const isInDateRange = (!startDate || eventDate.isSameOrAfter(startDate, 'day')) &&
          (!endDate || eventDate.isSameOrBefore(endDate, 'day'));

        const matchesSearch = search
          ? (
            (event.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (event.price?.toString().toLowerCase() && event.price?.toString().toLowerCase().includes(search)) ||
            (event.address?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (event.from_date && dayjs(event.from_date).format('YYYY-MM-DD').includes(search)) ||
            (event.place_id && event.place_id.toString().includes(search)) ||
            (event.main_category_id && getCategoryNameById(event.main_category_id)?.toLowerCase().includes(search.toLowerCase()))
          )
          : true;

        // const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

        return isInDateRange && matchesSearch

        // return matchesCategory && isInDateRange && matchesSearch && matchesTags;
      })
      )

      const sorted = sortPrice
        ? filteredEvents.sort((a, b) => (sortPrice === 'asc' ? a.price - b.price : b.price - a.price))
        : filteredEvents;

      setSelectedTagsId(selectedTags.map((tag) => getCategoryIdByName(tag) || null));

      console.log('sorted', sorted);

      // if (sorted.length < limit || sorted.length % limit !== 0) {
      //   loadMoreEvents();
      // }
      if (sorted.length < limit) {
        loadMoreEvents();
      }

      const loadedCount = sorted.length;
      const indexCount = Math.floor(loadedCount / limit);
      console.log('indexCount', indexCount);
      console.log('index', index);


      if (index !== indexCount) {
        setIndex(indexCount);
      }



      console.log('loadedEventIdsRef в самом конце', loadedEventIdsRef);

      setSortedEvents(sorted);
      console.log('sortedEvents', sortedEvents);
    };

  }, [category, search, sortPrice, startDate, endDate, selectedTags, data, index]);


  // скелетон для cards
  if (isLoading) {
    return (
      <div className="space-y-4">

        <div className="t-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">

          <section className="w-full">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
              <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
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
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
        {sortedEventsByCategories?.length > 0 && selectedTags ? (
          sortedEventsByCategories.map((card) => (
            <Card
              type="mini"
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
          ))
        ) :
          sortedEvents?.length > 0 ? (
            sortedEvents.map((card) => (
              <Card
                type="mini"
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
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg font-semibold">
              Нет доступных событий.
            </div>
          )
        }
      </div>

    </>
  )
}


export default function Events() {

  const { cache, findDataById } = useEvents();
  const loadedEventIdsRef = useRef(new Set());

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTagsId, setSelectedTagsId] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);

  const [sortPrice, setSortPrice] = useState(null);
  const [category, setCategory] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 4;

  let today = dayjs().format('YYYY-MM-DD');
  let nextSixMonth = dayjs().add(12, 'month').format('YYYY-MM-DD');

  const fetcher = async () => {

    try {
      const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zevgEv-vimned-ditva8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_from: today,
          date_to: nextSixMonth,
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
          page: index,
          limit: limit,
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
          } else if (statusResult.events && Array.isArray(statusResult.events)) {
            newEvents = statusResult.events;
          } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
            newEvents = statusResult.result.events;
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
        } else if (result.result.events && Array.isArray(result.result.events)) {
          newEvents = result.result.events;
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
    data,
    error,
    isLoading,
  } = useSWR(`/api/data?page=${index}`,
    fetcher);

  if (isLoading) console.log('ЗАГРУЗКА');
  if (error) console.log('ОШИБКА', error.info);
  console.log('Загруженные данные: ', data);

  //   const loadMoreEvents = () => {
  //     if (isLoading || !hasMore) return;

  //     const loadedCount = sortedEvents.length; // Количество загруженных событий
  //     const currentPage = Math.floor(loadedCount / limit); // Текущая страница
  //     const nextPage = currentPage + 1; // Следующая страница

  //     if (nextPage > index) {
  //         setIndex(nextPage);
  //         console.log('Обновленный индекс:', nextPage);
  //     }
  // };

  const loadMoreEvents = () => {
    if (isLoading || !hasMore) return;

    const nextPage = index + 1;
    setIndex(nextPage);
    console.log('дополнить loadMoreEvents после пагинации');
  };
  return (
    <>
      <HeroSearch search={search} setSearch={setSearch} />
      <div className="mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">
        <aside className="lg:w-[20%] w-full mb-3 mr-3 relative">
          <section className="block inset-0 lg:sticky lg:top-4 z-10">
            <Filtres
              setBgColor={setBgColor}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              category={category}
            />
          </section>
        </aside>
        <section className={`lg:w-[80%] w-full ${isOpen ? 'hidden lg:block' : 'block'}`}>
          <Page
            setIndex={setIndex}
            selectedTagsId={selectedTagsId}
            setSelectedTagsId={setSelectedTagsId}
            index={index}
            data={data}
            cache={cache}
            limit={limit}
            isLoading={isLoading}
            loadMoreEvents={loadMoreEvents}
            fetcher={fetcher}
            search={search}
            setSearch={setSearch}
            setBgColor={setBgColor}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sortPrice={sortPrice}
            category={category}
            sortedEvents={sortedEvents}
            setSortedEvents={setSortedEvents}
          />

          <div className='mx-auto flex justify-center gap-6 mt-10'>
            {hasMore ? <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => loadMoreEvents()}>Загрузить еще</button> : <button className='px-4 py-2 bg-blue-200 text-white cursor-default rounded disabled:bg-gray-300' onClick={() => loadMoreEvents()}>Загрузить еще</button>}
          </div>
        </section>
      </div>
    </>
  );
};
