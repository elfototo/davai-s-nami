'use client';

import HeroSearch from '../../components/HeroSearch';
import Filtres from '../../components/Filtres';
import Card from '../../components/Card';
import React, { useEffect, useState, useReducer } from 'react';
import { categoriesID } from '../data/events';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import useSWRInfinite from 'swr/infinite';
import { API_URL, SEARCH_URL, API_HEADERS } from '../../config';
import { useMemo } from 'react';
import {
  filtersReducer,
  initialFiltersState,
  filterActions,
} from '../../components/filtersReducer';
import { useSearchParams } from 'next/navigation';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const orderOptions = [
  { value: 'date-asc', label: 'Дата ↑' },
  { value: 'date-desc', label: 'Дата ↓' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'title-asc', label: 'Название ↑' },
  { value: 'title-desc', label: 'Название ↓' },
  { value: 'ad-asc', label: 'Ad ↑' },
  { value: 'ad-desc', label: 'Ad ↓' },
  { value: 'id-asc', label: 'ID ↑' },
  { value: 'id-desc', label: 'ID ↓' },
];

function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

function Page({ sortedEvents, isLoadingEvents, isValidating }) {
  // скелетон для cards
  if (isLoadingEvents && sortedEvents.length < 0) {
    return (
      <div className="space-y-4">
        <div className="t-3 flex-cols mx-auto max-w-custom-container justify-center px-4 lg:flex">
          <section className="w-full">
            <div className="grid-rows-auto grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              <div className="animate-shimmer h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
            </div>
          </section>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="grid-rows-auto grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
        {sortedEvents?.length > 0 ? (
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
          <div className="col-span-full text-center text-lg font-semibold text-gray-600">
            {isValidating ? '' : 'Нет доступных событий.'}
          </div>
        )}
      </div>
    </>
  );
}

export default function Events({ initialEvents }) {
  const [hasMore, setHasMore] = useState(true);
  const limit = 100;

  const searchParams = useSearchParams();
  const [filters, dispatch] = useReducer(filtersReducer, initialFiltersState);

  useEffect(() => {
    const category = searchParams.get('category');

    if (category) {
      dispatch(filterActions.initFromUrl({ category }));
    }
  }, [searchParams]);

  const {
    search,
    startDate,
    endDate,
    selectedTags,
    selectedTagsId,
    sortPrice,
    orderBy,
    category,
    isOpen,
  } = filters;

  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    return categoryObj ? categoryObj.id : null;
  };

  // Обновляем selectedTagsId когда меняются selectedTags
  useEffect(() => {
    const ids = selectedTags.map((tag) => getCategoryIdByName(tag) || null);
    dispatch(filterActions.setSelectedTagsId(ids));
  }, [selectedTags]);

  const dateRange = {
    date_from: startDate
      ? dayjs(startDate).utc().tz('Europe/Moscow').format('YYYY-MM-DD')
      : '',
    date_to: endDate
      ? dayjs(endDate).utc().tz('Europe/Moscow').format('YYYY-MM-DD')
      : '',
  };

  const debouncedPrice = useDebouncedValue(sortPrice);
  const parsedPriceMax = Number(debouncedPrice);
  const priceMax =
    debouncedPrice && Number.isFinite(parsedPriceMax) ? parsedPriceMax : null;

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length < limit) return null;
    const offset = pageIndex * limit;
    return `/api/events/valid?filter=${selectedTagsId.join(',')},${dateRange.date_from},${dateRange.date_to},${search},${debouncedPrice || ''},${orderBy}&page=${pageIndex}&offset=${offset}`;
  };

  const fetchEvents = async (url) => {
    const urlObj = new URL(url, API_URL);
    const pageIndex = parseInt(urlObj.searchParams.get('page'), 100) || 0;

    let events = [];

    if (search) {
      try {
        const searchQueryParams = new URLSearchParams({
          query: search,
          type: 'event',
        });
        if (priceMax !== null) {
          searchQueryParams.set('price_max', priceMax);
        }
        searchQueryParams.set('order_by', orderBy);

        const res = await fetch(
          `${SEARCH_URL}?${searchQueryParams.toString()}`,
          {
            method: 'GET',
            headers: API_HEADERS,
          },
        );

        if (!res.ok) throw new Error('Ошибка поиска');
        const result = await res.json();

        events = Array.isArray(result)
          ? result
          : Array.isArray(result.events)
            ? result.events
            : [];
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    } else {
      const body = {
        fields: [
          'event_id',
          'id',
          'title',
          'image',
          'url',
          'price',
          'address',
          'from_date',
          'to_date',
          'full_text',
          'place_id',
          'main_category_id',
        ],
        page: pageIndex,
        limit,
        order_by: orderBy,
      };

      if (selectedTagsId.length > 0) {
        body.category = selectedTagsId;
      }
      if (startDate && endDate) {
        body.date_from = dateRange.date_from;
        body.date_to = dateRange.date_to;
      }
      if (priceMax !== null) {
        body.price_max = priceMax;
      }

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error('Ошибка загрузки данных');

        const result = await res.json();

        events = Array.isArray(result)
          ? result
          : Array.isArray(result.result)
            ? result.result
            : Array.isArray(result.events)
              ? result.events
              : Array.isArray(result.result?.events)
                ? result.result.events
                : [];
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }

    return events;
  };

  const {
    data: dataEvents,
    isLoading: isLoadingEvents,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, fetchEvents, {
    revalidateFirstPage: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    fallbackData: [initialEvents],
    initialSize: 1,
    persistSize: false,
  });

  useEffect(() => {
    if (dataEvents) {
      const lastPage = dataEvents[dataEvents.length - 1];
      setHasMore(lastPage?.length === limit);
    }
  }, [dataEvents]);

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  const sortedEvents = useMemo(() => {
    const allEvents = dataEvents?.flat() || [];
    if (allEvents.length === 0) return [];

    const filtered = allEvents.filter((event) => {
      const eventCategoryName = getCategoryNameById(event.main_category_id);
      const matchesCategory = !category || eventCategoryName === category;

      const eventDateFrom = dayjs(event.from_date)
        .utc()
        .startOf('day')
        .tz('Europe/Moscow');
      const eventDateTo = event.to_date
        ? dayjs(event.to_date).utc().startOf('day').tz('Europe/Moscow')
        : eventDateFrom;

      const startDateClean = startDate ? dayjs(startDate).startOf('day') : null;
      const endDateClean = endDate ? dayjs(endDate).startOf('day') : startDate;

      const isInDateRange =
        (!startDateClean || eventDateTo.isSameOrAfter(startDateClean, 'day')) &&
        (!endDateClean || eventDateFrom.isSameOrBefore(endDateClean, 'day'));

      const matchesSearch = search
        ? (event.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (event.address?.toLowerCase() || '').includes(search.toLowerCase())
        : true;

      const matchesTags =
        selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

      return (
        matchesCategory &&
        isInDateRange &&
        matchesSearch &&
        matchesTags
      );
    });

    return filtered;
  }, [
    dataEvents,
    category,
    search,
    startDate,
    endDate,
    selectedTags,
  ]);

  const loadMoreEvents = () => {
    if (isLoadingEvents || !hasMore) return;
    setSize((prev) => prev + 1);
  };

  return (
    <>
      <HeroSearch
        search={search}
        setSearch={(value) => dispatch(filterActions.setSearch(value))}
        value={'Найти мероприятие'}
      />
      <div className="flex-cols mx-auto mt-3 max-w-custom-container justify-center px-4 lg:flex">
        <aside className="relative mb-3 mr-3 w-full lg:w-[20%]">
          <section className="inset-0 z-10 block lg:sticky lg:top-4">
            <Filtres filters={filters} dispatch={dispatch} />
          </section>
        </aside>
        <section
          className={`w-full lg:w-[80%] ${isOpen ? 'hidden lg:block' : 'block'}`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {orderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => dispatch(filterActions.setOrderBy(option.value))}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  orderBy === option.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <Page
            isValidating={isValidating}
            isLoadingEvents={isLoadingEvents}
            sortedEvents={sortedEvents}
          />

          <div className="mx-auto mt-10 flex justify-center gap-6">
            {hasMore ? (
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
                onClick={() => loadMoreEvents()}
              >
                {isValidating ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            ) : (
              <button
                className="cursor-default rounded bg-blue-200 px-4 py-2 text-white disabled:bg-gray-300"
                onClick={() => loadMoreEvents()}
              >
                Загрузить еще
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
