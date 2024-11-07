'use client'

import { data } from '../../data/events';
import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import 'dayjs/locale/ru';
import { useState } from 'react';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";



dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);


export default function EventPage({ params }) {

  const [showPhoto, setShowPhoto] = useState(false);
  const [copied, setCopied] = useState(false);

  const styleCopied = 'bg-green-500 border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer hover:bg-white hover:border-green-500 hover:text-green-500 transform transition-colors duration-300 ';
  const styleNoCopied = 'bg-[#F52D85] border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer hover:bg-white hover:border-[#F52D85] hover:text-[#F52D85] transform transition-colors duration-300 ';

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
      <div className=' flex'>

        <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

          <div className='lg:flex lg:items-center bg-[#fff] rounded-xl p-10'>

            {showPhoto &&
              <div className='z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
                onClick={togglePhoto}
              >
                <div className='relative'>
                  <Image className='object-cover object-center rounded-lg  shadow-xl'
                    src={event.image}
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

            <div className='overflow-hidden shadow-xl h-96'>
              <Image className='object-cover object-center w-full lg:w-[32rem] rounded-lg h-96  cursor-pointer hover:scale-105 transform transition-all duration-300'
                src={event.image}
                width={1000}
                height={1000}
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
                  <p className='font-roboto text-[#333] text-gray-[#333]  lg:w-72 ml-8'>
                    {event.price}</p>
                </div>
                <div className='flex items-baseline my-3 lg:w-72 '>
                  <p className='text-[#777]'>Дата: </p>
                  <div className='flex flex-col ml-9'>
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
                  <p className='font-roboto text-[#333] hover:text-[#F52D85] ml-6 cursor-pointer'>
                    {event.address}</p>
                </div>
              </div>

              <div className='flex relative'>
                <button
                  onClick={hadleCopy}
                  className={copied ? styleCopied : styleNoCopied}>
                  {copied ? <BsCheckAll size={18} className='mr-2 ' /> : <IoShareSocialSharp size={18} className='mr-2 ' />}

                  <p>Поделиться</p>
                </button>
              </div>


            </div>

          </div>
          {/* <div className='bg-[#F52D85] h-[1px] w-2/3'></div> */}
          <p className=' font-roboto font-bold text-[#777] text-gray-[#333] lg:w-72 mt-10'>Описание:</p>
          <p className='text-[#777] font-roboto'>{event.full_text}</p>
        </div>
      </div>
    </div>
  );
};