'use client';

import HeroSearch from '../components/HeroSearsh';
import Filtres from '../components/Filtres';
import Card from '../components/Card';
import { events } from '../data/events';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export default function Events() {


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [bgColor, setBgColor] = useState('');
  const [selectedButton, setSelectedButton] = useState('');
  const [filteredCards, setFilteredCards] = useState(events);


  const filterCards = () => {
    const startISO = startDate ? startDate.toISOString() : null;
    const endISO = endDate ? endDate.toISOString() : null;


    const filtered = events.filter(event => {

      const cardDate = dayjs(event.date, 'DD-MM-YYYY');
      console.log(cardDate.format());

      if (!cardDate.isValid()) {
        console.error(`Invalid date for event: ${event.title} with date: ${event.date}`);
        return false; // Если дата недействительна, пропускаем это событие
      }
      const isAfterStart = !startDate || cardDate.isSameOrAfter(dayjs(startISO));
      const isBeforeEnd = !endDate || cardDate.isSameOrBefore(dayjs(endISO));

      console.log("Comparing:", cardDate.format(), startISO, endISO);
      
      return isAfterStart && isBeforeEnd;
    });
    setFilteredCards(filtered); // Обновляем отфильтрованные карточки
  };

  useEffect(() => {
    if (startDate || endDate) {
        filterCards(); // Фильтрация будет выполняться при изменении startDate или endDate
    }
}, [startDate, endDate]); 

  // const filteredEvents = events.filter((event) => {
  //   const [day, month, year] = event.date.split('-');
  //   const eventDate = dayjs(`${year}-${month}-${day}`).startOf('day');
  //   console.log(eventDate);

  //   // Check date range
  //   // const isInDateRange = (!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate);
  //   const isInDateRange = (!startDate || eventDate.isSame(startDate, 'day')) ||
  //                         (!endDate || eventDate.isSame(endDate, 'day')) ||
  //                         (startDate && endDate && eventDate.isAfter(startDate) && eventDate.isBefore(endDate));
  //                         // (eventDate.isAfter(startDate) && eventDate.isBefore(endDate));
  //   console.log(isInDateRange)


  //   return isInDateRange && (selectedTags.length === 0 || selectedTags.includes(event.category));
  // });

  return (
    <div>
      <HeroSearch />
      <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center'>
        <aside className='lg:w-[20%] w-full h-auto mb-3 mr-3'>
          <Filtres
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            setBgColor={setBgColor}
            filterCards={filterCards}
          />
        </aside>
        <section className='lg:w-[80%] w-full'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
            {filteredCards.map((card) => (
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
