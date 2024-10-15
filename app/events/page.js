'use client';

import HeroSearch from '../components/HeroSearsh';
import Filtres from '../components/Filtres';
import Card from '../components/Card';
import { useState } from 'react';

export default function Events() {
  const events = [
    { id: 1, category: 'Кинопоказ', price: '250', title: 'Название мероприятия', date: '15-10-2024', place: 'Эрмитаж' },
    { id: 2, category: 'Музыка', price: '1800', title: 'Название мероприятия', date: '16-10-2024', place: 'Эрмитаж' },
    { id: 3, category: 'Стендап', price: '1500', title: 'Название мероприятия', date: '16-10-2024', place: 'Эрмитаж' },
    { id: 4, category: 'Оркестр', price: '900', title: 'Название мероприятия', date: '17-10-2024', place: 'Эрмитаж' },
    { id: 5, category: 'Лекция', price: '1500', title: 'Название мероприятия', date: '18-10-2024', place: 'Эрмитаж' },
    { id: 6, category: 'Тусовка', price: '700', title: 'Название мероприятия', date: '19-10-2024', place: 'Эрмитаж' },
    { id: 7, category: 'Музыка', price: '1800', title: 'Название мероприятия', date: '20-10-2024', place: 'Эрмитаж' },
    { id: 8, category: 'Стендап', price: '690', title: 'Название мероприятия', date: '15-10-2024', place: 'Эрмитаж' },
    { id: 9, category: 'Театр', price: '1500', title: 'Название мероприятия', date: '22-10-2024', place: 'Эрмитаж' },
    { id: 10, category: 'Выставка', price: '550', title: 'Название мероприятия', date: '16-10-2024', place: 'Эрмитаж' },
    { id: 11, category: 'Кинопоказ', price: '200', title: 'Название мероприятия', date: '19-10-2024', place: 'Эрмитаж' }
  ];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [bgColor, setBgColor] = useState('');
  const [selectedButton, setSelectedButton] = useState('');

  const filteredEvents = events.filter((event) => {
    const [day, month, year] = event.date.split('-');
    const eventDate = new Date(`${year}-${month}-${day}`);
    
    // Check date range
    const isInDateRange = (!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate);
  
    return isInDateRange && (selectedTags.length === 0 || selectedTags.includes(event.category));
  });

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
          />
        </aside>
        <section className='lg:w-[80%] w-full'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
            {filteredEvents.map((event) => (
              <Card
                type='mini'
                category={event.category}
                price={event.price}
                title={event.title}
                date={event.date}
                place={event.place}
                key={event.id}
                id={event.id}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
