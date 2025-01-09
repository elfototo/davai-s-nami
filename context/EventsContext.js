'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const EventsContext = createContext();

export const useEvents = () => {
    return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [allEventsCache, setAllEventsCache] = useState([]);
    const [status, setStatus] = useState(null);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    let today = dayjs().format('YYYY-MM-DD');
    let nextMonth = dayjs().add(1, 'month').format('YYYY-MM-DD');
    const limit = 20;

    const fetchPosts = async (page = 0) => {
        setIsLoadingPage(true);
        try {
            const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer zevgEv-vimned-ditva8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date_from: today,
                    date_to: nextMonth,
                    fields: [
                        'event_id',
                        'id',
                        'title',
                        'image',
                        'url',
                        'price',
                        'address',
                        'from_date',
                        'full_text',
                        'place_id',
                        'main_category_id',
                    ],
                    limit: limit,
                    page: page,
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.statusText}`);
            }

            const result = await res.json();
            console.log('Task created: ', result);

            const taskId = result.task_id;
            const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

            setTimeout(async () => {
                try {
                    const statusResponse = await fetch(statusUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer zevgEv-vimned-ditva8',
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!statusResponse.ok) {
                        throw new Error(`Ошибка: ${statusResponse.statusText}`);
                    }

                    const statusResult = await statusResponse.json();
                    console.log('Status result', statusResult);

                    let newEvents = [];
                    if (Array.isArray(statusResult)) {
                        newEvents = statusResult;
                    } else if (statusResult.events && Array.isArray(statusResult.events)) {
                        newEvents = statusResult.events;
                    } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
                        newEvents = statusResult.result.events;
                    } else {
                        console.error('Неизвестная структура данных:', statusResult);
                        setStatus('Не удалось обработать данные');
                        return;
                    }

                    // Если меньше, чем лимит, значит данных больше нет
                    if (newEvents.length < limit) {
                        setHasMore(false);
                    }

                    setEvents((prevEvents) => {
                        const seenIds = new Set(prevEvents.map(event => event.event_id));
                        const uniqueEvents = newEvents.filter(event => !seenIds.has(event.event_id));
                        return [...prevEvents, ...uniqueEvents];
                    });

                    setAllEventsCache((prevCache) => {
                        const seenIds = new Set(prevCache.map(event => event.event_id));
                        const uniqueEvents = newEvents.filter(event => !seenIds.has(event.event_id));
                        return [...prevCache, ...uniqueEvents];
                    });
                } catch (error) {
                    console.log('Ошибка при запросе статуса: ', error);
                    setStatus('Ошибка при выполнении задачи');
                }
            }, 1000);
        } catch (error) {
            console.log('Ошибка при создании задачи', error);
            setStatus('Ошибка при создании задачи');
        } finally {
            setIsLoadingPage(false);
        }
    };

    // Загрузка первой страницы при монтировании
    useEffect(() => {
        fetchPosts(currentPage);
    }, []);

    // Функция для загрузки следующей страницы
    const loadMoreEvents = () => {
        if (isLoadingPage || !hasMore) return;
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchPosts(nextPage);
    };

    // const getKey = (pageIndex, previousPageData, limit, today, nextMonth) => {
    //     if (previousPageData && !previousPageData.result?.events?.length) return null; // Остановить пагинацию

    //     return [
    //         'http://159.223.239.75:8005/api/get_valid_events/',
    //         {
    //             date_from: today,
    //             date_to: nextMonth,
    //             fields: [
    //                 'event_id',
    //                 'id',
    //                 'title',
    //                 'image',
    //                 'url',
    //                 'price',
    //                 'address',
    //                 'from_date',
    //                 'full_text',
    //                 'place_id',
    //                 'main_category_id',
    //             ],
    //             limit: limit,
    //             page: pageIndex,
    //         },
    //     ];
    // };



    return (
        <EventsContext.Provider
            value={{
                events,
                allEventsCache,
                status,
                setEvents,
                loadMoreEvents,
                hasMore,
                isLoadingPage,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};