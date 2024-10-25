'use client';

import { categories } from '../data/events';
import { useState } from 'react';
import { RiInstagramFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import { FaVk } from "react-icons/fa";

import Link from 'next/link';



const Footer = () => {
    const [dataCategories, setDataCategories] = useState(categories);

    return (
        <div className='max-w-custom-container text-white mt-10 px-6 py-8 mx-auto'>

            <div className='flex flex-col'>
                <Link href="/" className='text-[1.8rem] font-medium text-white'>
                    Давай с нами!
                </Link>
            </div>
            <div className='flex flex-col md:flex-row md:justify-between mt-8'>


                <div>
                    <div className='grid grid-cols-1 gap-y-3 mb-8 lg:mb-0'>
                        <Link href="/events" className='text-white font-regular hover:underline my-[0.1rem] transition-colors duration-200'>События</Link>
                        <Link href="/places" className='text-white font-regular hover:underline my-[0.1rem] transition-colors duration-200'>Места</Link>
                        <Link href="/about" className='text-white font-regular hover:underline my-[0.1rem] transition-colors duration-200'>О нас</Link>
                    </div>
                </div>

                <div className="mb-8 lg:mb-0">
                    <p className=" font-bold font-roboto text-white">Куда сходить:</p>
                    <ul className="text-gray-300">
                        <li className="hover:underline font-roboto cursor-pointer hover:text-white my-2">Горячие новинки месяца</li>
                        <li className="hover:underline cursor-pointer hover:text-white my-2">Куда сходить сегодня и завтра</li>
                        <li className="hover:underline cursor-pointer hover:text-white my-2">Куда сходить в выходные</li>
                    </ul>
                </div>


                <div className="">
                    <p className=" font-bold font-roboto text-white">Категории:</p>
                    <ul className='grid grid-cols-2 md:grid-cols-3 gap-x-5'>
                        {dataCategories.map((category) => (
                            <li key={category} className='hover:text-white hover:underline cursor-pointer my-2 text-gray-300'>{category}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <hr className='my-8 border-gray-200 md:my-10 dark:border-gray-700' />

            <div>
                <div className='my-8'>

                    <div className="flex justify-center items-center">

                        {/* <div className='mx-2'>

                            <Link href='/' className='hover:bg-pink-600 transform transition-colors duration-200 border border-white hover:border-transparent rounded-full flex items-center justify-center cursor-pointer w-[40px] h-[40px]'>
                                <RiInstagramFill size={20} color='white' className='' />
                            </Link>

                        </div> */}
                        <div className='mx-2'>

                            <Link href='https://t.me/DavaiSNami' className='hover:bg-sky-600 transform transition-colors duration-200 border border-white hover:border-transparent rounded-full flex items-center justify-center cursor-pointer w-[40px] h-[40px]'>
                                <FaTelegramPlane size={20} color='white' className='' />
                            </Link>

                        </div>
                        <div className='mx-2'>

                            <Link href='https://vk.com/davaisnamispb' className='hover:bg-blue-600 transform transition-colors duration-200 border border-white hover:border-transparent rounded-full flex items-center justify-center cursor-pointer w-[40px] h-[40px]'>
                                <FaVk size={20} color='white' className='' />
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
            <p className='text-gray-400'>*Изображение на баннере сайта Designed by Freepik</p>



        </div>
    )
}

export default Footer;