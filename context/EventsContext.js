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
    const [hasMoreByTags, setHasMoreByTags] = useState(true)

    let today = dayjs().format('YYYY-MM-DD');
    let nextMonth = dayjs().add(1, 'month').format('YYYY-MM-DD');
    const limit = 20;

    const fetchPosts = async () => {
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
                    page: currentPage,
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.statusText}`);
            }

            const result = await res.json();
            console.log('Task created: ', result);

            const taskId = result.task_id;
            const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;


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

                console.log('newEvents', newEvents);

                setEvents((prevEvents) => {
                    const seenIds = new Set(prevEvents.map(event => event.id));
                    const uniqueEvents = newEvents.filter(event => !seenIds.has(event.id));
                    return [...prevEvents, ...uniqueEvents];
                });
                
                // Если меньше, чем лимит, значит данных больше нет
                if (newEvents.length < limit) {
                    setHasMore(false);
                }

                // return newEvents;

            } catch (error) {
                console.log('Ошибка при запросе статуса: ', error);
                setStatus('Ошибка при выполнении задачи');
            }

        } catch (error) {
            console.log('Ошибка при создании задачи', error);
            setStatus('Ошибка при создании задачи');
        } finally {
            setIsLoadingPage(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage]);

    console.log('Загруженные события: ', events);

    const loadMoreEvents = () => {
        if (isLoadingPage || !hasMore) return;
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    console.log('номер пагинации ', currentPage);

    // Запрос по категории с лимитом

    const fetchTagEvents = async (main_category_id, limit) => {
        try {
            const res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer zevgEv-vimned-ditva8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
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
                    main_category_id: main_category_id,
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.statusText}`);
            }

            const result = await res.json();
            console.log('Task created: ', result);

            const taskId = result.task_id;
            const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

            // Переходим к статусу
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
            console.log('statusResult category task', statusResult);

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

            setEvents((prevEvents) => {
                const seenIds = new Set(prevEvents.map(event => event.id));
                const uniqueEvents = newEvents.filter(event => !seenIds.has(event.id));
                return [...prevEvents, ...uniqueEvents];
            });

            if (newEvents.length < limit) {
                setHasMoreByTags(false);
            };


        } catch (error) {
            console.log('Ошибка выполнения задачи', error);
        }
    };

    return (
        <EventsContext.Provider
            value={{
                events,
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