'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
// import { useEvents } from '../../../context/EventsContext';
import { data1 } from '../../data/events';


dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventPageClient({ id }) {

  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState(data1);


  // const { events } = useEvents(); // Assuming you have access to `events` in the context


  const togglePhoto = () => setShowPhoto(!showPhoto);

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(window.location.href).then(() => setCopied(true));
  // };

  const styleCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-green-500 text-green-500 transform transition-colors duration-300';
  const styleNoCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-[#F52D85] text-[#F52D85] transform transition-colors duration-300';

  const event = events.find((event) => event.id === Number(id)); // Find the event by ID

  if (!event) {
    return <div>Событие не найдено</div>;
  }

  return (
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
                  src={event.image || '/img/cat.png'}
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

          <div className="overflow-hidden shadow-xl rounded-lg lg:w-full h-96 lg:h-full max-w-[40%]">
            <Image
              src={event.image || '/img/cat.png'}
              width={500}
              height={500}
              alt="avatar"
              className="object-cover object-center w-full rounded-lg h-96 cursor-pointer hover:scale-105 transform transition-all duration-300"
              onClick={togglePhoto}
            />
          </div>

          <div className="mt-8 lg:px-10 lg:mt-0">
            <h1 className="text-2xl font-bold text-[#333] lg:text-3xl font-roboto mb-5 mx-1">{event.title}</h1>
            <div className="p-5 bg-[#f4f4f9] rounded-2xl w-full lg:min-w-[300px]">
              <div className="flex mb-3">
                <p className="text-[#777]">Цена: </p>
                <p className="font-roboto text-[#333] ml-[33px]">{event.price}</p>
              </div>
              <div className="flex items-baseline my-3">
                <p className="text-[#777]">Дата: </p>
                <p className="font-roboto text-[#333] ml-[38px]">{dayjs(event.from_date).utc().tz('Europe/Moscow').format('DD MMMM')}</p>
              </div>
              <div className="flex items-baseline my-3">
                <p className="text-[#777]">Начало:</p>
                <p className="font-roboto text-[#333] ml-4">
                  {dayjs(event.from_date).utc().tz('Europe/Moscow', true).format('HH:mm')}
                </p>
              </div>
              <div className="flex items-baseline my-3">
                <p className="text-[#777]">Место: </p>
                {event.place_id ? (
                  <Link href={`/places/${event.place_id}`}>
                    <p className="font-roboto text-[#333] hover:text-[#F52D85] ml-[25px] cursor-pointer">{event.address}</p>
                  </Link>
                ) : (
                  <p className="font-roboto text-[#333] ml-[25px]">{event.address}</p>
                )}
              </div>
            </div>

            <div className="flex">
              <button 
              // onClick={handleCopy} 
              className={copied ? styleCopied : styleNoCopied}>
                {copied ? <BsCheckAll size={18} className="mr-2" /> : <IoShareSocialSharp size={18} className="mr-2" />}
                <p>Поделиться</p>
              </button>
              <Link
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F52D85] hover:opacity-80 border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer transition-colors duration-300 ml-3"
              >
                {event.price === 'Бесплатно' || event.price === 'во встрече' ? 'На сайт мероприятия' : 'Купить билеты'}
                <FaArrowRight size={18} className="ml-3" />
              </Link>
            </div>
          </div>
        </div>

        <p className="font-roboto font-bold text-[#777] mt-10">{event.full_text ? 'Описание:' : ''}</p>
        <ReactMarkdown
          className="prose prose-sm md:prose-lg lg:prose-xl text-gray-800 leading-relaxed mt-4"
          remarkPlugins={[remarkGfm]}
        >
          {event.full_text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
