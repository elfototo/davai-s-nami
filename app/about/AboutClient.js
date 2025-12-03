'use client';

import Image from 'next/image';
import Card from '../components/Card';
import { useEvents } from '../../context/SwrContext';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function About({ initialEvents }) {
  const { cache, findDataById } = useEvents();
  const [filterEventsMonth, setFilterEventsMonth] = useState([]);

  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
  const today = dayjs()
    .utc()
    .tz('Europe/Moscow')
    .startOf('day')
    .format('YYYY-MM-DD');
  const month = todayforcount
    .add(1, 'month')
    .startOf('day')
    .format('YYYY-MM-DD');

  const dateRangemonth = { date_from: today, date_to: month, limit: 10 };

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
        return;
      }

      return eventsfromFetcher;
    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const {
    data: dataEventDateRangeMonth,
    error: dataErrorDateRangeMonth,
    isLoading: dataIsDateRangeMonth,
  } = useSWR(
    dateRangemonth
      ? `/api/data?dateRange=${(dateRangemonth.date_from, dateRangemonth.date_to)}`
      : null,
    () => fetcher(dateRangemonth),
    {
      fallbackData: initialEvents,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      revalidateIfStale: false,
    },
  );

  const cacheData = cache?.get(
    `/api/data?dateRange=${(dateRangemonth.date_from, dateRangemonth.date_to)}`,
  )?.data;

  useEffect(() => {
    if (cacheData && Array.isArray(cacheData)) {
      const randomEvents = getRandomEvents(cacheData, 4);
      setFilterEventsMonth(randomEvents);
    } else if (dataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(dataEventDateRangeMonth, 4);

      setFilterEventsMonth(randomEvents);
    }
  }, [dataEventDateRangeMonth, cacheData]);

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
    <div className="mx-auto min-h-screen max-w-custom-container bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="mb-16">
          <div className="items-center justify-between p-2 md:p-4 lg:flex">
            <div className="lg:max-w-[50%]">
              <h1 className="mb-10 mt-0 text-start text-4xl font-bold text-gray-700">
                О нашем проекте
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Мы предоставляем актуальную информацию о самых интересных
                мероприятиях Санкт-Петербурга: выставки, концерты,
                мастер-классы, лекции и многое другое. Наш сайт — это ваш гид по
                лучшим событиям города!
              </p>

              <p className="text-lg leading-relaxed text-gray-700">
                Мы обновляем информацию ежедневно, чтобы вы не пропустили самые
                яркие события города. Присоединяйтесь и будьте в центре событий!
              </p>
            </div>
            <div className="lg:h-full lg:w-full lg:max-w-[50%]">
              <Image
                src={'/img/hobbies.png'}
                width={1000}
                height={1000}
                className="mx-auto hidden w-full object-contain object-center lg:block"
                style={{ height: '55vh', width: 'auto' }}
                alt="avatar"
                priority
              />
              <Image
                src={'/img/hobbies_sm.png'}
                width={1000}
                height={1000}
                className="mx-auto mt-16 w-full object-contain object-center lg:hidden"
                style={{ height: 'auto', width: 'full' }}
                alt="avatar"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/* Секция с типами мероприятий */}
      <div className="mx-auto mb-20 grid max-w-custom-container grid-cols-1 gap-12 px-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Культурные мероприятия */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            Культурные мероприятия
          </h3>
          <p className="mb-6 text-gray-700">
            Художественные выставки, театральные постановки и культурные
            события, которые позволяют погрузиться в атмосферу искусства.
          </p>
          <Link
            href={`/events?category=${encodeURIComponent('Культура')}`}
            className="font-semibold text-pink-500"
          >
            Узнать больше →
          </Link>
        </div>

        {/* Образовательные мероприятия */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            Образовательные мероприятия
          </h3>
          <p className="mb-6 text-gray-700">
            Лекции, мастер-классы, тренинги и семинары. Мы собираем для вас все
            образовательные мероприятия города.
          </p>
          <Link
            href={`/events?category=${encodeURIComponent('Лекции')}`}
            className="font-semibold text-pink-500"
          >
            Узнать больше →
          </Link>
        </div>

        {/* Музыкальные мероприятия */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            Музыкальные мероприятия
          </h3>
          <p className="mb-6 text-gray-700">
            Концерты, фестивали, уличные выступления и музыкальные вечеринки.
            Вся музыка города в одном месте.
          </p>
          <Link
            href={`/events?category=${encodeURIComponent('Музыка')}`}
            className="font-semibold text-pink-500"
          >
            Узнать больше →
          </Link>
        </div>
      </div>

      {/* Секция с мероприятиями по датам */}
      <div className="mx-auto mb-16 max-w-custom-container px-4 py-4">
        <div className="mb-6 flex flex-wrap items-baseline justify-between">
          <h1 className="mr-5 mt-0 font-roboto font-bold">
            Мероприятия этого месяца
          </h1>
          <Link
            href="/events"
            className="whitespace-nowrap text-[#777] underline"
          >
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center">
          <div className="grid-rows-auto mt-5 grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {dataIsDateRangeMonth
              ? loader
              : filterEventsMonth
                  ?.slice(0.4)
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
      </div>

      {/* Контакты */}
      <div className="group relative mx-4 overflow-hidden rounded-lg bg-white p-8 shadow-lg">
        <div
          className={`absolute left-0 top-[110%] h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 transform rounded-full transition-all duration-500 group-hover:h-[2500px] group-hover:w-[2500px] group-hover:bg-sky-400`}
        ></div>

        <div className="absolute bottom-0 left-0 w-[50%]">
          <Image
            src={'/img/telegram_sky-400.png'}
            width={1000}
            height={1000}
            className="max-h-[13vh] w-auto transform object-cover object-center transition-all duration-300 group-hover:hidden"
            // style={{ height: '20vh', width: 'auto' }}
            alt="avatar"
          />
          <Image
            src={'/img/telegram_sky-300.png'}
            width={1000}
            height={1000}
            className="hidden max-h-[13vh] w-auto transform object-cover object-center transition-all duration-300 group-hover:block"
            // style={{ height: '20vh', width: 'auto' }}
            alt="avatar"
          />
        </div>
        <h2 className="mb-6 transform text-center font-roboto text-3xl font-bold text-gray-800 transition-all group-hover:text-white">
          Подпишись на наш телеграм-канал
        </h2>
        <p className="mb-6 transform text-center font-roboto text-lg leading-relaxed text-gray-700 transition-all group-hover:text-white">
          Получай актуальную информацию о событиях и мероприятиях прямо на свой
          телефон!
        </p>

        <div className="flex justify-center gap-8">
          <Link
            href="https://t.me/DavaiSNami"
            target="_blank"
            className="transform rounded-lg bg-pink-500 px-8 py-2 font-roboto text-lg text-white transition-transform hover:scale-105 group-hover:bg-white group-hover:text-sky-500"
          >
            Подписаться
          </Link>
        </div>
      </div>
    </div>
  );
}
