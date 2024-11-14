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
import isBetween from 'dayjs/plugin/isBetween';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import Loader from './components/Loader';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function Home() {

  const [events, setEvents] = useState(data);
  const [showGame, setShowGame] = useState(false);
  const [randomEv, setRandomEv] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const toggleShowGame = () => {
    setShowGame(!showGame);
  }

  const getRandomEvent = () => {
    setIsLoading(true);
    const today = dayjs().utc().tz('Europe/Moscow').startOf('day');
    const end = today.add(60, 'day').startOf('day');

    const filterEvents = events.filter((event) => {
      const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow');
      return eventDate.isAfter(today) && eventDate.isBefore(end);
    });

    if (filterEvents.length === 0) return null;

    for (let i = filterEvents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filterEvents[i], filterEvents[j]] = [filterEvents[j], filterEvents[i]];
    }

    const randomEvent = filterEvents[0];

    setTimeout(() => {
      setRandomEv(randomEvent);
      setIsLoading(false); // Скрываем лоадер
      setShowGame(true); // Показываем окно мероприятия
      console.log(randomEvent.title);
    }, 10000);
  }

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
              onClick={getRandomEvent}
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

      <section className='max-w-custom-container mx-auto px-4 relative'>
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
            {filterEventsTodayTomorrow.length > 0 ? (filterEventsTodayTomorrow.slice(0, 4).map((card) => (
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
            ))) : <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
              Нет доступных событий.
            </p>}
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
            {filterEventsTodayTomorrow.length > 0 ? (filterEventsTodayTomorrow.slice(0, 4).map((card) => (
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
            ))) : <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
              Нет доступных событий.
            </p>}
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
          {filterEventsWeekend.length > 0 ? (filterEventsWeekend.slice(0, 4).map((card) => (
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
          ))) : <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
            Нет доступных событий.
          </p>}

        </div>
        <div className="h-screen font-cursive text-center text-[#004466] bg-[#e4e5e6] flex items-center justify-center z-20 fixed inset-0  bg-opacity-50 loader-wrapper">
          <Loader className="relative z-30" />
        </div>

        {isLoading && (
          <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 loader-wrapper">
            <Loader />
          </div>
        )}

        {showGame &&
          <div className='z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
          >
            <div className='bg-white border border-gray-300 rounded shadow-md p-4 max-w-xl w-auto relative max-h-[90%]'>
              {randomEv ?
                <Image className='mx-auto object-contain object-center rounded-lg  '
                  src={randomEv.image}
                  width={1000}
                  height={1000}
                  style={{ height: '60vh', width: 'auto' }}

                  alt="avatar" />
                : ''}

              <div className='flex justify-center items-center'>
                {randomEv ? <h2 className='my-2 mx-auto'>{randomEv.title}</h2> : ''}
              </div>

              <Link href={`/events/${randomEv.id}`}>
                <button

                  className='font-roboto my-1 mx-auto w-full py-4 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg transform transition-transform duration-300 hover:bg-pink-400'
                >
                  Смотреть
                </button>
              </Link>
              <button
                onClick={toggleShowGame}
                className='absolute -top-8 -right-8'
              >
                <IoMdClose className='text-[2rem] text-[#fff]' />
              </button>
            </div>
          </div>
        }
      </section>


    </div>
  );
}
