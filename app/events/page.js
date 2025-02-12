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

function Page({ index, setIndex, dataEvents, search, isLoading, startDate, endDate, selectedTags, cache, category, sortPrice, loadMoreEvents, data, limit, selectedTagsId, setSelectedTagsId, sortedEvents, setSortedEvents, isLoadingEvents }) {



  // скелетон для cards
  if (!sortedEvents) {
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
        {
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

  const dateRange = {
    date_from: startDate,
    date_to: endDate,
  }

  const API_URL = 'http://159.223.239.75:8005/api/get_valid_events/';
  const SEARCH_URL = 'http://159.223.239.75:8005/api/search/';
  const API_HEADERS = {
    'Authorization': 'Bearer zevgEv-vimned-ditva8',
    'Content-Type': 'application/json',
  };

  const MIN_EVENTS = 8;

  const fetchEvents = async ( categories, dateRange, search ) => {

    let events = [];
    console.log('Проверка аргументов: categories', categories);
    console.log('Проверка аргументов: dateRange', dateRange);
    console.log('Проверка аргументов: search', search);


    if (search) {
      const searchParams = new URLSearchParams({ query: search, type: 'event' });
      try {
        const res = await fetch(`${SEARCH_URL}?${searchParams}`, {
          method: 'GET',
          headers: API_HEADERS
        });

        if (!res.ok) throw new Error('search: ошибка поиска');

        const result = await res.json();

        if (result && Array.isArray(result)) {
          events = result;
          console.log('search: структура result', events);

        } else if (result.events && Array.isArray(result.events)) {
          events = result.events;
          console.log('search: структура result.events', events);
        } else {
          console.log('search: неизвестная структура данных')
        }
      } catch (error) {
        console.log('search: ошибка', error);

      }
    } else {
      const body = {
        fields: [
          'event_id', 'id', 'title', 'image', 'url', 'price', 'address',
          'from_date', 'full_text', 'place_id', 'main_category_id',
        ],
        page: index,
        limit: limit,
      };
      if (categories?.length > 0) body.category = categories;
      if (startDate) {
        body.date_from = dateRange.date_from;
        body.date_to = dateRange.date_to;
      }

      try {
        console.log('body', body)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(body)
          
        });
        if (!res.ok) throw new Error('Ошибка загрузки данных');

        const result = await res.json();

        if (result && Array.isArray(result)) {
          events = result;
          console.log('основной запрос: структура result', result);
        } else if (result.result && Array.isArray(result.result)) {
          events = result.result;
          console.log('основной запрос: структура result.result', events)
        } else if (result.events && Array.isArray(result.events)) {
          events = result.events;
          console.log('основной запрос: структура result.events', events)
        } else if (result.result.events && Array.isArray(result.result.events)) {
          events = result.result.events;
          console.log('основной запрос: структура result.result.events', events)
        } else {
          console.log('основной запрос: неизвестная структура данных');
        }
      } catch (error) {
        console.log('основной запрос: ошибка', error);
      }
    }
    console.log('основной запрос: events', events);
    if (events.length < limit) {
      setHasMore(false);
    }
    return events;
  };

  const {
    data: dataEvents,
    error: errorEvents,
    isLoading: isLoadingEvents,
  } = useSWR(
    `/api/data?filter=${selectedTagsId.join(',')},${dateRange},${search}?page=${index}`,
    () => fetchEvents(selectedTagsId, dateRange, search),
  );

  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setfilteredEvents] = useState([]);

  console.log('sortedEvents в самом начале', sortedEvents);

  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    setIndex(0);
    return categoryObj ? categoryObj.id : null;
  };

  useEffect(() => {
    setSelectedTagsId(selectedTags.map((tag) => getCategoryIdByName(tag) || null));
    console.log('selectedTags to tags id');

  }, [selectedTags]);

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  useEffect(() => {
    let eventsToSort = [...allEvents];

    allEvents.forEach(event => loadedEventIdsRef.current.add(event.id));

    if (dataEvents && dataEvents.length > 0) {
      console.log('Берем данные с сервера');

      dataEvents.forEach(event => {
        if (!loadedEventIdsRef.current.has(event.id)) {
          loadedEventIdsRef.current.add(event.id);
          eventsToSort.push(event);
        }
      });
    }

    if (eventsToSort.length > 0) {

      setAllEvents(eventsToSort);

      setfilteredEvents(eventsToSort.filter((event) => {
        const eventCategoryName = getCategoryNameById(event.main_category_id);
        const matchesCategory = !category || eventCategoryName === category;

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

        const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

        return matchesCategory && isInDateRange && matchesSearch && matchesTags;
      }))

      console.log('filteredEvents', filteredEvents);


      if (filteredEvents.length < limit || filteredEvents.length % limit !== 0) {
        loadMoreEvents();
      }

      console.log('index', index);


      setSortedEvents(filteredEvents);
      console.log('sortedEvents', sortedEvents);
    };

  }, [category, search, sortPrice, startDate, endDate, selectedTags, dataEvents, index]);

  console.log('sortedEvents с основным запросом', sortedEvents)

  console.log("dataEvents", dataEvents);
  console.log("ошибка dataEvents", errorEvents);
  console.log("Загрузка dataEvents", isLoadingEvents);

  // const fetcher = async () => {

  //   try {
  //     const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': 'Bearer zevgEv-vimned-ditva8',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         date_from: today,
  //         date_to: nextSixMonth,
  //         fields: [
  //           'event_id',
  //           'id',
  //           'title',
  //           'image',
  //           'url',
  //           'price',
  //           'address',
  //           'from_date',
  //           'full_text',
  //           'place_id',
  //           'main_category_id',
  //         ],
  //         page: index,
  //         limit: limit,
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error('Ошибка получения task_id: ', res.statusText);
  //     };

  //     const result = await res.json();

  //     console.log('result для пагинации', result);

  //     let newEvents = [];

  //     if (result.task_id) {
  //       const taskId = result.task_id;

  //       console.log('есть result.task_i')

  //       const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

  //       try {
  //         const statusResponse = await fetch(statusUrl, {
  //           method: 'GET',
  //           headers: {
  //             'Authorization': 'Bearer zevgEv-vimned-ditva8',
  //             'Content-Type': 'application/json',
  //           },
  //         });

  //         if (!statusResponse.ok) {
  //           throw new Error('Ошибка запроса данных: ', statusResponse.statusText);
  //         }

  //         const statusResult = await statusResponse.json();
  //         console.log('statusResult', statusResult);

  //         if (Array.isArray(statusResult)) {
  //           newEvents = statusResult;
  //         } else if (statusResult.events && Array.isArray(statusResult.events)) {
  //           newEvents = statusResult.events;
  //         } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
  //           newEvents = statusResult.result.events;
  //         } else {
  //           console.log('Неизвестная структура данных');
  //         }

  //         console.log('newEvents', newEvents);

  //         if (newEvents.length < limit) {
  //           setHasMore(false);
  //         }

  //         return newEvents;

  //       } catch (error) {
  //         console.log(`Ошибка запроса: `, error);
  //       }
  //     } else {
  //       console.log('Возвращаем result без task_id', result)

  //       if (Array.isArray(result)) {
  //         newEvents = result;
  //       } else if (result.result && Array.isArray(result.result)) {
  //         newEvents = result.result;
  //       } else if (result.result.events && Array.isArray(result.result.events)) {
  //         newEvents = result.result.events;
  //       } else {
  //         console.log('Неизвестная структура данных');
  //       }

  //       console.log('newEvents', newEvents);

  //       if (newEvents.length < limit) {
  //         setHasMore(false);
  //       }
  //       return newEvents;
  //     }
  //   } catch (error) {
  //     console.log('Ошибка создания задачи', error);
  //   }
  // };

  // const {
  //   data,
  //   error,
  //   isLoading,
  // } = useSWR(`/api/data?page=${index}`,
  //   fetcher);

  // if (isLoading) console.log('ЗАГРУЗКА');
  // if (error) console.log('ОШИБКА', error.info);
  // console.log('Загруженные данные: ', data);

  const loadMoreEvents = () => {
    if (isLoadingEvents || !hasMore) return;
    setIndex(prevIndex => prevIndex + 1);
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
            dataEvents={dataEvents}
            isLoadingEvents={isLoadingEvents}
            setIndex={setIndex}
            selectedTagsId={selectedTagsId}
            setSelectedTagsId={setSelectedTagsId}
            index={index}
            cache={cache}
            limit={limit}
            loadMoreEvents={loadMoreEvents}
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
