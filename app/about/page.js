'use client'

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

export default function About() {

  const { cache, findDataById } = useEvents();
  const [filterEventsMonth, setFilterEventsMonth] = useState([]);

  const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
  const today = dayjs().utc().tz('Europe/Moscow').startOf('day').format('YYYY-MM-DD');
  const month = todayforcount.add(1, 'month').startOf('day').format('YYYY-MM-DD');

  const dateRangemonth = { date_from: today, date_to: month, limit: 10 };

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
          return;
        }

        console.log('eventsfromFetcher', eventsfromFetcher)

        return eventsfromFetcher;

    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const {
    data: dataEventDateRangeMonth,
    error: dataErrorDateRangeMonth,
    isLoading: dataIsDateRangeMonth
  } = useSWR(
    dateRangemonth ? `/api/data?dateRange=${dateRangemonth.date_from, dateRangemonth.date_to}` : null,
    () => fetcher(dateRangemonth)
  );

  console.log('dataEventDateRangeMonth', dataEventDateRangeMonth)


  const cacheData = cache?.get(`/api/data?dateRange=${dateRangemonth.date_from, dateRangemonth.date_to}`)?.data;

  console.log('cacheData', cacheData);


  useEffect(() => {

    if (cacheData && Array.isArray(cacheData)) {
      const randomEvents = getRandomEvents(cacheData, 4);
      setFilterEventsMonth(randomEvents);
      console.log('берем данные из кэша', randomEvents);
    } else if (dataEventDateRangeMonth) {
      const randomEvents = getRandomEvents(dataEventDateRangeMonth, 4);

      setFilterEventsMonth(randomEvents);
      console.log('берем данные с сервера', filterEventsMonth);
    }

  }, [dataEventDateRangeMonth, cacheData])

  console.log('filterEventsMonth', filterEventsMonth)
  const getRandomEvents = (array, count) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);

  };
  const loader = (
    <div className=" absolute flex items-center justify-cente mx-auto">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 border-4 border-pink-300 border-solid border-r-transparent rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-4 border-indigo-200 border-solid border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-custom-container mx-auto bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto  px-6">


        <div className="mb-16">
          <div className='p-8 lg:flex items-center justify-between'>

            <div className='lg:max-w-[50%]'>
              <h1 className="text-4xl font-bold text-gray-700 text-start mb-12 mt-0">
                О нашем проекте
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Мы предоставляем актуальную информацию о самых интересных мероприятиях Санкт-Петербурга: выставки, концерты, мастер-классы, лекции и многое другое. Наш сайт — это ваш гид по лучшим событиям города!
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Мы обновляем информацию ежедневно, чтобы вы не пропустили самые яркие события города. Присоединяйтесь и будьте в центре событий!
              </p>
            </div>
            <div className='lg:w-full lg:h-full lg:max-w-[50%]'>
              <Image
                src={'/img/hobbies.png'}
                width={1000}
                height={1000}
                className="object-contain object-center w-full mx-auto hidden lg:block"
                style={{ height: '55vh', width: 'auto' }}
                alt="avatar"
              />
              <Image
                src={'/img/hobbies_sm.png'}
                width={1000}
                height={1000}
                className="object-contain object-center w-full mx-auto lg:hidden mt-16"
                style={{ height: 'auto', width: 'full' }}
                alt="avatar"
              />
            </div>
          </div>
        </div>

        {/* Секция с типами мероприятий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {/* Культурные мероприятия */}
          <div className="bg-teal-50 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Культурные мероприятия</h3>
            <p className="text-gray-700 mb-6">
              Художественные выставки, театральные постановки и культурные события, которые позволяют погрузиться в атмосферу искусства.
            </p>
            <Link href={`/events?category=${encodeURIComponent("Культура")}`} className="text-pink-500 font-semibold">Узнать больше →</Link>
          </div>

          {/* Образовательные мероприятия */}
          <div className="bg-teal-50 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Образовательные мероприятия</h3>
            <p className="text-gray-700 mb-6">
              Лекции, мастер-классы, тренинги и семинары. Мы собираем для вас все образовательные мероприятия города.
            </p>
            <Link href={`/events?category=${encodeURIComponent("Лекции")}`} className="text-pink-500 font-semibold">Узнать больше →</Link>
          </div>

          {/* Музыкальные мероприятия */}
          <div className="bg-teal-50 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Музыкальные мероприятия</h3>
            <p className="text-gray-700 mb-6">
              Концерты, фестивали, уличные выступления и музыкальные вечеринки. Вся музыка города в одном месте.
            </p>
            <Link href={`/events?category=${encodeURIComponent("Музыка")}`} className="text-pink-500 font-semibold">Узнать больше →</Link>
          </div>
        </div>

        {/* Секция с мероприятиями по датам */}
        <div className="p-8 mb-16">
          <div className='flex justify-between items-baseline'>
            <h1 className="font-bold mt-0 mb-6">
              Мероприятия этого месяца
            </h1>
            <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
              <p className="text-[#777]">Смотреть весь список</p>
            </Link>
          </div>


          <div className='flex justify-center flex-wrap'>
            <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto mt-5'>
              {dataIsDateRangeMonth ?
                loader :
                (filterEventsMonth?.slice(0.4).map((card) => (
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
                )))}
            </div>
          </div>

        </div>
      </div>

      {/* Контакты */}
      <div className="group relative bg-white rounded-lg shadow-lg p-8 mx-8 overflow-hidden ">

        <div className={`absolute top-[110%] left-0 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] group-hover:bg-sky-400 rounded-full group-hover:h-[2500px] group-hover:w-[2500px] transform transition-all duration-500`}></div>

        {/* <div className="w-full absolute left-0 top-5 h-full bg-cover bg-no-repeat lg:bg-[url('/img/telegram.png')]">
        </div> */}
        <div className='absolute bottom-0 left-0 w-[50%]'>
          <Image
            src={'/img/telegram_sky-400.png'}
            width={1000}
            height={1000}
            className="object-cover object-center max-h-[13vh] w-auto group-hover:hidden transform transition-all duration-300"
            // style={{ height: '20vh', width: 'auto' }}
            alt="avatar"
          />
          <Image
            src={'/img/telegram_sky-300.png'}
            width={1000}
            height={1000}
            className="object-cover object-center max-h-[13vh] w-auto group-hover:block hidden transform transition-all duration-300"
            // style={{ height: '20vh', width: 'auto' }}
            alt="avatar"
          />
        </div>
        <h2 className="text-3xl font-roboto font-bold text-gray-800 mb-6 text-center group-hover:text-white transform transition-all">
          Подпишись на наш телеграм-канал
        </h2>
        <p className="text-lg font-roboto text-gray-700 leading-relaxed mb-6 text-center group-hover:text-white transform transition-all">
          Получай актуальную информацию о событиях и мероприятиях прямо на свой телефон!
        </p>

        <div className="flex justify-center gap-8">
          <Link href="https://t.me/DavaiSNami" target="_blank" className="font-roboto py-2 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 bg-pink-500 text-white group-hover:bg-white group-hover:text-sky-500">
            Подписаться
          </Link>
        </div>

      </div>

    </div>
  )
}
