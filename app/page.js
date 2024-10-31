'use client'
import './globals.css';
import Card from './components/Card';
import Categories from './components/Categories';
import Categories_2 from './components/Categories_2';

import Link from 'next/link';
import 'animate.css';
import { useEffect, useState } from 'react';

export default function Home() {

  const [isAnimated, setIsAnimated] = useState(true);
  useEffect(() => {
    setIsAnimated(true);

    const timer = setTimeout(() => {
      setIsAnimated(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <section className='max-w-custom-container mx-auto'>

      </section>
      <section className='bg-accent-gradient h-[26rem] relative overflow-hidden'>
        <div className="flex justify-center md:justify-between h-[inherit] m-0 mx-auto max-w-custom-container overflow-hidden px-4 md:pl-10 md:pr-0">
          <div className='flex items-center md:items-start justify-center flex-col md:max-w-[50%]'>
            <h4 className='font-roboto font-bold text-secondary text-6xl mb-5  whitespace-nowrap'>Играй с нами!</h4>
            <p className='font-roboto text-center md:text-start font-regular text-secondary mb-5'>Нажми на кнопку чтобы найти случайное <br /> мероприятие на свой уикенд в Санкт - Петербурге</p>
            <button
              className={`font-roboto  w-3/4 py-4 text-[1rem] font-medium bg-white text-[#333] rounded-lg shadow-lg 
              transform transition-transform duration-300 hover:scale-105
              ${isAnimated ? 'animate__animated animate__pulse animate__repeat-2' : ''}
              `}>Мне повезет</button>
          </div>         

          {/* md-screen */}
          <div className='h-full w-[60%] relative hidden md:block'>
            <div className="w-full absolute left-0 top-5 h-full bg-cover bg-no-repeat md:bg-[url('/img/sm-banner.png')] lg:bg-[url('/img/banner.png')]">
            </div>
          </div>
        </div>

      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>
        <div className='font-roboto font-medium'>
          <Categories />
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <h1 className='font-roboto font-bold'>Куда сходить</h1>
        <div className='font-roboto font-medium'>
          <Categories_2 />
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Горячие новинки месяца</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить сегодня и завтра</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
          </div>
        </div>
      </section>
      <section className='max-w-custom-container mx-auto px-4'>
        <div className='flex justify-between items-baseline'>
          <h1 className='font-roboto font-bold'>Куда сходить в выходные</h1>
          <Link href="/events" className='text-[#777] whitespace-nowrap ml-5 underline'>
            <p className="text-[#777]">Смотреть весь список</p>
          </Link>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
            <Card type='max' />
          </div>
        </div>
      </section>


    </div>
  );
}
