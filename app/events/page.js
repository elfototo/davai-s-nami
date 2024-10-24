'use client';

import HeroSearch from '../components/HeroSearsh';
import Filtres from '../components/Filtres';
import Card from '../components/Card';
import { data } from '../data/events';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Events() {

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortPrice, setSortPrice] = useState(null);
  const [bgColor, setBgColor] = useState('');
  const [events, setEvents] = useState(data);
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((event) => {

    // sort date
    const [day, month, year] = event.date.split('-');
    const eventDate = dayjs(`${year}-${month}-${day}`).utc(+3).startOf('day');
    const isInDateRange = (!startDate || eventDate.isSame(startDate, 'day')) ||
      (!endDate || eventDate.isSame(endDate, 'day')) ||
      (startDate && endDate && eventDate.isAfter(startDate) && eventDate.isBefore(endDate));

    // sort price
    const sortedEvents = sortPrice ? events.sort((a, b) => {
      if (sortPrice === 'default') {
        return a.id - b.id;
      } else {
        return sortPrice === 'asc' ? a.price - b.price : b.price - a.price;
      }
    }) : events;

    const sortSearch = search.toLocaleLowerCase() === '' ? event : event.title.toLocaleLowerCase().includes(search) || event.category.toLocaleLowerCase().includes(search) || event.place.toLocaleLowerCase().includes(search);

    return sortSearch && sortedEvents && isInDateRange && (selectedTags.length === 0 || selectedTags.includes(event.category));
  });

  return (
    <div>
      <HeroSearch
        search={search}
        setSearch={setSearch}
      />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center'>
        <aside className='lg:w-[20%] w-full h-auto mb-3 mr-3'>
          <Filtres
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            setBgColor={setBgColor}
            sortPrice={sortPrice}
            setSortPrice={setSortPrice}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </aside>
        <section className={`lg:w-[80%] w-full ${isOpen ? 'hidden lg:block' : 'block'}`}>
          <div className={`  grid gap-3 grid-cols-2 md:grid-cols-4`}>
            {filteredEvents.map((card) => (
              <Card
                type='mini'
                category={card.category}
                price={card.price}
                title={card.title}
                date={card.date}
                place={card.place}
                key={card.id}
                id={card.id}
                data={card}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};