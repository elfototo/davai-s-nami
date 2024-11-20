'use client'

import { data } from '../../data/events';
import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import 'dayjs/locale/ru';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";




dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);


export default function EventPage({ params }) {

  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);

  const styleCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-green-500 text-green-500 transform transition-colors duration-300 ';
  const styleNoCopied = 'border px-4 py-2 mt-3 flex items-center rounded-xl cursor-pointer bg-white border-[#F52D85] text-[#F52D85] transform transition-colors duration-300';

  const togglePhoto = () => {
    setShowPhoto(!showPhoto);
  };

  const hadleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
    });
  }

  const { id } = params;
  const event = data.find(event => event.id === parseInt(id));

  if (!event) {
    return <div>Событие не найдено</div>;
  }

  return (
    <div className='relative max-w-custom-container mx-auto'>
      <div className='flex'>

        <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

          <div className='lg:flex lg:items-center bg-[#fff] rounded-xl p-10'>

            {showPhoto &&
              <div className='z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
                onClick={togglePhoto}
              >
                <div className='relative'>
                  <Image className='object-cover object-center rounded-lg  shadow-xl'
                    src={event.image === "" || !event.image ? '/img/cat.png' : event.image}
                    width={1000}
                    height={1000}
                    style={{ height: '60vh', width: 'auto' }}

                    alt="avatar" />
                  <button
                    onClick={togglePhoto}
                    className='absolute -top-8 -right-8'
                  >

                    <IoMdClose className='text-[2rem] text-[#fff]' />
                  </button>
                </div>
              </div>
            }

            <div className='overflow-hidden shadow-xl rounded-lg lg:w-full h-96 lg:h-full max-w-[40%]'>
              <Image className='object-cover object-center w-full lg:w-full rounded-lg h-96 lg:h-full cursor-pointer hover:scale-105 transform transition-all duration-300'
                src={event.image === "" || !event.image ? '/img/cat.png' : event.image}
                width={500}
                height={500}
                alt="avatar"
                onClick={togglePhoto} />
            </div>

            <div className='mt-8 lg:px-10 lg:mt-0'>

              <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5 mx-1">
                {event.title}
              </h1>

              <div className='mx-1 mb-3 p-5 bg-[#f4f4f9] rounded-2xl w-full lg:min-w-[300px]'>
                <div className='flex mb-3'>
                  <p className='text-[#777]'>Цена: </p>
                  <p className='font-roboto text-[#333] text-gray-[#333]  lg:w-72 ml-[33px]'>
                    {event.price}</p>
                </div>
                <div className='flex items-baseline my-3 lg:w-72 '>
                  <p className='text-[#777]'>Дата: </p>
                  <div className='flex flex-col ml-[38px]'>
                    <p className='font-roboto text-[#333] text-gray-[#333]'>
                      {dayjs(event.from_date).format('DD MMMM')}
                    </p>
                  </div>
                </div>
                <div className='flex items-baseline my-3 lg:w-72 '>
                  <p className='text-[#777]'>Начало:</p>
                  <p className='font-roboto text-[#333] ml-4'>
                    {dayjs(event.from_date).utc().tz('Europe/Moscow', true).format('HH:mm')}
                  </p>
                </div>
                <div className='flex items-baseline my-3 '>
                  <p className='text-[#777]'>Место: </p>
                  {event.place_id ? 
                  <Link href={`/places/${event.place_id}`}>
                    <p className='font-roboto text-[#333] hover:text-[#F52D85] ml-[25px] cursor-pointer'>
                      {event.address}</p>
                  </Link>
                    : <p className='font-roboto text-[#333] ml-[25px] r'>
                    {event.address}</p>
                  }

                </div>
              </div>

              <div className='flex relative'>
                <button
                  onClick={hadleCopy}
                  className={copied ? styleCopied : styleNoCopied}>
                  {copied ? <BsCheckAll size={18} className='mr-2 ' /> : <IoShareSocialSharp size={18} className='mr-2 ' />}

                  <p>Поделиться</p>
                </button>
                <Link
                  href={event.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-[#F52D85] hover:opacity-80 border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer transform transition-colors duration-300 ml-3'>
                  {event.price === 'Бесплатно' || event.price === 'во встрече' ? 'На сайт мероприятия' : 'Купить билеты'}

                  <FaArrowRight size={18} className='ml-3 ' />
                </Link>
              </div>

              <div className='flex'>
              </div>
            </div>
          </div>


          <p className=' font-roboto font-bold text-[#777] text-gray-[#333] lg:w-72 mt-10'>{event.full_text ? 'Описание' : ''}:</p>
          <ReactMarkdown
            className="prose prose-sm md:prose-lg lg:prose-xl text-gray-800 leading-relaxed mt-4"
            remarkPlugins={[remarkGfm]}>

            {event.full_text}

          </ReactMarkdown>

        </div>
      </div>
    </div>
  );
};