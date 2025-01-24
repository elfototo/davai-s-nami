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
import { useEvents } from '../../context/SwrContext';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function Page({ index, search, setSearch, setBgColor, startDate, setStartDate, endDate, setEndDate, selectedTags, setSelectedTags, isOpen, events, category, sortPrice, loadMoreEvents, data, limit }) {


  const [sortedEvents, setSortedEvents] = useState([]);

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  const getCategoryIdByName = (name) => {
    const categoryObj = categoriesID.find((cat) => cat.category === name);
    return categoryObj ? categoryObj.id : null;
  };

  useEffect(() => {
    let eventsToSort = [];
    const eventIds = new Set();

    if (events.length > 0) {
      console.log('берем данные из кэша');
      eventsToSort = [...events];
      eventsToSort.forEach(event => eventIds.add(event.id));

    } else if (data && data.length > 0) {
      console.log('Берем данные с сервера');

      data.forEach(event => {
        if (!eventIds.has(event.id)) {
          eventsToSort.push(event);
          eventIds.add(event.id);
        }
      });
    }

    if (eventsToSort.length > 0) {

      const filteredEvents = eventsToSort.filter((event) => {
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

      console.log('sorted', sorted);

      if (sorted.length === 0 || sorted.length % limit !== 0) {
        loadMoreEvents();
      }

      setSortedEvents(sorted);
    };

  }, [category, search, sortPrice, startDate, endDate, selectedTags, data, index]);

  console.log('sortedEvents после useEffect', sortedEvents);


  if (!events && !data) {
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

  const { index, setIndex, fetcher, data, events, loadMoreEvents, setHasMore, hasMore, limit } = useEvents();
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
            index={index}
            data={data}
            events={events}
            limit={limit}
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
            category={category} />
          {/* <div style={{ display: 'none' }}>
            <Page
              index={index + 1}
              data={data}
              loadMoreEvents={loadMoreEvents}
              events={events}
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
            />
          </div> */}

          <div className='mx-auto flex justify-center gap-6 mt-10'>
            {/* <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => setIndex(index - 1)}>Назад</button> */}
            {hasMore ? <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300' onClick={() => loadMoreEvents()}>Загрузить еще</button> : <button className='px-4 py-2 bg-blue-200 text-white cursor-default rounded disabled:bg-gray-300' onClick={() => loadMoreEvents()}>Загрузить еще</button>}

          </div>

        </section>

      </div>
    </>
  );
};
