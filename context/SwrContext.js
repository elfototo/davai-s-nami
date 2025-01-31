import { useState, useEffect, createContext, useContext } from 'react';
import 'dayjs/locale/ru';
dayjs.locale('ru');
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import useSWRInfinite from "swr/infinite";
import { useSWRConfig } from 'swr';
import useSWR, { SWRConfig } from 'swr';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const EventsContext = createContext();

export const useEvents = () => {
    return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {

    // const [index, setIndex] = useState(0);
    // const [isLoadingPage, setIsLoadingPage] = useState(false);
    // const [hasMore, setHasMore] = useState(true);
    // const limit = 8;

    // let today = dayjs().format('YYYY-MM-DD');
    // let nextSixMonth = dayjs().add(6, 'month').format('YYYY-MM-DD');

    // const fetcher = async () => {
    //     setIsLoadingPage(true);

    //     try {
    //         const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': 'Bearer zevgEv-vimned-ditva8',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 date_from: today,
    //                 date_to: nextSixMonth,
    //                 fields: [
    //                     'event_id',
    //                     'id',
    //                     'title',
    //                     'image',
    //                     'url',
    //                     'price',
    //                     'address',
    //                     'from_date',
    //                     'full_text',
    //                     'place_id',
    //                     'main_category_id',
    //                 ],
    //                 page: index,
    //                 limit: limit,
    //             }),
    //         });

    //         if (!res.ok) {
    //             throw new Error('Ошибка получения task_id: ', res.statusText);
    //         };

    //         const result = await res.json();

    //         console.log('result для пагинации', result);

    //         let newEvents = [];

    //         if (result.task_id) {
    //             const taskId = result.task_id;

    //             console.log('есть result.task_i')

    //             const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

    //             try {

    //                 const statusResponse = await fetch(statusUrl, {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': 'Bearer zevgEv-vimned-ditva8',
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });

    //                 if (!statusResponse.ok) {
    //                     throw new Error('Ошибка запроса данных: ', statusResponse.statusText);
    //                 }

    //                 const statusResult = await statusResponse.json();
    //                 console.log('statusResult', statusResult);

    //                 if (Array.isArray(statusResult)) {
    //                     newEvents = statusResult;
    //                 } else if (statusResult.events && Array.isArray(statusResult.events)) {
    //                     newEvents = statusResult.events;
    //                 } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
    //                     newEvents = statusResult.result.events;
    //                 } else {
    //                     console.log('Неизвестная структура данных');
    //                 }

    //                 console.log('newEvents', newEvents);

    //                 if (newEvents.length < limit) {
    //                     setHasMore(false);
    //                 }

    //                 return newEvents;

    //             } catch (error) {
    //                 console.log(`Ошибка запроса: `, error);
    //             }
    //         } else {
    //             console.log('Возвращаем result без task_id', result)

    //             if (Array.isArray(result)) {
    //                 newEvents = result;
    //             } else if (result.result && Array.isArray(result.result)) {
    //                 newEvents = result.result;
    //             } else if (result.result.events && Array.isArray(result.result.events)) {
    //                 newEvents = result.result.events;
    //             } else {
    //                 console.log('Неизвестная структура данных');
    //             }

    //             console.log('newEvents', newEvents);

    //             if (newEvents.length < limit) {
    //                 setHasMore(false);
    //             }

    //             return newEvents;
    //         }
    //     } catch (error) {
    //         console.log('Ошибка создания задачи', error);
    //     }
    // };

    // const {
    //     data,
    //     error,
    //     isLoading,
    // } = useSWR(`/api/data?page=${index}`,
    //     fetcher);

    // if (isLoading) console.log('ЗАГРУЗКА');
    // if (error) console.log('ОШИБКА', error.info);
    // console.log('Загруженные данные: ', data);

    // const loadMoreEvents = () => {
    //     if (isLoading || !hasMore) return;
    //     const nextPage = index + 1;
    //     setIndex(nextPage);
    //     console.log('дополнить loadMoreEvents после пагинации');
    // };

    // Создаем кэш и функцию по поиску Id
    
    const { cache } = useSWRConfig();
    console.log('cache', cache, cache.size);
    // const [events, setEvents] = useState();

    const findDataById = (id) => {
        const keys = Array.from(cache.keys());
        for (const key of keys) {
            const cachedData = cache.get(key);
            if (cachedData && Array.isArray(cachedData.data)) {
                const item = cachedData.data.find((item) => item.id === id);
                if (item) {
                    return item;
                }
            }
        }
        return null;
    };

    // let events = [];
    // const eventById = {};

    // if (cache.size > 0) {
    //     for (let i = 0; i < cache.size; i++) {
    //         const cachedData = cache.get(`/api/data?page=${i}`)?.data;
    //         console.log('cachedData', cachedData);
    //         if (Array.isArray(cachedData)) {
    //             cachedData.forEach(event => {
    //                 eventById[event.id] = event;
    //             });
    //             events.push(...cachedData);
    //         }
    //     }
    // }

    // console.log('events (события на странице)', events);
    // console.log('eventById (события по id)', eventById);

    // console.log('events', events);

    const localStorageProvider = () => {
        const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'));
        window.addEventListener('beforeunload', () => {
          const appCache = JSON.stringify(Array.from(map.entries()));
          localStorage.setItem('app-cache', appCache);
        });
      
        return map;
      };
      
    return (
        // <SWRConfig value={{ provider: typeof window !== 'undefined' ? localStorageProvider : () => new Map() }}>
            <EventsContext.Provider
                value={{
                    cache, 
                    findDataById, 
                }}
            >
                {children}
            </EventsContext.Provider>
        // </SWRConfig>
    );
};