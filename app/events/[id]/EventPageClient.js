'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';
import useSWR, { SWRConfig } from 'swr';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoShareSocialSharp } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { BsCheckAll } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa6';
import { BsCopy } from 'react-icons/bs';
import { useEvents } from '../../../context/SwrContext';
import { API_HEADERS, API_URL_BY_ID } from '../../../config';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

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
          'full_text',
          'place_id',
          'main_category_id',
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

export default function EventPageClient({ id, initialEvent }) {
  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);
  const { cache, findDataById, convertImageUrlToJpeg } = useEvents();
  const [event, setEvent] = useState(null);

  const imageUrl = event?.image || '/img/cat.png';
  const processedImageUrl = convertImageUrlToJpeg(imageUrl);

  const togglePhoto = () => setShowPhoto(!showPhoto);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setCopied(true));
  };

  const idNumber = parseInt(id.id);

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
      fallbackData: [initialEvent],
    },
  );

  const cachedEvent = findDataById(idNumber);

  useEffect(() => {
    if (dataEvent) {
      setEvent(dataEvent);
    } else if (!dataIsLoading && !dataError && cache?.size > 0 && cachedEvent) {
      if (Array.isArray(cachedEvent)) {
        setEvent(cachedEvent[0]);
      } else {
        setEvent(cachedEvent);
      }
    }
  }, [dataEvent, dataIsLoading, dataError, cache, idNumber, cachedEvent]);

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

              <div className="flex">
                <button
                  onClick={handleCopy}
                  className={copied ? styleCopied : styleNoCopied}
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
                    className="ml-3 mt-3 flex cursor-pointer items-center rounded-xl border bg-[#F52D85] px-4 py-2 text-white transition-colors duration-300 hover:opacity-80"
                  >
                    {event.price === 'Бесплатно' || event.price === 'во встрече'
                      ? 'На сайт мероприятия'
                      : 'Купить билеты'}
                    <FaArrowRight size={18} className="ml-3" />
                  </Link>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <p className="mt-10 font-roboto font-bold text-[#777]">
            {event?.full_text ? 'Описание:' : ''}
          </p>
          <ReactMarkdown
            className="prose prose-sm md:prose-lg lg:prose-xl mt-4 leading-relaxed text-gray-800"
            remarkPlugins={[remarkGfm]}
          >
            {event?.full_text}
          </ReactMarkdown>
        </div>
      </div>
      {/* </Suspense> */}
    </>
  );
}
