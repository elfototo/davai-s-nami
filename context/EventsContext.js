// EventsContext.js

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { unstable_cache } from 'next/cache';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

// Создаем контекст
const EventsContext = createContext();

// Экспортируем хук для использования контекста
export const useEvents = () => {
    return useContext(EventsContext);
};

// Компонент-поставщик контекста
export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                let res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer zevgEv-vimned-ditva8',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date_from: '2024-11-24',
                        date_to: '2024-12-31',
                        fields: ['event_id', 'id', 'title', 'image', 'price', 'address', 'from_date', 'full_text', 'main_category_id'],
                        limit: 50,
                        page: 0,
                    }),
                });
                if (!res.ok) {
                    throw new Error(`Ошибка: ${res.statusText}`);
                }
                let result = await res.json();
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

                        if (Array.isArray(statusResult)) {
                            setEvents(statusResult);
                            setStatus('Задача выполнена');
                        } else if (statusResult.events && Array.isArray(statusResult.events)) {
                            setEvents(statusResult.events);
                        } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
                            setEvents(statusResult.result.events);
                        } else {
                            console.error('Неизвестная структура данных:', statusResult);
                            setStatus('Не удалось обработать данные');
                        }
                    } catch (error) {
                        console.log('Ошибка при запросе статуса: ', error);
                        setStatus('Ошибка при выполнении задачи');
                    }
                }, 1000);
            } catch (error) {
                console.log('Ошибка при создании задачи', error);
                setStatus('Ошибька при создании задачи');
            }
        }

        fetchPosts();
    }, []);

    return (
        <EventsContext.Provider value={{ events, status, setEvents }}>
            {children}
        </EventsContext.Provider>
    );
};
