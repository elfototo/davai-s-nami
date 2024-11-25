// 'use client';

// import HeroSearch from '../components/HeroSearsh';
// import Filtres from '../components/Filtres';
// import Card from '../components/Card';
// import { categoriesID, data } from '../data/events';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
// import dayjs from 'dayjs';
// import 'dayjs/locale/ru';
// import utc from 'dayjs/plugin/utc';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { LIMIT } from 'styled-components/dist/utils/createWarnTooManyClasses';

// dayjs.locale('ru');
// dayjs.extend(utc);
// dayjs.extend(customParseFormat);

// const LIMIT = 10;

// export default function Events() {

//   const [isOpen, setIsOpen] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [sortPrice, setSortPrice] = useState(null);
//   const [bgColor, setBgColor] = useState('');
//   const [events, setEvents] = useState([]);
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState(null);


//   const router = useRouter();


//   useEffect(() => {
//     const fetchEvents = async (page) => {
//       const url = 'http://159.223.239.75:8005/api/get_valid_events/';
//       const headers = {
//         'Authorization': 'Bearer zevgEv-vimned-ditva8',
//         'Content-Type': 'application/json',
//       };

//       const data = {
//         date_from: '2024-11-24',
//         date_to: '2024-11-30',
//         // category: [2], // Раскомментируйте, если необходимо
//         fields: ['title', 'price', 'main_category_id'],
//         limit: 10,
//         page: 0,
//       };

//       setIsLoading(true);
//       try {
//         // const queryParans = new URLSearchParams({
//         //   page: page.toString(),
//         //   limit: LIMIT.toString(),
//         //   startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
//         //   endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
//         //   category: category || '',
//         //   search: search || '',
//         //   tags: selectedTags.join(',')
//         // });

//         const response = await fetch(url, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//           throw new Error(`Ошибка: ${response.statusText}`);
//         }

//         const result = await response.json();
//         setResult(result);


//         const taskId = result.task_id;
//         const statusUrl = `http://localhost:8005/api/status/${taskId}`;

//         setTimeout(async () => {
//           try {
//             const statusResponse = await fetch(statusUrl, {
//               method: 'GET',
//               headers,
//             });

//             if (!statusResponse.ok) {
//               throw new Error(`Ошибка: ${statusResponse.statusText}`);
//             }

//             const statusResult = await statusResponse.json();
//             setStatus(statusResult);
//           } catch (error) {
//             console.error('Ошибка при запросе статуса:', error)
//           };
//         }, 10000);
//       } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//       };


//       //   setEvents((prev) => [...prev, ...data.events]);

//       //   if (data.events.length < LIMIT) {
//       //     setHasMore(false);
//       //   }
//       // } catch (error) {
//       //   console.log('Ошибка при загрузке страницы', error)
//       // } finally {
//       //   setIsLoading(false);
//       // }
//     }
//     fetchEvents()
//   }, []);


//   useEffect(() => {
//     fetchEvents(currentPage);
//   }, [currentPage, category, search, startDate, endDate, selectedTags]);

//   useEffect(() => {
//     if (currentPage > 1) {
//       fetchEvents(currentPage);
//     }
//   }, [currentPage]);

//   const handleLoadMore = () => {
//     if (!isLoading && hasMore) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handleResetFiltres = () => {
//     setCurrentPage(1);
//     setEvents([]);
//     setHasMore(true);
//   }

//   useEffect(() => {
//     if (router.isReady) {
//       const { category } = router.query || {};
//       setCategory(category || '');
//     }
//   }, [router.isReady, router.query]);

//   const getCategoryNameById = (id) => {
//     const categoryObj = categoriesID.find((cat) => cat.id === id);
//     return categoryObj ? categoryObj.category : null;
//   };

//   const filteredEvents = events.filter((event) => {

//     const eventCategoryName = getCategoryNameById(event.main_category_id);

//     const matchesCategory = !category || eventCategoryName === category;

//     // Проверка по датам
//     const eventDate = dayjs(event.from_date).utcOffset(+3).startOf('day');
//     const isInDateRange = (!startDate || eventDate.isSame(startDate, 'day')) ||
//       (!endDate || eventDate.isSame(endDate, 'day')) ||
//       (startDate && endDate && eventDate.isAfter(startDate) && eventDate.isBefore(endDate));

//     // Проверка по поиску
//     const sortSearch =
//       (search?.toLocaleLowerCase() || '') === '' ? event :
//         (event.title?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
//         (event.category?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '') ||
//         (event.address?.toLocaleLowerCase() || '').includes(search?.toLocaleLowerCase() || '');

//     return sortSearch && isInDateRange && matchesCategory && (selectedTags.length === 0 || selectedTags.includes(eventCategoryName));
//   });

//   const sortedEvents = sortPrice
//     ? filteredEvents.sort((a, b) => {
//       if (sortPrice === 'asc') {
//         return a.price - b.price;
//       } else if (sortPrice === 'desc') {
//         return b.price - a.price;
//       }
//       return 0;
//     })
//     : filteredEvents;

