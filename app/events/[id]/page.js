'use client'
import { data } from '../../data/events';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useState } from 'react';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";


dayjs.locale('ru');

export default function EventPage({ params }) {

  const [showPhoto, setShowPhoto] = useState(false);
  const togglePhoto = () => {
    setShowPhoto(!showPhoto);
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

            <div>
              <Image className='object-cover object-center w-full lg:w-[32rem] rounded-lg h-96 shadow-xl'
                src={event.image}
                width={1000}
                height={1000}
                alt="avatar"
                onClick={togglePhoto} />
            </div>

            <div className='mt-8 lg:px-10 lg:mt-0'>

              <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5 mx-1">
                {event.category} <br /> <span className="text-[#F52D85]">{event.title}</span>
              </h1>

              <div className='mx-1 mb-3 p-5 bg-[#f4f4f9] rounded-2xl w-full lg:w-[300px]'>
                <div className='flex mb-3'>
                  <p className='text-[#777]'>Цена: </p>
                  <p className='font-roboto text-[#333] text-gray-[#333]  lg:w-72 ml-6'>
                    {event.price} ₽</p>
                </div>
                <div className='flex my-3 lg:w-72 '>
                  <span className='text-[#777]'>Дата: </span>
                  <div className='flex flex-col ml-7'>
                    <p className='font-roboto text-[#333] text-gray-[#333] mb-1'>
                      с 20:00, 29 окт. 2024
                    </p>
                    <p className='font-roboto text-[#333] text-gray-[#333] '>
                      по 23:00, 29 окт. 2024
                    </p>
                  </div>

                </div>
                <div className='flex my-3 lg:w-72  '>
                  <p className='text-[#777]'>Место: </p>
                  <p className='font-roboto text-[#333] hover:text-[#F52D85] ml-4 cursor-pointer'>
                    {event.place}</p>
                </div>
                <div className='flex mt-3 lg:w-72 '>
                  <p className='text-[#777]'>Адрес: </p>
                  <p className='font-roboto text-[#333] hover:text-[#F52D85] ml-5 cursor-pointer'>
                    улица 20</p>
                </div>
              </div>

              <div className='flex'>
                <div className='bg-[#F52D85] border px-4 py-2 mt-3 text-white flex items-center rounded-xl cursor-pointer hover:bg-white hover:border-[#F52D85] hover:text-[#F52D85] transform transition-colors duration-300'>
                  <IoShareSocialSharp size={18} className='mr-2 ' />
                  <p>Поделиться</p>
                </div>
              </div>


            </div>

          </div>
          {/* <div className='bg-[#F52D85] h-[1px] w-2/3'></div> */}
          <p className=' font-roboto font-bold text-[#777] text-gray-[#333] lg:w-72 mt-10'>Описание:</p>
          <p className='text-[#777] font-roboto'>{event.content}</p>
        </div>
      </div>
    </div>
  );
};