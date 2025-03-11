'use client';

import './globals.css';
import Card from './components/Card';
import Categories from './components/Categories';
import Link from 'next/link';
import 'animate.css';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import Loader from './components/Loader';
import { useSWRConfig } from 'swr';
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../context/SwrContext';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../config';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function Home() {

  const [showGame, setShowGame] = useState(false);
  const [randomEv, setRandomEv] = useState(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [weekendEvents, setWeekendEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [eventsTodayTomorrow, setEventsTodayTomorrow] = useState([]);
  const [eventsForGame, setEventsForGame] = useState([]);
  const { cache, findDataById } = useEvents();

  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
  const today = todayforcount.format('YYYY-MM-DD');
  const tomorrow = todayforcount.add(1, 'day').startOf('day').format('YYYY-MM-DD');
  const month = todayforcount.add(1, 'month').startOf('day').format('YYYY-MM-DD');

  const startOfWeekendforCount = dayjs().isoWeekday(6).utc().tz('Europe/Moscow').startOf('day');
  const startOfWeekend = startOfWeekendforCount.format(('YYYY-MM-DD'));
  const endOfWeekend = startOfWeekendforCount.add(1, 'day').format('YYYY-MM-DD');

  const dateRange1 = { date_from: today, date_to: tomorrow, limit: 10 };
  const dateRangemonth = { date_from: today, date_to: month, limit: 10 };
  const dateRange2 = { date_from: startOfWeekend, date_to: endOfWeekend, limit: 10 };
  const dateRangeForGame = { date_from: today, date_to: month, limit: 50 };

  const fetcher = async (dateRange) => {
    try {
      console.log('fetcher args', dateRange.date_from);
      console.log('fetcher args', dateRange.date_to);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          date_from: dateRange.date_from,
          date_to: dateRange.date_to,
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
          limit: dateRange.limit,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.statusText}`);
      }


      const result = await res.json();
      console.log('Task created с диапазоном дат: ', result);

      let eventsfromFetcher = [];

        console.log('result', result);
        if (result.result && Array.isArray(result.result)) {
          console.log('result.result', result.result.events)
          eventsfromFetcher = result.result;
        } else if (result.result.events && Array.isArray(result.result.events)) {
          console.log('result.result.events', result.result.events)
          eventsfromFetcher = result.result.events;
        } else {
          console.log('Неизвестная структура данных');
          setStatus('Не удалось обработать данные');
          return;
        }

        console.log('eventsfromFetcher', eventsfromFetcher)

        return eventsfromFetcher;

    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const toggleShowGame = () => {
    setShowGame(!showGame);
  }

  const getRandomEvent = () => {
    setIsLoadingGame(true);
    const today = dayjs().utc().tz('Europe/Moscow').startOf('day');
    const end = today.add(7, 'day').startOf('day');


    if (eventsForGame.length > 0) {
      const filterEvents = eventsForGame.filter((event) => {
        const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow');
        return eventDate.isAfter(today) && eventDate.isBefore(end);
      });

      if (filterEvents.length === 0) return null;

      for (let i = filterEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filterEvents[i], filterEvents[j]] = [filterEvents[j], filterEvents[i]];
      }

      const randomEvent = filterEvents[0];

      const img = new window.Image();
      img.src = randomEvent.image === "" ? "/img/cat.png" : randomEvent.image;

      img.onload = () => {

        setTimeout(() => {
          setRandomEv(randomEvent); // Устанавливаем мероприятие
          setIsLoadingGame(false); // Скрываем лоадер
          setShowGame(true); // Показываем окно мероприятия
          console.log(randomEvent.title);
        }, 6000); // Сохраняем задержку, если она нужна
      };

      img.onerror = () => {
        console.error("Ошибка загрузки изображения");
        setTimeout(() => {
          setRandomEv(randomEvent);
          setIsLoadingGame(false);
          setShowGame(true);
        }, 8000);
      };
    }
  }

  const {
    data: dataEventDateRange1,
    error: dataErrorDateRange1,
    isLoading: dataIsDateRange1
  } = useSWR(
    dateRange1 ? `/api/data?dateRange=${dateRange1.date_from, dateRange1.date_to}` : null,
    () => fetcher(dateRange1),
  );
  console.log("dataEventDateRange1", dataEventDateRange1);

  const {
    data: dataEventDateRangeForGame,
    error: dataErrorDateRangeForGame,
    isLoading: dataIsDateRangeForGame
  } = useSWR(
    dateRangeForGame ? `/api/data?dateRange=${dateRangeForGame.date_from, dateRangeForGame.date_to}` : null,
    () => fetcher(dateRangeForGame),
  );
  console.log("dataEventDateRangeForGame", dataEventDateRangeForGame);


  const {
    data: dataEventDateRange2,
    error: dataErrorDateRange2,
    isLoading: dataIsDateRange2
  } = useSWR(
    dateRange2 ? `/api/data?dateRange=${dateRange2.date_from, dateRange2.date_to}` : null,
    () => fetcher(dateRange2)
  );
  console.log("dataEventDateRange2", dataEventDateRange2);


  const {
    data: dataEventDateRangeMonth,
    error: dataErrorDateRangeMonth,
    isLoading: dataIsDateRangeMonth
  } = useSWR(
    dateRangemonth ? `/api/data?dateRange=${dateRangemonth.date_from, dateRangemonth.date_to}` : null,
    () => fetcher(dateRangemonth)
  );
  console.log("dataEventDateRangeMonth", dataEventDateRangeMonth);


  const cacheDataRange1 = cache?.get(`/api/data?dateRange=${dateRange1.date_from, dateRange1.date_to}`)?.data;
  console.log('cacheDataRange1', cacheDataRange1);

  const cacheDataRange2 = cache?.get(`/api/data?dateRange=${dateRange2.date_from, dateRange2.date_to}`)?.data;
  console.log('cacheDataRange2', cacheDataRange2);

  const cacheDataEventDateRangeMonth = cache?.get(`/api/data?dateRange=${dateRangemonth.date_from, dateRangemonth.date_to}`)?.data;
  console.log('cacheDataEventDateRangeMonth', cacheDataEventDateRangeMonth);


  useEffect(() => {
    if (cacheDataRange1) {
      const randomEvents = getRandomEvents(cacheDataRange1, 4);
      console.log('берем данные из кэша для cacheDataRange1', randomEvents);

      setEventsTodayTomorrow(randomEvents);
      console.log('eventsTodayTomorrow', eventsTodayTomorrow);

    } else if (dataEventDateRange1) {
      const randomEvents = getRandomEvents(dataEventDateRange1, 4);
      console.log('берем данные с сервера для dataEventDateRange1', randomEvents);
      setEventsTodayTomorrow(randomEvents);

    }

    if (cacheDataRange2) {
      const randomEvents = getRandomEvents(cacheDataRange2, 4);
      console.log('берем данные из кэша для cacheDataRange2', randomEvents);

      setWeekendEvents(randomEvents);
    } else if (dataEventDateRange2) {
      const randomEvents = getRandomEvents(dataEventDateRange2, 4);
      console.log('берем данные с сервера для dataEventDateRange2', randomEvents);

      setWeekendEvents(randomEvents);
    }

    if (cacheDataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(cacheDataEventDateRangeMonth, 4);
      console.log('берем данные из кэша для cacheDataEventDateRangeMonth', randomEvents);

      setMonthEvents(randomEvents);
    } else if (dataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(dataEventDateRangeMonth, 4);
      console.log('берем данные с сервера для dataEventDateRangeMonth', randomEvents);

      setMonthEvents(randomEvents);
    }

    if (dataEventDateRangeForGame) {
      setEventsForGame(dataEventDateRangeForGame);
    }
  }, [dataEventDateRange1, dataEventDateRange2, dataEventDateRangeForGame, cacheDataRange1, cacheDataRange2, cacheDataEventDateRangeMonth])

  const getRandomEvents = (array, count) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };

  const loader = (
    <div className="absolute flex items-center justify-cente mx-auto">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 border-4 border-pink-300 border-solid border-r-transparent rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-4 border-indigo-200 border-solid border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  return (
    <>
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
        <div className='flex flex-wrap justify-between items-baseline mb-6 mt-12'>
          <h1 className='font-roboto font-bold mb-3 mr-5 mt-0'>Горячие новинки месяца</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center items-center flex-wrap'>
          <div className='relative grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto mt-5'>

            {dataIsDateRangeMonth ? (
              loader
            ) :
              (monthEvents?.slice(0, 4).map((card) => (
                <Card
                  type='mini'
                  category={card.category}
                  main_category_id={card.main_category_id}
                  price={card.price}
                  title={card.title}
                  from_date={card.from_date}
                  address={card.address}
                  key={card.event_id}
                  id={card.id}
                  data={card}
                  image={card.image} />
              )))
            }

          </div>
        </div>
      </section>

      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex flex-wrap justify-between items-baseline mb-6 mt-12'>
          <h1 className='font-roboto font-bold mb-3 mr-5 mt-0'>Куда сходить сегодня и завтра</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center items-center flex-wrap'>
          <div className='relative grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto mt-5'>
            {dataIsDateRange1 ?
              loader :
              (eventsTodayTomorrow?.slice(0, 4).map((card) => (
                <Card
                  type='mini'
                  category={card.category}
                  main_category_id={card.main_category_id}
                  price={card.price}
                  title={card.title}
                  from_date={card.from_date}
                  address={card.address}
                  key={card.event_id}
                  id={card.id}
                  data={card}
                  image={card.image} />
              )))
            }
          </div>
        </div>
      </section>

      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex flex-wrap justify-between items-baseline mb-6 mt-12'>
          <h1 className='font-roboto font-bold mb-3 mr-5 mt-0'>Куда сходить в выходные</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center items-center flex-wrap'>
          <div className='relative grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto mt-5'>
            {dataIsDateRange2 ?
              loader :
              (weekendEvents?.slice(0, 4).map((card) => (
                <Card
                  type='mini'
                  category={card.category}
                  main_category_id={card.main_category_id}
                  price={card.price}
                  title={card.title}
                  from_date={card.from_date}
                  address={card.address}
                  key={card.event_id}
                  id={card.id}
                  data={card}
                  image={card.image} />
              )))
            }
          </div>
        </div>


        {isLoadingGame && (
          <div className='fade-in'>
            загрузка...
            <Loader />
          </div>
        )}

        {showGame &&
          <div className='fade-in z-30 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transform transition-all duration-300'
          >
            <div className='bg-white border border-gray-300 rounded-xl shadow-md p-4 max-w-xl w-auto relative max-h-[80%] mx-2 md:mx-0'>
              {randomEv ?
                <Image className='mx-auto object-cover object-center rounded-lg h-[40vh] w-full shadow-xl'
                  src={randomEv.image === "" ? "/img/cat.png" : randomEv.image}
                  width={1000}
                  height={1000}

                  alt="avatar" />
                : ''}

              <div className='flex justify-center items-center'>
                {randomEv ? <p className='my-2 mx-auto font-roboto font-medium text-[1.5rem]'>{randomEv.title}</p> : ''}
              </div>

              <Link href={`/events/${randomEv.id}`}>

                <button
                  className='font-roboto font-medium my-1 mx-auto w-full py-4 text-[1rem] bg-pink-500 text-[#fff] rounded-lg transform transition-transform duration-300 hover:bg-pink-400'
                >
                  Смотреть
                </button>

              </Link>
              <div
                onClick={toggleShowGame}
                className='absolute top-5 right-5 md:-top-8 md:-right-8'
              >
                <IoMdClose className='text-[2rem] p-2 md:p-0 text-[#333] bg-white rounded-full border-[2px] border-[#333] md:border-none md:bg-transparent md:text-[#fff] cursor-pointer' />
              </div>
            </div>
          </div>
        }
      </section>
    </>   
  );
}
