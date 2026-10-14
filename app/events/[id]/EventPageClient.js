'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';
import useSWR from 'swr';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoMdClose } from 'react-icons/io';
import { BsCheckAll } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa6';
import { BsCopy } from 'react-icons/bs';
import Card from '../../../components/Card';
import { useEvents } from '../../../context/SwrContext';
import {
  API_HEADERS,
  API_URL_BY_ID,
  API_EVENTS_SIMILAR_URL,
  API_TASKS_STATUS_URL,
} from '../../../config';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  selectWishlistLoading,
  selectWishlistInitialized,
} from '../../../store/slices/wishlistSlice.js';
import { useCity } from '../../../context/CityContext';
import { getCity, getItemCity } from '../../../utils/cities';
import { normalizeEventsList } from '../../../utils/normalizeEvents';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

const SIMILAR_EVENTS_LIMIT = 4;

const fetchIdEvent = async (id) => {
  try {
    const res = await fetch(`${API_URL_BY_ID}${id}`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        fields: [
          'event_id',
          'id',
          'title',
          'image',
          'url',
          'price',
          'address',
          'from_date',
          'prepared_text',
          'place_id',
          'main_category_id',
          'city_id',
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка поиска id ${res.statusText}`);
    }

    const result = await res.json();

    if (result && Array.isArray(result)) {
      return result[0];
    } else if (result.result && Array.isArray(result.result)) {
      return result.result[0];
    } else if (result.result.events && Array.isArray(result.result.events)) {
      return result.result.events[0];
    } else {
      console.error('Неизвестная структура данных:', result);
    }
  } catch (error) {
    console.log('Ошибка при запросе:', error);
    return null;
  }
};

const normalizeTaskStatus = (payload) => {
  return String(
    payload?.status || payload?.state || payload?.task_status || '',
  ).toLowerCase();
};

const fetchSimilarEvents = async (eventId) => {
  const res = await fetch(
    `${API_EVENTS_SIMILAR_URL}${eventId}/similar?limit=${SIMILAR_EVENTS_LIMIT}`,
    {
    method: 'GET',
    headers: API_HEADERS,
    },
  );

  const result = await res.json();

  if (res.status === 202 || result?.status === 'pending') {
    return {
      status: 'pending',
      events: normalizeEventsList(result),
      taskId: result?.task_id || result?.taskId || null,
      message:
        result?.message || 'Подбираем похожие мероприятия, попробуйте чуть позже.',
    };
  }

  if (!res.ok) {
    throw new Error(`Ошибка загрузки похожих мероприятий: ${res.statusText}`);
  }

  return {
    status: 'success',
    events: normalizeEventsList(result),
    taskId: result?.task_id || result?.taskId || null,
    message: result?.message || '',
  };
};

const fetchTaskStatus = async (taskId) => {
  const res = await fetch(`${API_TASKS_STATUS_URL}${taskId}`, {
    method: 'GET',
    headers: API_HEADERS,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Ошибка проверки задачи: ${res.statusText}`);
  }

  return result;
};

export default function EventPageClient({ id, initialEvent }) {
  const dispatch = useDispatch();
  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);
  const { findDataById, convertImageUrlToJpeg } = useEvents();
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [similarStatus, setSimilarStatus] = useState('idle');
  const [similarMessage, setSimilarMessage] = useState('');
  const [similarTaskId, setSimilarTaskId] = useState(null);

  const idNumber = parseInt(id.id, 10);
  const router = useRouter();
  const { city, setCity } = useCity();

  // Redux selectors
  const isInWishlist = useSelector(selectIsInWishlist(idNumber));
  const wishlistLoading = useSelector(selectWishlistLoading);
  const wishlistInitialized = useSelector(selectWishlistInitialized);

  // Загружаем wishlist при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !wishlistInitialized) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, wishlistInitialized]);

  const imageUrl = event?.image || '/img/cat.png';
  const processedImageUrl = convertImageUrlToJpeg(imageUrl);

  const handleAddToWishList = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(idNumber));
    } else {
      dispatch(addToWishlist(idNumber));
    }
  };

  // Событие открыто по ссылке из другого города: карточку показываем,
  // а к списку ведём в город события
  const eventCity = getItemCity(event);
  const isOtherCity = Boolean(eventCity) && eventCity !== city;

  const openEventCityList = () => {
    setCity(eventCity, { refresh: false });
    router.push('/events');
  };

  const togglePhoto = () => setShowPhoto(!showPhoto);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setCopied(true));
  };

  const styleCopied =
    'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-green-500 text-green-500 transform transition-colors duration-300';
  const styleNoCopied =
    'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-[#F52D85] text-[#F52D85] transform transition-colors duration-300';

  const {
    data: dataEvent,
    error: dataError,
    isLoading: dataIsLoading,
  } = useSWR(
    idNumber ? `/api/data?id=${idNumber}` : null,
    () => fetchIdEvent(idNumber),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData: initialEvent,
    },
  );

  // Мемоизируем cachedEvent
  const cachedEvent = useMemo(() => {
    return findDataById(idNumber);
  }, [idNumber, findDataById]);

  useEffect(() => {
    if (dataEvent) {
      setEvent(dataEvent);
    } else if (!dataIsLoading && !dataError && cachedEvent) {
      const newEvent = Array.isArray(cachedEvent) ? cachedEvent[0] : cachedEvent;
      if (newEvent) {
        setEvent(newEvent);
      }
    }
  }, [dataEvent, dataIsLoading, dataError, cachedEvent]);

  useEffect(() => {
    if (!idNumber) return;

    let cancelled = false;
    let timeoutId = null;
    let attempts = 0;
    const maxAttempts = 20;

    const loadSimilar = async () => {
      setSimilarStatus('loading');
      setSimilarMessage('');
      setSimilarTaskId(null);
      setSimilarEvents([]);

      try {
        const response = await fetchSimilarEvents(idNumber);
        if (cancelled) return;

        if (response.status === 'pending' && response.taskId) {
          setSimilarStatus('pending');
          setSimilarTaskId(response.taskId);
          setSimilarMessage(response.message);

          const pollTask = async () => {
            if (cancelled) return;
            attempts += 1;

            try {
              const taskStatus = await fetchTaskStatus(response.taskId);
              if (cancelled) return;

              const normalizedStatus = normalizeTaskStatus(taskStatus);
              const isPending =
                normalizedStatus === 'pending' ||
                normalizedStatus === 'queued' ||
                normalizedStatus === 'processing' ||
                normalizedStatus === 'started';

              if (isPending && attempts < maxAttempts) {
                timeoutId = setTimeout(pollTask, 3000);
                return;
              }

          const finalResponse = await fetchSimilarEvents(idNumber);
              if (cancelled) return;

              if (finalResponse.status === 'pending' && attempts < maxAttempts) {
                timeoutId = setTimeout(pollTask, 3000);
                return;
              }

              setSimilarEvents(finalResponse.events || []);
              setSimilarStatus('success');
              setSimilarTaskId(null);
              setSimilarMessage(finalResponse.message || '');
            } catch (error) {
              if (cancelled) return;

              if (attempts < maxAttempts) {
                timeoutId = setTimeout(pollTask, 3000);
                return;
              }

              setSimilarStatus('error');
              setSimilarMessage('Не удалось загрузить похожие мероприятия.');
              console.error('Ошибка загрузки похожих мероприятий:', error);
            }
          };

          timeoutId = setTimeout(pollTask, 3000);
          return;
        }

        setSimilarEvents(response.events || []);
        setSimilarStatus('success');
        setSimilarMessage(response.message || '');
      } catch (error) {
        if (cancelled) return;

        setSimilarStatus('error');
        setSimilarMessage('Не удалось загрузить похожие мероприятия.');
        console.error('Ошибка загрузки похожих мероприятий:', error);
      }
    };

    loadSimilar();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [idNumber]);

  const formatDateRange = (from_date, to_date) => {
    if (!from_date) return 'Скоро будет дата';

    const from = dayjs(from_date).utc().tz('Europe/Moscow');
    const to = to_date ? dayjs(to_date).utc().tz('Europe/Moscow') : null;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const fromWeekday = capitalize(from.format('dd'));
    const toWeekday = to ? capitalize(to.format('dd')) : '';

    if (!to || from.isSame(to)) {
      return from.format('D MMMM');
    }

    if (from.isSame(to, 'day')) {
      return `${fromWeekday}, ${from.format('D MMMM')}`;
    }

    if (to.hour() === 0 && to.minute() === 0) {
      return `${fromWeekday}, ${from.format('D MMMM')} - 00:00`;
    }

    return `${fromWeekday}, ${from.format('D MMMM')} - ${toWeekday}, ${to.format('D MMMM')}`;
  };

  const formatDateClock = (from_date, to_date) => {
    const from = dayjs(from_date).utc().tz('Europe/Moscow');
    const to = to_date ? dayjs(to_date).utc().tz('Europe/Moscow') : null;

    if (!to || from.isSame(to)) {
      return from.format('HH:mm');
    }

    if (from.isSame(to, 'day')) {
      return `${from.format('HH:mm')} - ${to.format('HH:mm')}`;
    }

    if (to.hour() === 0 && to.minute() === 0) {
      return `${from.format('HH:mm')} - 00:00`;
    }

    return `${from.format('HH:mm')} - ${to.format('HH:mm')}`;
  };

  if (dataIsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-violet-500 border-t-transparent"></div>
          <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-300 border-r-transparent"></div>
          <div className="absolute h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-200 border-l-transparent"></div>
        </div>
      </div>
    );
  }

  if (dataError) {
    console.log('SWR dataError', dataError);
  }

  return (
    <>
      <div className="relative mx-auto max-w-custom-container">
        <div className="mx-auto flex min-h-screen w-full flex-col px-6 py-5 md:py-10 lg:inset-x-0">
          <div className="rounded-xl bg-[#fff] p-10 lg:flex lg:items-center">
            {showPhoto && (
              <div
                className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
                onClick={togglePhoto}
              >
                <div className="relative">
                  <Image
                    src={processedImageUrl}
                    width={1000}
                    height={1000}
                    className="w-auto rounded-lg object-cover object-center shadow-xl md:h-[60vh]"
                    alt="avatar"
                    priority
                  />
                  <button
                    onClick={togglePhoto}
                    className="absolute -right-8 -top-8"
                  >
                    <IoMdClose className="text-[2rem] text-[#fff]" />
                  </button>
                </div>
              </div>
            )}

            <div className="h-60 overflow-hidden rounded-lg shadow-xl md:h-96 lg:h-full lg:w-full lg:max-w-[40%]">
              <Image
                src={processedImageUrl}
                width={500}
                height={500}
                alt="avatar"
                className="h-60 w-full transform cursor-pointer rounded-lg object-cover object-center transition-all duration-300 hover:scale-105 md:h-96"
                onClick={togglePhoto}
              />
            </div>

            <div className="mt-8 lg:mt-0 lg:px-10">
              <h1 className="mx-1 mb-5 mt-0 font-roboto text-2xl font-bold text-[#333] lg:mt-0 lg:text-3xl">
                {event?.title}
              </h1>
              <div className="w-full rounded-2xl bg-[#f4f4f9] p-5 lg:min-w-[300px]">
                <div className="mb-3 flex">
                  <p className="text-[#777]">Цена: </p>
                  <p className="ml-[34px] font-roboto text-[#333]">
                    {event?.price}
                  </p>
                </div>
                <div className="my-3 flex items-baseline">
                  <p className="text-[#777]">Дата: </p>
                  <p className="ml-[38px] font-roboto text-[#333]">
                    {formatDateRange(event?.from_date, event?.to_date)}
                  </p>
                </div>
                <div className="my-3 flex items-baseline">
                  <p className="text-[#777]">Время:</p>
                  <p className="ml-[26px] font-roboto text-[#333]">
                    {formatDateClock(event?.from_date, event?.to_date)}
                  </p>
                </div>

                <div className="my-3 flex items-baseline">
                  <p className="text-[#777]">Место: </p>
                  {event?.place_id ? (
                    <Link href={`/places/${event.place_id}`}>
                      <p className="ml-[26px] cursor-pointer font-roboto text-[#333] hover:text-[#F52D85]">
                        {event.address}
                      </p>
                    </Link>
                  ) : (
                    <p className="ml-[25px] font-roboto text-[#333]">
                      {event?.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap">
                <button
                  onClick={handleCopy}
                  className={`${copied ? styleCopied : styleNoCopied} mr-3`}
                >
                  {copied ? (
                    <BsCheckAll size={18} className="mr-0 md:mr-2" />
                  ) : (
                    <BsCopy size={18} className="mr-0 md:mr-2" />
                  )}
                  {copied ? (
                    <p className="hidden md:block">Ссылка скопирована</p>
                  ) : (
                    <p className="hidden md:block">Скопировать ссылку</p>
                  )}
                </button>
                {event?.url ? (
                  <Link
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-3 mt-3 flex cursor-pointer items-center rounded-xl border bg-[#F52D85] px-4 py-2 text-white transition-colors duration-300 hover:opacity-80"
                  >
                    {event.price === 'Бесплатно' || event.price === 'во встрече'
                      ? 'На сайт мероприятия'
                      : 'Купить билеты'}
                    <FaArrowRight size={18} className="ml-3" />
                  </Link>
                ) : (
                  ''
                )}
                <button
                  onClick={handleAddToWishList}
                  disabled={wishlistLoading}
                  className="mt-3 flex transform cursor-pointer items-center rounded-xl border border-pink-500 bg-white px-4 py-2 text-pink-500 transition-colors duration-300 disabled:opacity-50"
                >
                  {isInWishlist ? (
                    <>
                      <MdFavorite size={17} className="mr-2" />
                      <span>Добавлено в избранное</span>
                    </>
                  ) : (
                    <>
                      <MdFavoriteBorder size={17} className="mr-2" />
                      <span>Добавить в избранное</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {isOtherCity && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff] px-6 py-4">
              <p className="font-roboto text-[#333]">
                Это мероприятие в {getCity(eventCity).nameIn}
              </p>
              <button
                onClick={openEventCityList}
                className="flex items-center rounded-xl border border-[#F52D85] bg-white px-4 py-2 text-[#F52D85] transition-colors duration-300 hover:bg-[#F52D85] hover:text-white"
              >
                Все мероприятия {getCity(eventCity).nameOf}
                <FaArrowRight size={18} className="ml-3" />
              </button>
            </div>
          )}

          <p className="mt-10 font-roboto font-bold text-[#777]">
            {event?.prepared_text ? 'Описание:' : ''}
          </p>
          <ReactMarkdown
            className="prose prose-sm md:prose-lg lg:prose-xl mt-4 leading-relaxed text-gray-800"
            remarkPlugins={[remarkGfm]}
          >
            {event?.prepared_text}
          </ReactMarkdown>

          <section className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#333]">
                Похожие мероприятия
              </h2>
              {similarStatus === 'pending' && similarTaskId ? (
                <p className="text-sm text-gray-500">{similarMessage}</p>
              ) : null}
            </div>

            {similarStatus === 'loading' ? (
              <div className="flex justify-center py-10">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-300 border-r-transparent"></div>
              </div>
            ) : null}

            {similarStatus === 'error' ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {similarMessage}
              </p>
            ) : null}

            {similarStatus === 'success' && similarEvents.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Похожих мероприятий пока нет.
              </p>
            ) : null}

            {similarEvents.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {similarEvents.map((similarEvent) => (
                  <Card
                    key={similarEvent.event_id || similarEvent.id}
                    type="mini"
                    to_date={similarEvent.to_date}
                    category={similarEvent.category}
                    main_category_id={similarEvent.main_category_id}
                    price={similarEvent.price}
                    title={similarEvent.title}
                    from_date={similarEvent.from_date}
                    address={similarEvent.address}
                    id={similarEvent.id}
                    data={similarEvent}
                    image={similarEvent.image}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}
