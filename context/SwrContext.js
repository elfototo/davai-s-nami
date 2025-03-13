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

    const { cache } = useSWRConfig();
    console.log('cache', cache, cache.size);

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
    

    const findDataByIdPlace = (place_id) => {
        const keys = Array.from(cache.keys());
        let results = [];

        for (const key of keys) {
            const cachedData = cache.get(key);

            console.log('cachedData в кэше', cachedData);
            if (cachedData && Array.isArray(cachedData.data)) {
                const matchedItems = cachedData.data.filter((item) => item.place_id === place_id);
                results = results.concat(matchedItems);
            }
        }
        const uniqueResults = results.filter((event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
        );

        console.log('results cache', results)
        return results.length > 0 ? uniqueResults : null;
    };

    // Функция преобразования ссылок https://ucare.timepad.ru 
    const convertImageUrlToJpeg = (url) => {
        if (url && url.startsWith('https://ucare.timepad.ru')) {
            if (!url.includes('-/format/jpeg/')) {
                return `${url}-/format/jpeg/`
            }
        }
        return url;
    };

    return (
        <EventsContext.Provider
            value={{
                cache,
                findDataById,
                findDataByIdPlace,
                convertImageUrlToJpeg
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};