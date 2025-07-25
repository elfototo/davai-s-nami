'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MdAccountCircle } from "react-icons/md";
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../../context/SwrContext';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS } from '../../config';
import { FaHome, FaMapMarkerAlt, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { IoMdArrowBack } from "react-icons/io";
import Image from 'next/image';


const pages = [
  { title: 'Места', path: '/places' },
  { title: 'О нас', path: '/about' },
  { title: 'События', path: '/events' },
  { title: 'Культура', path: '/events?category=Культура' },
  { title: 'Кино', path: '/events?category=Кино' },
  { title: 'Лекции', path: '/events?category=Лекции' },
  { title: 'Вечеринки', path: '/events?category=Вечеринки' },
  { title: 'Музыка', path: '/events?category=Музыка' },
  { title: 'Сегодня', path: '/events?category=Сегодня' },
  { title: 'Завтра', path: '/events?category=Завтра' },
  { title: 'Выходные', path: '/events?category=Выходные' },
  { title: 'Вконтакте', path: 'https://vk.com/davaisnamispb' },
  { title: 'Телеграм', path: 'https://t.me/DavaiSNami' },
];

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSearch, setFilterSearch] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const { cache, findDataById } = useEvents();
  const loadedEventIdsRef = useRef(new Set());
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const limit = 10;

  const pathname = usePathname();
  const router = useRouter();

  // Проверяем, что находимся на странице /events/[id] или /places/[id]
  const isDynamicPage = /^\/(events|places)\/[^/]+$/.test(pathname);

  const fetcher = async (target) => {
    try {

      const res = await fetch(`${SEARCH_URL}?query=${target}&limit=${limit}`, {
        method: 'GET',
        headers: API_HEADERS,
      });

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.statusText}`);
      }


      const result = await res.json();

      let eventsfromFetcher = [];

      if (result.events && Array.isArray(result.events)) {
        eventsfromFetcher = eventsfromFetcher.concat(result.events);
      }

      if (result.places && Array.isArray(result.places)) {
        eventsfromFetcher = eventsfromFetcher.concat(result.places);
      }


      return eventsfromFetcher;

    } catch (error) {
      console.log('Ошибка при выполнении задачи', error);
    }
  };

  const {
    data: dataEventSearchQuery,
    error: errorSearchQuery,
    isLoading: isLoadingsearchQuery
  } = useSWR(
    searchQuery ? `/api/search/?query=${searchQuery}` : null,
    () => fetcher(searchQuery),
  );


  useEffect(() => {
    if (!searchQuery) {
      setFilterSearch(pages);
      return;
    }
    let eventsToSort = [...pages];

    if (dataEventSearchQuery && dataEventSearchQuery.length > 0) {
      dataEventSearchQuery.forEach(event => {

        if (event.place_name) {
          event.path = event.path || `/places/${event.id}`;
        } else if (event.title) {
          event.path = event.path || `/events/${event.id}`;
        }

        eventsToSort.push(event);

      });
    }

    const filtered = eventsToSort.filter((event) => {
      return event.title?.toString().toLowerCase().includes(searchQuery.toLowerCase()) || event.path.toString().toLowerCase().includes(searchQuery.toLowerCase()) || event.place_name?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    })

    setFilterSearch(filtered);

  }, [dataEventSearchQuery, searchQuery, allEvents]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setSearchQuery('');
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e) => {
    if (
      searchRef.current && !searchRef.current.contains(e.target) &&
      dropdownRef.current && !dropdownRef.current.contains(e.target)
    ) {
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/events');
    }
  };

  return (
    <nav className="z-20 relative bg-white shadow dark:bg-gray-800 ">
      <div className="container px-6 py-4 mx-auto max-w-custom-container">
        <div className="lg:flex lg:w-full lg:items-center lg:justify-between">

          <div className="flex items-center justify-between">
            {isDynamicPage ? (
              
              <>
                <div className='flex'>
                  <button onClick={handleBack} className=" lg:mr-6 rounded-full transition">
                    <IoMdArrowBack className="text-gray-500" size={28} />
                  </button>
                </div>
                <div className='mx-auto h-full lg:mr-6'>
                  <Link href="/" className=''>
                    {/* Давай с нами!*/}
                    
                    <Image
                        src={'/img/logo_main.png'}
                        width={1000}
                        height={1000}
                        className=" w-[20vh]"
                        alt="avatar"
                        priority
                      />
                    
                  </Link>
                </div>
              </>
            ) : (
              // В остальных случаях показываем логотип
              <Link href="/" className='mr-5'>
                {/* Давай с нами! */}
                <div className=' h-full'>
                  <Image
                    src={'/img/logo_main.png'}
                    width={1000}
                    height={1000}
                    className="w-[20vh]"
                    alt="avatar"
                    priority
                  />
                </div>
              </Link>
            )}


            <div className="hidden mx-3 lg:block">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Search"
                />
                {searchQuery && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-2 bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                    <ul>
                      {filterSearch.length > 0 ? (
                        filterSearch.map((event) => (
                          <li
                            key={event.path}
                            onClick={handleItemClick}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Link href={event.path}>
                              <div className="block">{event.title || event.place_name}</div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                aria-label="toggle menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 lg:pr-0 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 
            lg:mt-0 lg:p-0 lg:top-0 lg:right-0  lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center 
            ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'}`}
          >
            <div className="flex flex-col -mx-5 lg:flex-row lg:items-center lg:justify-end lg:ml-auto">

              <Link
                onClick={toggleMenu}
                href="/events"
                className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                События
              </Link>
              <Link
                onClick={toggleMenu}
                href="/places"
                className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Места
              </Link>
              <Link
                onClick={toggleMenu}
                href="/about"
                className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                О нас
              </Link>
            </div>

            {/* <div className="flex items-center mt-4 lg:mt-0">
              <button
                className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                aria-label="show notifications"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown">
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <MdAccountCircle className='w-8 h-8 text-[#333]' />

                </div>
                <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">Войти</h3>
              </button>
            </div> */}

            <div className="my-4 lg:hidden">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Search"
                />
                {searchQuery && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-2 bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                    <ul>
                      {filterSearch.length > 0 ? (
                        filterSearch.map((event) => (
                          <li
                            key={event.path}
                            onClick={handleItemClick}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Link href={event.path}>
                              <div className="block">{event.title || event.place_name}</div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
          <MobileNavBar />
        </div>
      </div>
    </nav >
  );
};

export default Navbar;

const MobileNavBar = () => {

  const pathname = usePathname();

  // Функция для проверки, является ли ссылка текущей
  const isActive = (path) => pathname === path;

  return (
    <div className='relative lg:hidden'>
      <div className="fixed bottom-3 left-3 right-3 rounded-full z-50 flex justify-around bg-white border-t border-gray-300 shadow-lg lg:hidden">

        <Link href="/" className={`flex flex-col items-center text-gray-500 transition-all duration-300 py-6 px-7 ${isActive("/") ? "active text-sky-500 rounded-full" : ""}`}>
          <FaHome size={25} />
          {/* <span className="text-sm font-roboto">События</span> */}
        </Link>
        <Link href="/events" className={`flex flex-col items-center text-gray-500 transition-all duration-300 py-6 px-7 ${isActive("/events") ? " active text-green-500 rounded-full" : ""}`}>
          <FaCalendarAlt size={25} />
          {/* <span className="text-sm font-roboto">События</span> */}
        </Link>
        <Link href="/places" className={`flex flex-col items-center text-gray-500 transition-all duration-300 py-6 px-7 ${isActive("/places") ? " active rounded-full text-red-500" : ""}`}>
          <FaMapMarkerAlt size={25} />
          {/* <span className="text-sm font-roboto">Места</span> */}
        </Link>
        <Link href="/about" className={`flex flex-col items-center text-gray-500 transition-all duration-300 py-6 px-7 ${isActive("/about") ? " active text-purple-500 rounded-full" : ""}`}>
          <FaInfoCircle size={25} />
          {/* <span className="text-sm font-roboto">О нас</span> */}
        </Link>
      </div>
    </div>
  );
};