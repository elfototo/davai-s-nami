'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';
import { useSWRConfig } from 'swr';
import useSWR, { SWRConfig } from 'swr';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
import { BsCopy } from "react-icons/bs";
import { useEvents } from '../../../context/SwrContext';
import { debounce } from 'lodash';
import { Suspense } from 'react';
import Loading from './loading';


dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventPageClient({ id }) {

  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);
  const { cache, findDataById, convertImageUrlToJpeg } = useEvents();
  const [event, setEvent] = useState(null);

  const imageUrl = event?.image || '/img/cat.png';
  const processedImageUrl = convertImageUrlToJpeg(imageUrl);
  console.log('processedImageUrl', imageUrl, processedImageUrl);


  const togglePhoto = () => setShowPhoto(!showPhoto);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => setCopied(true));
  };

  console.log('id из пропсов', id.id);

  const styleCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-green-500 text-green-500 transform transition-colors duration-300';
  const styleNoCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-[#F52D85] text-[#F52D85] transform transition-colors duration-300';

  const fetchIdEvent = async (id) => {
    try {
      const res = await fetch(`http://159.223.239.75:8005/api/get_valid_event/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer zevgEv-vimned-ditva8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // ids: [id],
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

      console.log('result на странице id', result);

      if (result.task_id) {
        try {
          setTimeout(async () => {

            const taskId = result.task_id;
            const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

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

            if (statusResult && Array.isArray(statusResult)) {
              console.log('statusResult на странице id', statusResult.result);
              return statusResult;
            } else if (statusResult.result && Array.isArray(statusResult.result)) {
              console.log('statusResult.result на странице id', statusResult.result);
              return statusResult.result;
            } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
              console.log('result.result.events на странице id', statusResult.result.events);
              return statusResult.result.events[0];
            } else {
              console.error('Неизвестная структура данных:', statusResult);
            };
          });

        } catch (error) {
          console.log('Ошибка при запросе', error);
        }
      } else {
        if (result && Array.isArray(result)) {
          console.log('result на странице id', result.result);
          return result;
        } else if (result.result && Array.isArray(result.result)) {
          console.log('result.result на странице id', result.result);
          return result.result;
        } else if (result.result.events && Array.isArray(result.result.events)) {
          console.log('result.result.events на странице id', result.result.events);
          return result.result.events[0];
        } else {
          console.error('Неизвестная структура данных:', result);
        }
      }
    } catch (error) {
      console.log('Ошибка при запросе:', error);
      return null;
    }
  };

  const {
    data: dataEvent,
    error: dataError,
    isLoading: dataIsLoading
  } = useSWR(
    id ? `/api/data?id=${id.id}` : null,
    () => fetchIdEvent(id.id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }
  );

  console.log('findDataById id.id', findDataById(parseInt(id.id)));

  useEffect(() => {
    if (dataEvent) {
      console.log('Берем данные с сервера');
      setEvent(dataEvent);
    } else if (!dataIsLoading && !dataError && cache.size > 0) {

      const cachedEvent = findDataById(parseInt(id.id));
      console.log('cachedEvent', cachedEvent);
      if (cachedEvent) {
        console.log('Берем данные из кэша');
        setEvent(cachedEvent);
      }
    }

  }, [dataEvent, dataIsLoading, dataError, cache, id.id]);


  if (dataIsLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-violet-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute w-12 h-12 border-4 border-pink-300 border-solid border-r-transparent rounded-full animate-spin"></div>
                <div className="absolute w-8 h-8 border-4 border-indigo-200 border-solid border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
  };

  if (dataError) {
    console.log('SWR dataError', dataError);
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative max-w-custom-container mx-auto">
        <div className="flex flex-col justify-center w-full min-h-screen px-6 py-5 md:py-10 mx-auto lg:inset-x-0">
          <div className="lg:flex lg:items-center bg-[#fff] rounded-xl p-10">
            {showPhoto && (
              <div
                className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={togglePhoto}
              >
                <div className="relative">

                  <Image
                    src={processedImageUrl}
                    width={1000}
                    height={1000}
                    className="object-cover object-center rounded-lg shadow-xl"
                    style={{ height: '60vh', width: 'auto' }}
                    alt="avatar"
                  />
                  <button onClick={togglePhoto} className="absolute -top-8 -right-8">
                    <IoMdClose className="text-[2rem] text-[#fff]" />
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden shadow-xl rounded-lg lg:w-full h-96 lg:h-full lg:max-w-[40%]">
              <Image
                src={processedImageUrl}
                width={500}
                height={500}
                alt="avatar"
                className="object-cover object-center w-full rounded-lg h-96 cursor-pointer hover:scale-105 transform transition-all duration-300"
                onClick={togglePhoto}
              />
            </div>

            <div className="mt-8 lg:px-10 lg:mt-0">
              <h1 className="text-2xl font-bold text-[#333] lg:text-3xl font-roboto mb-5 lg:mt-0 mx-1">{event?.title}</h1>
              <div className="p-5 bg-[#f4f4f9] rounded-2xl w-full lg:min-w-[300px]">
                <div className="flex mb-3">
                  <p className="text-[#777]">Цена: </p>
                  <p className="font-roboto text-[#333] ml-[34px]">{event?.price}</p>
                </div>
                <div className="flex items-baseline my-3">
                  <p className="text-[#777]">Дата: </p>
                  <p className="font-roboto text-[#333] ml-[36px]">{dayjs(event?.from_date).utc().tz('Europe/Moscow').format('DD MMMM')}</p>
                </div>
                <div className="flex items-baseline my-3">
                  <p className="text-[#777]">Начало:</p>
                  <p className="font-roboto text-[#333] ml-4">
                    {dayjs(event?.from_date).utc().tz('Europe/Moscow', true).format('HH:mm')}
                  </p>
                </div>
                <div className="flex items-baseline my-3">
                  <p className="text-[#777]">Место: </p>
                  {event?.place_id ? (
                    <Link href={`/places/${event.place_id}`}>
                      <p className="font-roboto text-[#333] hover:text-[#F52D85] ml-[26px] cursor-pointer">{event?.address}</p>
                    </Link>
                  ) : (
                    <p className="font-roboto text-[#333] ml-[25px]">{event?.address}</p>
                  )}
                </div>
              </div>

              <div className="flex">
                <button
                  onClick={handleCopy}
                  className={copied ? styleCopied : styleNoCopied}>
                  {copied ? <BsCheckAll size={18} className="md:mr-2 mr-0" /> : <BsCopy size={18} className="md:mr-2 mr-0" />}
                  {copied ? <p className='md:block hidden'>Ссылка скопирована</p> : <p className='md:block hidden'>Скопировать ссылку</p>}
                </button>
                {event ? (<Link
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#F52D85] hover:opacity-80 border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer transition-colors duration-300 ml-3"
                >
                  {event.price === 'Бесплатно' || event.price === 'во встрече' ? 'На сайт мероприятия' : 'Купить билеты'}
                  <FaArrowRight size={18} className="ml-3" />
                </Link>) : ''}
              </div>
            </div>
          </div>

          <p className="font-roboto font-bold text-[#777] mt-10">{event?.full_text ? 'Описание:' : ''}</p>
          <ReactMarkdown
            className="prose prose-sm md:prose-lg lg:prose-xl text-gray-800 leading-relaxed mt-4"
            remarkPlugins={[remarkGfm]}
          >
            {event?.full_text}
          </ReactMarkdown>
        </div>
      </div>
    </Suspense>
  );
}
