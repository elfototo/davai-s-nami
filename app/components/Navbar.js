'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useSWR, { SWRConfig } from 'swr';
import { useEvents } from '../../context/SwrContext';
import { SEARCH_URL, API_HEADERS } from '../../config';
import { FaUserCircle } from 'react-icons/fa';
import { TbLogin2 } from 'react-icons/tb';
import {
  FaHome,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCalendarAlt,
} from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';
// import { FaUserCircle } from 'react-icons/fa';
import Dropdown from './Dropdown';

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

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const limit = 10;

  const pathname = usePathname();
  const router = useRouter();

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
    isLoading: isLoadingsearchQuery,
  } = useSWR(searchQuery ? `/api/search/?query=${searchQuery}` : null, () =>
    fetcher(searchQuery),
  );

  useEffect(() => {
    if (!searchQuery) {
      setFilterSearch(pages);
      return;
    }
    let eventsToSort = [...pages];

    if (dataEventSearchQuery && dataEventSearchQuery.length > 0) {
      dataEventSearchQuery.forEach((event) => {
        if (event.place_name) {
          event.path = event.path || `/places/${event.id}`;
        } else if (event.title) {
          event.path = event.path || `/events/${event.id}`;
        }

        eventsToSort.push(event);
      });
    }

    const filtered = eventsToSort.filter((event) => {
      return (
        event.title
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.path
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.place_name
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });

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
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      searchRef.current &&
      !searchRef.current.contains(e.target)
    ) {
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
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
    <nav className="z-60 relative bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto max-w-custom-container px-6 py-4">
        <div className="lg:flex lg:w-full lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            {isDynamicPage ? (
              <>
                <div className="flex">
                  <button
                    onClick={handleBack}
                    className="rounded-full transition lg:mr-6"
                  >
                    <IoMdArrowBack className="text-gray-500" size={28} />
                  </button>
                </div>
                <div className="mx-auto h-full lg:mr-6">
                  <Link href="/" className="">
                    {/* Давай с нами!*/}

                    <Image
                      src={'/img/logo_main.png'}
                      width={1000}
                      height={1000}
                      className="w-[20vh]"
                      alt="avatar"
                      priority
                    />
                  </Link>
                </div>
              </>
            ) : (
              // В остальных случаях показываем логотип
              <Link href="/" className="mr-5">
                {/* Давай с нами! */}
                <div className="h-full">
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

            <div className="mx-3 hidden lg:block">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full rounded-md border bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
                  placeholder="Search"
                />
                {searchQuery && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 z-10 mt-2 max-h-60 overflow-y-auto bg-white shadow-lg"
                  >
                    <ul>
                      {filterSearch.length > 0 ? (
                        filterSearch.map((event) => (
                          <li
                            key={event.path}
                            onClick={() =>
                              console.log('clicked li', event.path)
                            }
                            className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Link
                              href={event.path}
                              onClick={(e) => {
                                console.log('clicked link', event.path);
                              }}
                              // onClick={handleItemClick}
                            >
                              <div className="block">
                                {event.title || event.place_name}
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          No results found
                        </li>
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
                className="text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 dark:focus:text-gray-400"
                aria-label="toggle menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                    className="h-6 w-6"
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
            className={`absolute inset-x-0 z-20 w-full bg-white px-6 py-4 transition-all duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:right-0 lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:bg-transparent lg:p-0 lg:pr-0 lg:opacity-100 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
          >
            <div className="-mx-5 flex flex-col lg:ml-auto lg:flex-row lg:items-center lg:justify-end">
              <Link
                onClick={toggleMenu}
                href="/events"
                className="mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
              >
                События
              </Link>
              <Link
                onClick={toggleMenu}
                href="/places"
                className="mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
              >
                Места
              </Link>
              <Link
                onClick={toggleMenu}
                href="/about"
                className="mx-3 mt-2 transform rounded-md px-3 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
              >
                О нас
              </Link>

              <div className="mx-3 mt-2 transform rounded-md text-gray-700 transition-colors duration-300 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0">
                <Dropdown isOpenMenu={isOpen} setIsOpenMenu={setIsOpen} />
              </div>
            </div>

            <div className="my-4 lg:hidden">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="w-full rounded-md border bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
                  placeholder="Search"
                />
                {searchQuery && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 z-10 mt-2 max-h-60 overflow-y-auto bg-white shadow-lg"
                  >
                    <ul>
                      {filterSearch.length > 0 ? (
                        filterSearch.map((event) => (
                          <li
                            key={event.path}
                            onClick={() =>
                              console.log('clicked li', event.path)
                            }
                            className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Link href={event.path} onClick={handleItemClick}>
                              <div className="block">
                                {event.title || event.place_name}
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          No results found
                        </li>
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
    </nav>
  );
};

export default Navbar;

const MobileNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggestIn, setIsLoggestIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggestIn(!!token);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('access_token');

      setIsLoggestIn(!!token);
      console.log('Auth changed, token:', !!token);
    };

    window.addEventListener('auth-changed', handleAuthChange);

    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleLogOut = () => {
    setIsLoggestIn(false);

    sessionStorage.setItem('user_logged_out', 'true');

    localStorage.removeItem('access_token');
    localStorage.removeItem('tokenExpiresAt');

    window.dispatchEvent(new Event('auth-changed'));
    router.push('/');
  };

  // Функция для проверки, является ли ссылка текущей
  const isActive = (path) => pathname === path;

  return (
    <div className="relative lg:hidden">
      <div className="fixed bottom-3 left-3 right-3 z-50 flex justify-around rounded-full border-t border-gray-300 bg-white shadow-lg lg:hidden">
        <Link
          href="/"
          className={`flex flex-col items-center py-6 text-gray-500 transition-all duration-300 ${isActive('/') ? 'active rounded-full text-sky-500' : ''}`}
        >
          <FaHome size={25} />
        </Link>
        <Link
          href="/events"
          className={`flex flex-col items-center py-6 text-gray-500 transition-all duration-300 ${isActive('/events') ? 'active rounded-full text-green-500' : ''}`}
        >
          <FaCalendarAlt size={25} />
        </Link>
        <Link
          href="/places"
          className={`flex flex-col items-center py-6 text-gray-500 transition-all duration-300 ${isActive('/places') ? 'active rounded-full text-red-500' : ''}`}
        >
          <FaMapMarkerAlt size={25} />
        </Link>
        <Link
          href="/about"
          className={`flex flex-col items-center py-6 text-gray-500 transition-all duration-300 ${isActive('/about') ? 'active rounded-full text-purple-500' : ''}`}
        >
          <FaInfoCircle size={25} />
        </Link>
        <Link
          href={`${isLoggestIn ? '/dashboard' : '/login'}`}
          className={`flex flex-col items-center py-6 text-gray-500 transition-all duration-300 ${isActive('/dashboard') ? 'active rounded-full text-purple-500' : ''}`}
        >
          {isLoggestIn ? <FaUserCircle size={25} /> : <TbLogin2 size={25} />}
        </Link>
      </div>
    </div>
  );
};
