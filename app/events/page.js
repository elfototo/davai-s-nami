'use client';

import HeroSearch from '../components/HeroSearch';
import Filtres from '../components/Filtres';
import Card from '../components/Card'
import React, { useEffect, useState } from 'react';
import { categoriesID } from '../data/events';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEvents } from '../../context/EventsContext';
// import { data1 } from '../data/events';



dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);


export default function Events() {
  const { events, setEvents } = useEvents();
  // const [events, setEvents] = useState(data1);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortPrice, setSortPrice] = useState(null);
  // const [events, setEvents] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    if (!events || events.length === 0) return;

    const getCategoryNameById = (id) => {
      const categoryObj = categoriesID.find((cat) => cat.id === id);
      return categoryObj ? categoryObj.category : null;
    };

    const filteredEvents = events.filter((event) => {
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
  }, [events, category, search, sortPrice]); // add dependencies

  if (!sortedEvents.length) return <div className='fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 fade-in'>
    {/* <CatLoader /> */}
    Загрузка...
  </div>;

  return (
    <div>
      <HeroSearch search={search} setSearch={setSearch} />
      <div className="mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">
        <aside className="lg:w-[20%] w-full mb-3 mr-3 relative">
          <div className="block inset-0 lg:sticky lg:top-4 z-10">
            <Filtres
              setBgColor={setBgColor}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              sortPrice={sortPrice}
              setSortPrice={setSortPrice}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </aside>
        <section className={`lg:w-[80%] w-full ${isOpen ? 'hidden lg:block' : 'block'}`}>
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
                <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
                  Нет доступных событий.
                </p>
              )
            }
          </div>

          {hasMore && (
            <div className="text-center my-4">
              <button
                // onClick={handleLoadMore}
                // disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
              </button>
            </div>
          )}

        </section>
      </div>
    </div>
  );
};