//   return (
//     <div>
//       <HeroSearch
//         search={search}
//         setSearch={setSearch}
//       />
//       <div className='mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center '>
//         <aside className='lg:w-[20%] w-full mb-3 mr-3 relative'>
//           <div className='block inset-0 lg:sticky lg:top-4 z-10'>
//             <Filtres
//               startDate={startDate}
//               setStartDate={setStartDate}
//               endDate={endDate}
//               setEndDate={setEndDate}
//               selectedTags={selectedTags}
//               setSelectedTags={setSelectedTags}
//               setBgColor={setBgColor}
//               sortPrice={sortPrice}
//               setSortPrice={setSortPrice}
//               isOpen={isOpen}
//               setIsOpen={setIsOpen}
//             />
//           </div>
//         </aside>
//         <section className={`lg:w-[80%]  w-full ${isOpen ? 'hidden lg:block' : 'block'}`}>
//           <div className={`grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto`}>
//             {sortedEvents.length > 0 ? (sortedEvents.map((card) => (
//               <Card
//                 type='mini'
//                 category={card.category}
//                 main_category_id={card.main_category_id}
//                 price={card.price}
//                 title={card.title}
//                 from_date={card.from_date}
//                 address={card.address}
//                 key={card.event_id}
//                 id={card.id}
//                 data={card}
//                 image={card.image}
//               />
//             ))) : <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
//               Нет доступных событий.
//             </p>}
//           </div>
//           {hasMore && (
//             <div className='text-center my-4'>
//               <button
//                 onClick={handleLoadMore}
//                 disabled={isLoading}
//                 className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300'
//               >
//                 {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
//               </button>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

'use client';

import HeroSearch from '../components/HeroSearch';
import Filtres from '../components/Filtres';
import Card from '../components/Card';
import { categoriesID } from '../data/events';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// const LIMIT = 50;

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Events() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortPrice, setSortPrice] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://159.223.239.75:8005/api/get_valid_events/';
      const headers = {
        'Authorization': 'Bearer zevgEv-vimned-ditva8',
        'Content-Type': 'application/json',
      };

      const data = {
        date_from: '2024-11-24',
        date_to: '2024-11-30',
        // category: [2], // Раскомментируйте, если необходимо
        fields: ['title', 'price', 'main_category_id'],
        limit: 10,
        page: 0,
      };

      try {
        // Отправка POST-запроса
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.statusText}`);
        }

        const result = await response.json();
        setResult(result);

        const taskId = result.task_id;
        const statusUrl = `http://localhost:8005/api/status/${taskId}`;

        // Ждем 10 секунд перед запросом статуса
        setTimeout(async () => {
          try {
            const statusResponse = await fetch(statusUrl, {
              method: 'GET',
              headers,
            });

            if (!statusResponse.ok) {
              throw new Error(`Ошибка: ${statusResponse.statusText}`);
            }

            const statusResult = await statusResponse.json();
            setStatus(statusResult);
          } catch (error) {
            console.error('Ошибка при запросе статуса:', error);
          }
        }, 10000);
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    fetchData();
  }, []);


  // const fetchEvents = async (page = 0) => {
  //   const url = 'http://159.223.239.75:8005/api/get_valid_events/';
  //   const headers = {
  //     'Authorization': 'Bearer zevgEv-vimned-ditva8',
  //     'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000'
  //   };

  //   const data = {
  //     date_from: '2024-11-24',
  //     date_to: '2024-11-30',
  //     fields: ['title', 'price', 'main_category_id'],
  //     limit: LIMIT,
  //     page,
  //   };

  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

  //     const result = await response.json();
  //     setEvents((prev) => (page === 0 ? result.events : [...prev, ...result.events]));

  //     if (result.events.length < LIMIT) setHasMore(false);
  //   } catch (error) {
  //     console.error('Ошибка при загрузке событий:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchEvents(currentPage);
  // }, [currentPage, startDate, endDate, search, selectedTags, category]);

  // const handleLoadMore = () => {
  //   if (!isLoading && hasMore) setCurrentPage((prev) => prev + 1);
  // };

  const getCategoryNameById = (id) => {
    const categoryObj = categoriesID.find((cat) => cat.id === id);
    return categoryObj ? categoryObj.category : null;
  };

  const filteredEvents = events.filter((event) => {
    const eventCategoryName = getCategoryNameById(event.main_category_id);

    const matchesCategory = !category || eventCategoryName === category;

    const eventDate = dayjs(event.from_date).utcOffset(+3).startOf('day');
    const isInDateRange =
      (!startDate || eventDate.isSameOrAfter(startDate, 'day')) &&
      (!endDate || eventDate.isSameOrBefore(endDate, 'day'));

    const matchesSearch = search
      ? (event.title?.toLowerCase() || '').includes(search.toLowerCase())
      : true;

    const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

    return matchesCategory && isInDateRange && matchesSearch && matchesTags;
  });

  const sortedEvents = sortPrice
    ? filteredEvents.sort((a, b) => (sortPrice === 'asc' ? a.price - b.price : b.price - a.price))
    : filteredEvents;

  return (
    <div>
      <HeroSearch search={search} setSearch={setSearch} />
      <div className="mt-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">
        <aside className="lg:w-[20%] w-full mb-3 mr-3 relative">
          <div className="block inset-0 lg:sticky lg:top-4 z-10">
            <Filtres
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              sortPrice={sortPrice}
              setSortPrice={setSortPrice}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </aside>
        <section className={`lg:w-[80%] w-full ${isOpen ? 'hidden lg:block' : 'block'}`}>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((card) => (
                <Card
                  type="mini"
                  category={card.category}
                  main_category_id={card.main_category_id}
                  price={card.price}
                  title={card.title}
                  from_date={card.from_date}
                  address={card.address}
                  key={card.event_id}
                  id={card.id}
                  data={card}
                  image={card.image}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
                Нет доступных событий.
              </p>
            )}
          </div>
          {hasMore && (
            <div className="text-center my-4">
              <button
                // onClick={handleLoadMore}
                // disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};