'use client';

import HeroSearch from '../components/HeroSearch';
import Filtres from '../components/Filtres';
import Card from '../components/Card'
import React, { useEffect, useState } from 'react';
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



dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function Page({ index, search, setSearch, setBgColor, startDate, setStartDate, endDate, setEndDate, selectedTags, setSelectedTags, isOpen, setIsOpen, category, sortPrice }) {

  const limit = 8;
  let today = dayjs().format('YYYY-MM-DD');
  let nextSixMonth = dayjs().add(6, 'month').format('YYYY-MM-DD');

  const fetcher = async () => {
    // setIsLoadingPage(true);

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

      const taskId = result.task_id;
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

        let newEvents = [];

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

        return newEvents;

      } catch (error) {
        console.log(`Ошибка запроса: `, error);
      }

    } catch (error) {
      console.log('Ошибка создания задачи', error);
    }
  };

  const { data, error, isLoading } = useSWR(`/api/data?page=${index}`, fetcher);

  console.log('data', data);

  const [sortedEvents, setSortedEvents] = useState([]);

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    return categoryObj ? categoryObj.id : null;
  };

  const { cache } = useSWRConfig();
  console.log('cache', cache, cache.size);
  console.log('cache get', cache.get(`/api/data?page=0`).data);

  const dataCache = [];

  // for (let i = 0; i < cache.size; i++) {
  //   const data = cache.get(`/api/data?page=${i}`).data;
  //   console.log('data from cache', data);
  //   if (data.length > 0) {
  //     dataCache.push(...data);
  //   }
  //   console.log('dataCache', dataCache);
  // }

  // const [events, setEvents] = useState(dataCache);

  // console.log('events', events);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const filteredEvents = data.filter((event) => {
      const eventCategoryName = getCategoryNameById(event.main_category_id);
      const matchesCategory = !category || eventCategoryName === category;

      const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow').startOf('day');
      const isInDateRange = (!startDate || eventDate.isSameOrAfter(startDate, 'day')) &&
        (!endDate || eventDate.isSameOrBefore(endDate, 'day'));

      const matchesSearch = search
        ? (event.title?.toLowerCase() || '').includes(search.toLowerCase())
        : true;

      const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

      return matchesCategory && isInDateRange && matchesSearch && matchesTags;
    });

    const sorted = sortPrice
      ? filteredEvents.sort((a, b) => (sortPrice === 'asc' ? a.price - b.price : b.price - a.price))
      : filteredEvents;

    setSortedEvents(sorted);

    // if (sorted.length < 20) {

    //   loadMoreEvents();
    // }

  }, [data, category, search, sortPrice, startDate, endDate, selectedTags]);

  if (!data) {
    return (
      <div className='fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 fade-in'>
        Загрузка...
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
        {
          sortedEvents.length > 0 ? (
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

  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortPrice, setSortPrice] = useState(null);
  const [category, setCategory] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
            index={pageIndex}
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
            category={category} />
          <div style={{ display: 'none' }}>
            <Page
              index={pageIndex + 1}
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
            /></div>
          <div className='mx-auto flex justify-center gap-6 mt-10'>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => setPageIndex(pageIndex - 1)}>Назад</button>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => setPageIndex(pageIndex + 1)}>Вперёд</button>
          </div>

        </section>

      </div>
    </>
  );
};
