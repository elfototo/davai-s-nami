import { useState, useEffect } from 'react';
import 'dayjs/locale/ru';
dayjs.locale('ru');
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import useSWR, { SWRConfig } from 'swr';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import useSWRInfinite from "swr/infinite";

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);


export const SWRProvider = ({ children }) => {

    const [pageIndex, setPageIndex] = useState(0);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 8;

    let today = dayjs().format('YYYY-MM-DD');
    let nextSixMonth = dayjs().add(6, 'month').format('YYYY-MM-DD');

    const fetcher = async () => {
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
                    date_to: nextSixMonth,
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
                    page: pageIndex,
                    limit: limit,
                }),
            });

            if (!res.ok) {
                throw new Error('Ошибка получения task_id: ', res.statusText);
            };

            const result = await res.json();

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
                    throw new Error('Ошибка запроса данных: ', statusResponse.statusText);
                }

                const statusResult = await statusResponse.json();
                console.log('statusResult', statusResult);

                let newEvents = [];

                if (Array.isArray(statusResult)) {
                    newEvents = statusResult;
                } else if (statusResult.events && Array.isArray(statusResult.events)) {
                    newEvents = statusResult.events;
                } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
                    newEvents = statusResult.result.events;
                } else {
                    console.log('Неизвестная структура данных');
                }

                console.log('newEvents', newEvents);

                if (newEvents.length < limit) {
                    setHasMore(false);
                }

                return newEvents;

            } catch (error) {
                console.log(`Ошибка запроса: `, error);
            }

        } catch (error) {
            console.log('Ошибка создания задачи', error);
        } finally {
            setIsLoadingPage(false);
        }
    };

    const {
        data,
        error,
        isLoading,
        // isValidating,
        // mutate,
        // size,
        // setSize
    } = useSWR(`/api/data?page=${pageIndex}`,
        fetcher);

    if (isLoading) console.log('ЗАГРУЗКА');
    if (error) console.log('ОШИБКА', error.info);
    console.log('Загруженные данные: ', data);

    const loadMoreEvents = () => {
        // if (isLoading || !hasMore) return;
        // const nextPage = pageIndex + 1;
        // setPageIndex(nextPage);
        console.log('дополнить loadMoreEvents после пагинации');
    };

    function localStorageProvider() {
        // При инициализации мы восстанавливаем данные из `localStorage` в Map.
        const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))

        // Перед выгрузкой приложения мы записываем все данные обратно в `localStorage`.
        window.addEventListener('beforeunload', () => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            localStorage.setItem('app-cache', appCache)
        })

        // Мы по-прежнему используем map для записи и чтения для производительности.
        return map;
    }

    return (
        <SWRConfig value={{ provider: typeof window !== 'undefined' ? localStorageProvider : () => new Map() }}>
            {children}
        </SWRConfig>
    );
};