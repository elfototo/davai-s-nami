'use client'
import './globals.css';
import Card from './components/Card';
import Categories from './components/Categories';
import Link from 'next/link';
import 'animate.css';
import { useEffect, useState } from 'react';
import { data } from './data/events';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Home() {

  const [events, setEvents] = useState(data);

  const filterEventsTodayTomorrow = events.filter((event) => {
    const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow');
    const today = dayjs().utc().tz('Europe/Moscow').startOf('day');
    const tomorrow = today.add(1, 'day').startOf('day');

    const isToday = eventDate.isSame(today, 'day');
    const isTomorrow = eventDate.isSame(tomorrow, 'day');

    return isToday || isTomorrow;
  });

  const filterEventsWeekend = events.filter((event) => {
    const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow');
    const startOfWeekend = dayjs().isoWeekday(6).utc().tz('Europe/Moscow').startOf('day');
    const endOfWeekend = startOfWeekend.add(1, 'day');
    const isStartOfWeekend = eventDate.isSame(startOfWeekend, 'day');
    const isEndOfWeekend = eventDate.isSame(endOfWeekend, 'day');

    return isStartOfWeekend || isEndOfWeekend;
  });

  return (
    <div>
      <section className='max-w-custom-container mx-auto'>

      </section>
      <section className='bg-accent-gradient h-[26rem] relative overflow-hidden'>
        <div className="flex justify-center md:justify-between h-[inherit] m-0 mx-auto max-w-custom-container overflow-hidden px-4 md:pl-10 md:pr-0">
          <div className='flex items-center md:items-start justify-center flex-col md:max-w-[50%]'>
            <h4 className='font-roboto font-bold text-secondary text-6xl mb-5  whitespace-nowrap'>Играй с нами!</h4>
            <p className='font-roboto text-center md:text-start font-regular text-secondary mb-5'>Нажми на кнопку чтобы найти случайное <br /> мероприятие на свой уикенд в Санкт - Петербурге</p>
            <button
              className={`font-roboto  w-3/4 py-4 text-[1rem] font-medium bg-white text-[#333] rounded-lg shadow-lg 
              transform transition-transform duration-300 hover:scale-105
              `}>Мне повезет</button>
          </div>

          {/* md-screen */}
          <div className='h-full w-[60%] relative hidden md:block'>
            <div className="w-full absolute left-0 top-5 h-full bg-cover bg-no-repeat md:bg-[url('/img/sm-banner.png')] lg:bg-[url('/img/banner.png')]">
            </div>
          </div>
        </div>

      </section>

      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>
        <div className='font-roboto font-medium'>
          <Categories />
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Горячие новинки месяца</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-center justify-center'>
            {filterEventsTodayTomorrow.slice(0, 4).map((card) => (
              <Card
                type='mini'
                category={card.category}
                price={card.price}
                title={card.title}
                from_date={card.from_date}
                address={card.address}
                key={card.event_id}
                id={card.id}
                data={card}
                image={card.image} />
            ))}
          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить сегодня и завтра</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center items-center flex-wrap'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-center justify-center'>
            {filterEventsTodayTomorrow.slice(0, 4).map((card) => (
              <Card
                type='mini'
                category={card.category}
                price={card.price}
                title={card.title}
                from_date={card.from_date}
                address={card.address}
                key={card.event_id}
                id={card.id}
                data={card}
                image={card.image} />
            ))}

          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить в выходные</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-center justify-center'>
          {filterEventsWeekend.slice(0, 4).map((card) => (
            <Card
              type='mini'
              category={card.category}
              price={card.price}
              title={card.title}
              from_date={card.from_date}
              address={card.address}
              key={card.event_id}
              id={card.id}
              data={card}
              image={card.image} />
          ))}

        </div>
      </section>


    </div>
  );
}
