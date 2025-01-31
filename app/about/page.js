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

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export default function About() {

  const { cache, findDataById } = useEvents();

  const today = dayjs().utc().tz('Europe/Moscow').startOf('day').format('YYYY-MM-DD');
  const month = dayjs().utc().tz('Europe/Moscow').startOf('day').format('YYYY-MM-DD');


  const fetcher = async () => {
    try {

      const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zevgEv-vimned-ditva8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_from: today,
          date_to: month,
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
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.statusText}`);
      }

      const result = await res.json();
      console.log('Task created с диапазоном дат: ', result);

      let eventsfromFetcher = [];

      if (result.task_id) {
        const taskId = result.task_id;
        const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

        setTimeout(async () => {
          try {
            const statusResponse = await fetch(statusUrl, {
              method: 'GET',
              headers: {
                'Authorization': 'Bearer zevgEv-vimned-ditva8',
                'Content-Type': 'application/json',
              },
            });

            if (!statusResponse.ok) {
              throw new Error(`Ошибка: ${statusResponse.statusText}`);
            }

            const statusResult = await statusResponse.json();
            console.log('Status result: ', statusResult);

            if (Array.isArray(statusResult)) {
              eventsfromFetcher = statusResult;
            } else if (statusResult.events && Array.iaArray(statusResult.events)) {
              eventsfromFetcher = statusResult.events;
            } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
              eventsfromFetcher = statusResult.result.events;
            } else {
              console.error('Неизвестная структура данных:', statusResult);
              setStatus('Не удалось обработать данные');
              return;
            }

            console.log('eventsfromFetcher', eventsfromFetcher)

            return eventsfromFetcher;

          } catch (error) {
            console.log('Ошибка при запросе', error);
          }
        }, 5000);
      } else {
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
      }

    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const {
    data: dataEventForMonth,
    error: dataErrorForMonth,
    isLoading: dataIsForMonth
  } = useSWR(
    `/api/data?dateRange=${today}`, fetcher
  );

  console.log('dataEventForMonth', dataEventForMonth)

  const [filterEventsMonth, setFilterEventsMonth] = useState(null);

  useEffect(() => {
    if (dataEventForMonth) {
      const randomEvents = getRandomEvents(dataEventForMonth, 4);
      setFilterEventsMonth(randomEvents);
      console.log('filterEventsMonth', filterEventsMonth);
    }
  }, [dataEventForMonth])

  const getRandomEvents = (array, count) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled.slice(0, count);
  };

  return (
    <div className="max-w-custom-container mx-auto bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto  px-6">

        {/* Заголовок
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-12 mt-0">
          О нас
        </h1> */}

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
            <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto'>
              {!dataIsForMonth ? (filterEventsMonth?.map((card) => (
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
              ))) : <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
                Нет доступных событий.
              </p>}
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
