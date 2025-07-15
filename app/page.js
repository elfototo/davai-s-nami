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
import { IoMdClose } from 'react-icons/io';
import Loader from './components/Loader';
import { useSWRConfig } from 'swr';
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../context/SwrContext';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../config';
import { useRouter } from 'next/navigation';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function Home() {
  const router = useRouter();
  const [showGame, setShowGame] = useState(false);
  const [randomEv, setRandomEv] = useState(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [weekendEvents, setWeekendEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [eventsTodayTomorrow, setEventsTodayTomorrow] = useState([]);
  const [eventsForGame, setEventsForGame] = useState([]);
  const { cache, findDataById } = useEvents();
  const [loadingTime, setLoadingTime] = useState(0);

  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
  const today = todayforcount.format('YYYY-MM-DD');
  const tomorrow = todayforcount
    .add(1, 'day')
    .startOf('day')
    .format('YYYY-MM-DD');
  const month = todayforcount
    .add(1, 'month')
    .startOf('day')
    .format('YYYY-MM-DD');

  const startOfWeekendforCount = dayjs()
    .isoWeekday(6)
    .utc()
    .tz('Europe/Moscow')
    .startOf('day');
  const startOfWeekend = startOfWeekendforCount.format('YYYY-MM-DD');
  const endOfWeekend = startOfWeekendforCount
    .add(1, 'day')
    .format('YYYY-MM-DD');

  const dateRange1 = { date_from: today, date_to: tomorrow, limit: 10 };
  const dateRangemonth = { date_from: today, date_to: month, limit: 10 };
  const dateRange2 = {
    date_from: startOfWeekend,
    date_to: endOfWeekend,
    limit: 10,
  };
  const dateRangeForGame = { date_from: today, date_to: month, limit: 20 };
  useEffect(() => {
    setTimeout(() => {
      alert(window.location.pathname);

      const tg = window.Telegram?.WebApp;
      alert(tg);

      if (!tg) {
        alert('❌ Telegram WebApp не инициализирован');
        return;
      }

      tg.showPopup({
        title: 'Debug',
        message:
          '✅ Telegram WebApp запущен\ninitDataUnsafe: ' +
          JSON.stringify(tg.initDataUnsafe),
      });

      const param = tg.initDataUnsafe?.start_param;

      if (param) {
        tg.showPopup({
          title: 'Param',
          message: 'start_param: ' + param,
        });

        if (param.startsWith('event_')) {
          const id = param.replace('event_', '');
          router.replace(`/events/${id}`);
        }
      } else {
        tg.showPopup({
          title: 'Info',
          message: 'Нет start_param',
        });
      }
    }, 3000);
  }, []);

  // useEffect(() => {
  //   alert(window.location.pathname);
  //   const tg = window.Telegram?.WebApp;
  //   alert(tg);
  //   if (!tg) {
  //     alert('❌ Telegram WebApp не инициализирован');
  //     return;
  //   }
  //   tg.showPopup({
  //     title: 'Debug',
  //     message:
  //       '✅ Telegram WebApp запущен\ninitDataUnsafe: ' +
  //       JSON.stringify(tg.initDataUnsafe),
  //   });

  //   const param = tg.initDataUnsafe?.start_param;

  //   if (param) {
  //     tg.showPopup({
  //       title: 'Param',
  //       message: 'start_param: ' + param,
  //     });

  //     if (param.startsWith('event_')) {
  //       const id = param.replace('event_', '');
  //       router.replace(`/events/${id}`);
  //     }
  //   } else {
  //     tg.showPopup({
  //       title: 'Info',
  //       message: 'Нет start_param',
  //     });
  //   }

  //   // if (
  //   //   typeof window !== 'undefined' &&
  //   //   window.Telegram?.WebApp?.initDataUnsafe
  //   // ) {
  //   //   const param = window.Telegram.WebApp.initDataUnsafe.start_param;
  //   //   alert('param' + param);

  //   //   if (param?.startsWith('event_')) {
  //   //     const id = param.replace('event_', '');
  //   //     router.replace(`/events/${id}`);
  //   //     alert('id' + id);
  //   //   }
  //   // }
  // }, []);

  const fetcher = async (dateRange) => {
    try {
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

      let eventsfromFetcher = [];

      if (result.result && Array.isArray(result.result)) {
        eventsfromFetcher = result.result;
      } else if (result.result.events && Array.isArray(result.result.events)) {
        eventsfromFetcher = result.result.events;
      } else {
        setStatus('Не удалось обработать данные');
        return;
      }

      return eventsfromFetcher;
    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const toggleShowGame = () => {
    setShowGame(!showGame);
  };

  const getRandomEvent = () => {
    setIsLoadingGame(true);
    const today = dayjs().utc().tz('Europe/Moscow').startOf('day');
    const end = today.add(7, 'day').startOf('day');

    if (eventsForGame.length > 0) {
      const filterEvents = eventsForGame.filter((event) => {
        const eventDate = dayjs(event.from_date).utc().tz('Europe/Moscow');
        return eventDate.isAfter(today) && eventDate.isBefore(end);
      });

      if (filterEvents.length === 0) {
        setIsLoadingGame(false);
        return;
      }

      for (let i = filterEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filterEvents[i], filterEvents[j]] = [filterEvents[j], filterEvents[i]];
      }

      const randomEvent = filterEvents[0];

      const img = new window.Image();
      img.src = randomEvent.image === '' ? '/img/cat.png' : randomEvent.image;

      img.onload = () => {
        setTimeout(() => {
          setRandomEv(randomEvent);
          setIsLoadingGame(false);
          setShowGame(true);
        }, 6000);
      };

      img.onerror = () => {
        setTimeout(() => {
          setRandomEv(randomEvent);
          setIsLoadingGame(false);
          setShowGame(true);
        }, 8000);
      };
    }
  };

  const {
    data: dataEventDateRange1,
    error: dataErrorDateRange1,
    isLoading: dataIsDateRange1,
  } = useSWR(
    dateRange1
      ? `/api/data?dateRange=${(dateRange1.date_from, dateRange1.date_to)}`
      : null,
    () => fetcher(dateRange1),
  );

  const {
    data: dataEventDateRange2,
    error: dataErrorDateRange2,
    isLoading: dataIsDateRange2,
  } = useSWR(
    dateRange2
      ? `/api/data?dateRange=${(dateRange2.date_from, dateRange2.date_to)}`
      : null,
    () => fetcher(dateRange2),
  );

  const {
    data: dataEventDateRangeMonth,
    error: dataErrorDateRangeMonth,
    isLoading: dataIsDateRangeMonth,
  } = useSWR(
    dateRangemonth
      ? `/api/data?dateRange=${(dateRangemonth.date_from, dateRangemonth.date_to)}`
      : null,
    () => fetcher(dateRangemonth),
  );

  const cacheDataRange1 = cache?.get(
    `/api/data?dateRange=${(dateRange1.date_from, dateRange1.date_to)}`,
  )?.data;

  const cacheDataRange2 = cache?.get(
    `/api/data?dateRange=${(dateRange2.date_from, dateRange2.date_to)}`,
  )?.data;

  const cacheDataEventDateRangeMonth = cache?.get(
    `/api/data?dateRange=${(dateRangemonth.date_from, dateRangemonth.date_to)}`,
  )?.data;

  useEffect(() => {
    if (dataEventDateRangeMonth) {
      setEventsForGame(dataEventDateRangeMonth);
    }

    if (cacheDataRange1) {
      const randomEvents = getRandomEvents(cacheDataRange1, 4);

      setEventsTodayTomorrow(randomEvents);
    } else if (dataEventDateRange1) {
      const randomEvents = getRandomEvents(dataEventDateRange1, 4);
      setEventsTodayTomorrow(randomEvents);
    }

    if (cacheDataRange2) {
      const randomEvents = getRandomEvents(cacheDataRange2, 4);

      setWeekendEvents(randomEvents);
    } else if (dataEventDateRange2) {
      const randomEvents = getRandomEvents(dataEventDateRange2, 4);

      setWeekendEvents(randomEvents);
    }

    if (cacheDataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(cacheDataEventDateRangeMonth, 4);

      setMonthEvents(randomEvents);
    } else if (dataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(dataEventDateRangeMonth, 4);

      setMonthEvents(randomEvents);
    }
  }, [
    dataEventDateRange1,
    dataEventDateRange2,
    cacheDataRange1,
    cacheDataRange2,
    cacheDataEventDateRangeMonth,
  ]);

  const getRandomEvents = (array, count) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };

  const loader = (
    <div className="justify-cente absolute mx-auto flex items-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-300 border-r-transparent"></div>
        <div className="absolute h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-200 border-l-transparent"></div>
      </div>
    </div>
  );

  return (
    <>
      <section className="relative h-[26rem] overflow-hidden bg-accent-gradient">
        <div className="m-0 mx-auto flex h-[inherit] max-w-custom-container flex-col justify-center overflow-hidden px-4 smd:flex-row smd:pl-10 smd:pr-0 md:justify-between">
          <div className="ml-2 mt-16 flex flex-col items-start sm:ml-5 smd:ml-0 smd:max-w-[40%] md:mt-0 md:max-w-[50%] md:justify-center">
            <span className="mb-3 whitespace-nowrap font-roboto text-[2.6rem] font-bold text-secondary md:text-6xl">
              Играй с нами!
            </span>
            <p className="mb-6 text-start font-roboto font-light text-secondary">
              <span className="">Нажми на кнопку</span> чтобы найти{' '}
              <br className="smd:hidden md:block" /> случайное мероприятие{' '}
              <br className="hidden sm:block smd:hidden" />{' '}
              <br className="ssm:block sm:hidden" />
              на свой уикенд в <br className="smd:hidden" />{' '}
              <span className="whitespace-nowrap">Санкт - Петербурге</span>
            </p>

            {dataIsDateRangeMonth ? (
              <div
                className={`disabled flex transform items-center justify-center rounded-lg bg-white px-4 py-2 font-roboto text-[1rem] font-medium text-[#333] shadow-lg transition-transform duration-300 md:w-3/4 md:px-0 md:py-4`}
              >
                <span className="flex w-[100px] items-center justify-center">
                  <div className="loader-dots-sequence">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </span>
              </div>
            ) : (
              <button
                onClick={getRandomEvent}
                className={`flex transform items-center justify-center rounded-lg bg-white px-4 py-2 font-roboto text-[1rem] font-medium text-[#333] shadow-lg transition-transform duration-300 hover:scale-105 md:w-3/4 md:px-0 md:py-4`}
              >
                <span>Мне повезет</span>
              </button>
            )}
          </div>

          <div className="h-full smd:hidden">
            <Image
              src={'/img/1-sm-banner.png'}
              width={1000}
              height={1000}
              className="pointer-events-none absolute -bottom-5 -right-6 h-[35vh] w-full object-contain object-center ssm:-bottom-3 sm:h-[40vh] md:hidden"
              alt="avatar"
              priority
            />
          </div>

          {/* md-screen */}
          <div className="relative hidden h-full w-[60%] smd:block">
            <div className="absolute left-0 top-5 h-full w-full bg-cover bg-no-repeat smd:bg-[url('/img/sm-banner.png')] lg:bg-[url('/img/banner.png')]"></div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-custom-container px-4">
        <h1 className="font-roboto font-bold">Куда сходить</h1>
        <div className="font-roboto font-medium">
          <Categories />
        </div>
      </section>

      <section className="mx-auto max-w-custom-container px-4">
        <div className="mb-6 mt-12 flex flex-wrap items-baseline justify-between">
          <h1 className="mb-3 mr-5 mt-0 font-roboto font-bold">
            Горячие новинки месяца
          </h1>
          <Link
            href="/events"
            className="whitespace-nowrap text-[#777] underline"
          >
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          <div className="grid-rows-auto relative mt-5 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {dataIsDateRangeMonth
              ? loader
              : monthEvents
                  ?.slice(0, 4)
                  .map((card) => (
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
                  ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-custom-container px-4">
        <div className="mb-6 mt-12 flex flex-wrap items-baseline justify-between">
          <h1 className="mb-3 mr-5 mt-0 font-roboto font-bold">
            Куда сходить сегодня и завтра
          </h1>
          <Link
            href="/events"
            className="whitespace-nowrap text-[#777] underline"
          >
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          <div className="grid-rows-auto relative mt-5 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {dataIsDateRange1
              ? loader
              : eventsTodayTomorrow
                  ?.slice(0, 4)
                  .map((card) => (
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
                  ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-custom-container px-4">
        <div className="mb-6 mt-12 flex flex-wrap items-baseline justify-between">
          <h1 className="mb-3 mr-5 mt-0 font-roboto font-bold">
            Куда сходить в выходные
          </h1>
          <Link
            href="/events"
            className="whitespace-nowrap text-[#777] underline"
          >
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          <div className="grid-rows-auto relative mt-5 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {dataIsDateRange2
              ? loader
              : weekendEvents
                  ?.slice(0, 4)
                  .map((card) => (
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
                  ))}
          </div>
        </div>

        {isLoadingGame && (
          <div className="fade-in">
            загрузка...
            <Loader />
          </div>
        )}

        {/* {isLoadingGame && (
          <div>
            {loadingTime < 10 ? ( // 🔹 Если прошло <10 секунд, показываем Loader
              <div className="fade-in">
                <>
                  <Loader />
                </>
              </div>
            ) : ( // 🔹 После 10 секунд — показываем другой лоадер
              { loader }
            )}
          </div>
        )} */}

        {showGame && (
          <div className="fixed inset-0 z-30 flex transform items-center justify-center bg-black bg-opacity-50 transition-all duration-300 fade-in">
            <div className="relative mx-2 max-h-[80%] w-auto max-w-xl rounded-xl border border-gray-300 bg-white p-4 shadow-md md:mx-0">
              {randomEv ? (
                <Image
                  className="mx-auto h-[40vh] w-full rounded-lg object-cover object-center shadow-xl"
                  src={randomEv.image === '' ? '/img/cat.png' : randomEv.image}
                  width={1000}
                  height={1000}
                  alt="avatar"
                  priority
                />
              ) : (
                ''
              )}

              <div className="flex items-center justify-center">
                {randomEv ? (
                  <p className="mx-auto my-2 font-roboto text-[1.5rem] font-medium">
                    {randomEv.title}
                  </p>
                ) : (
                  ''
                )}
              </div>

              <Link href={`/events/${randomEv.id}`}>
                <button className="mx-auto my-1 w-full transform rounded-lg bg-pink-500 py-4 font-roboto text-[1rem] font-medium text-[#fff] transition-transform duration-300 hover:bg-pink-400">
                  Смотреть
                </button>
              </Link>
              <div
                onClick={toggleShowGame}
                className="absolute right-5 top-5 md:-right-8 md:-top-8"
              >
                <IoMdClose className="cursor-pointer rounded-full border-[2px] border-[#333] bg-white p-2 text-[2rem] text-[#333] md:border-none md:bg-transparent md:p-0 md:text-[#fff]" />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
