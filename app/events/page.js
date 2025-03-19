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
import { useEvents } from '../../context/SwrContext';
import useSWRInfinite from "swr/infinite";
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function Page({ sortedEvents, isLoadingEvents, isValidating }) {
  // скелетон для cards
  if (isLoadingEvents) {
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
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg font-semibold">
              {isValidating ?
                '' : 'Нет доступных событий.'}
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
  // const [index, setIndex] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setfilteredEvents] = useState([]);
  const [isTryingToLoadMore, setIsTryingToLoadMore] = useState(false);
  const [limit, setLimit] = useState(20);
  const initialLimit = 8;

  const dateRange = {
    date_from: dayjs(startDate).utc().tz('Europe/Moscow').format('YYYY-MM-DD'),
    date_to: dayjs(endDate).utc().tz('Europe/Moscow').format('YYYY-MM-DD'),
  }

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length < limit) return null;
    const offset = pageIndex * limit;

    return `/api/data?filter=${selectedTagsId.join(',')},${dateRange.date_from || ''},${dateRange.date_to || ''},${search}&page=${pageIndex}&offset=${offset}`;
  };

  const fetchEvents = async (url) => {
    const urlObj = new URL(url, API_URL);
    const pageIndex = parseInt(urlObj.searchParams.get('page'), 10) || 0;

    let events = [];

    if (search) {
      try {
        const res = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(search)}&type=event`, {
          method: 'GET',
          headers: API_HEADERS,
        });

        if (!res.ok) throw new Error('Ошибка поиска');
        const result = await res.json();


        events = Array.isArray(result) ? result :
          Array.isArray(result.events) ? result.events :
            [];
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    } else {
      const body = {
        fields: [
          'event_id', 'id', 'title', 'image', 'url', 'price', 'address',
          'from_date', 'to_date', 'full_text', 'place_id', 'main_category_id',
        ],
        page: pageIndex,
        limit,
      };

      if (selectedTagsId.length > 0) {
        body.category = selectedTagsId;
      }
      if (startDate && endDate) {
        body.date_from = dateRange.date_from;
        body.date_to = dateRange.date_to;
      }

      try {

        const res = await fetch(API_URL, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(body),
        });


        if (!res.ok) throw new Error('Ошибка загрузки данных');

        const result = await res.json();


        events = Array.isArray(result) ? result :
          Array.isArray(result.result) ? result.result :
            Array.isArray(result.events) ? result.events :
              Array.isArray(result.result?.events) ? result.result.events :
                [];
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }

    return events;
  };

  const {
    data: dataEvents,
    error: errorEvents,
    isLoading: isLoadingEvents,
    mutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, fetchEvents, {
    revalidateFirstPage: false, // Отключает повторный запрос первой страницы при обновлении
  });


  useEffect(() => {
    if (dataEvents) {

      setHasMore(dataEvents?.[dataEvents.length - 1]?.length === limit);

      // Объединяем все страницы данных в один массив
      const newEvents = dataEvents.flat();

      // Фильтруем события, чтобы избежать дубликатов
      const uniqueEvents = newEvents.filter(event => !loadedEventIdsRef.current.has(event.id));


      if (uniqueEvents.length > 0) {
        setAllEvents(prevEvents => [...prevEvents, ...uniqueEvents]);

        // Обновляем loadedEventIdsRef
        uniqueEvents.forEach(event => loadedEventIdsRef.current.add(event.id));
      }

    }
  }, [dataEvents]);


  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    return categoryObj ? categoryObj.id : null;
  };

  useEffect(() => {
    setSelectedTagsId(selectedTags.map((tag) => getCategoryIdByName(tag) || null));

  }, [selectedTags]);

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  useEffect(() => {
    if (allEvents.length > 0) {
      // Фильтрация событий
      const filtered = allEvents.filter((event) => {

        const eventCategoryName = getCategoryNameById(event.main_category_id);
        const matchesCategory = !category || eventCategoryName === category;

        const eventDateFrom = dayjs(event.from_date).utc().startOf('day').tz('Europe/Moscow');
        let eventDateTo = event.to_date
          ? dayjs(event.to_date).utc().startOf('day').tz('Europe/Moscow')
          : eventDateFrom;

        const startDateClean = startDate ? dayjs(startDate).startOf('day') : null;
        const endDateClean = endDate ? dayjs(endDate).startOf('day') : startDate;


        const isInDateRange =
          (!startDateClean || eventDateTo.isSameOrAfter(startDateClean, 'day')) &&
          (!endDateClean || eventDateFrom.isSameOrBefore(endDateClean, 'day'));


        const matchesSearch = search
          ? (
            (event.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (event.price?.toString().toLowerCase() && event.price?.toString().toLowerCase().includes(search)) ||
            (event.address?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (event.from_date && (
              dayjs(event.from_date).format('YYYY-MM-DD').includes(search) ||
              dayjs(event.from_date).format('DD MMMM YYYY').toLowerCase().includes(search.toLowerCase()) ||
              dayjs(event.from_date).format('MMMM DD, YYYY').toLowerCase().includes(search.toLowerCase()) ||
              dayjs(event.from_date).format('MMMM').toLowerCase().includes(search.toLowerCase())
            ) ||
              (event.place_id && event.place_id.toString().includes(search)) ||
              (event.main_category_id && getCategoryNameById(event.main_category_id)?.toLowerCase().includes(search.toLowerCase()))
            )
          )
          : true;

        const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

        return matchesCategory && isInDateRange && matchesSearch && matchesTags;
      });

      setfilteredEvents(filtered);

      // Сортировка событий (если нужно)
      const sorted = filtered.sort((a, b) => {
        // Ваша логика сортировки
        return new Date(a.from_date) - new Date(b.from_date);
      });

      setSortedEvents(sorted);


      // Проверка, нужно ли загружать больше событий
      if (filtered.length === 0 && hasMore && !isTryingToLoadMore) {
        setIsTryingToLoadMore(true);
        loadMoreEvents();
      } else {
        setIsTryingToLoadMore(false);
      }
    }
  }, [allEvents, category, search, startDate, endDate, selectedTags, isTryingToLoadMore]);

  const loadMoreEvents = () => {
    if (isLoadingEvents || !hasMore) return;
    setSize((prev) => prev + 1);
  };

  return (
    <>
      <HeroSearch
        search={search}
        setSearch={setSearch}
        value={'Найти мероприятие'}
      />
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
            isValidating={isValidating}
            dataEvents={dataEvents}
            isLoadingEvents={isLoadingEvents}
            selectedTagsId={selectedTagsId}
            setSelectedTagsId={setSelectedTagsId}
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
            {hasMore ? <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => loadMoreEvents()}>{isValidating ? "Загрузка..." : "Загрузить еще"}</button> : <button className='px-4 py-2 bg-blue-200 text-white cursor-default rounded disabled:bg-gray-300' onClick={() => loadMoreEvents()}>Загрузить еще</button>}
          </div>
        </section>
      </div>
    </>
  );
};
