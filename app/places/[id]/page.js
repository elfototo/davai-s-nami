'use client'

import { places, data } from '../../data/events';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Card from '../../components/Card';
import { useEvents } from '../../../context/SwrContext';
import useSWR, { SWRConfig } from 'swr';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import { API_URL, API_URL_PL, SEARCH_URL, API_HEADERS, API_URL_PL_BY_ID } from '../../../config';
import BackButton from '../../components/BackButton';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);


export default function EventPlace({ params }) {

    const { cache, findDataByIdPlace } = useEvents();

    const [eventsInPlace, setEventsInPlace] = useState([]);
    const [place, setPlace] = useState(null);

    const { id } = params;
    console.log('id', typeof parseInt(id));

    const idNumber = parseInt(id);

    const fetchPlaceById = async (id) => {
        try {
            const res = await fetch(`${API_URL_PL_BY_ID}${id}`, {
                method: 'POST',
                headers: API_HEADERS,
                body: JSON.stringify({
                    fields: [
                        'id',
                        'place_name',
                        'place_address',
                        'place_url',
                        'place_metro',
                        'place_image',
                    ],
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка поиска id ${res.statusText}`);
            }

            const result = await res.json();

            console.log('result на странице id', result);

            if (result && Array.isArray(result)) {
                console.log('result на странице id', result);
                return result[0];

            } else if (result.result && Array.isArray(result.result)) {
                console.log('result.result на странице id', result.result);
                return result.result[0];

            } else if (result.result.places && Array.isArray(result.result.places)) {
                console.log('result.result на странице id', result.result.places);
                // setPlace(result.result.places[0]);
                return result.result.places[0];

            } else if (result.places && Array.isArray(result.places)) {
                console.log('result.result.places на странице id', result.places);
                // setPlace(result.places[0]);
                return result.places[0];
            } else {
                console.error('Неизвестная структура данных:', result);
            }
        } catch (error) {
            console.log('Ошибка при запросе:', error);
            return null;
        }
    };

    const {
        data: dataPlaceById,
        error: errorPlaceByID,
        isLoading: isLoadingById
    } = useSWR(
        idNumber ? `/api/data?place_id=${idNumber}` : null,
        () => fetchPlaceById(idNumber)
    );


    // запрос мероприятий в этом места
    const fetchEventsInPlaceByID = async (id) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: API_HEADERS,
                body: JSON.stringify({
                    place: [id],
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
                    // limit: 4,
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка поиска id для events ${res.statusText}`);
            }

            const result = await res.json();

            console.log('result на странице place id  для events', result);


            if (result && Array.isArray(result)) {
                console.log('result на странице id для events', result);
                return result;
            } else if (result.result && Array.isArray(result.result)) {
                console.log('result.result на странице id для events', result.result);
                return result.result;
            } else if (result.result.events && Array.isArray(result.result.events)) {
                console.log('result.result.events на странице id для events', result.result.events);
                return result.result.events;
            } else if (result.events && Array.isArray(result.events)) {
                console.log('result.result.events на странице id для events', result.events);
                return result.events;
            } else {
                console.error('Неизвестная структура данных для events:', result);
            }

        } catch (error) {
            console.log('Ошибка при запросе для events:', error);
            return null;
        }
    };

    const {
        data: dataEventsByPlaceId,
        error: errorEventsPlaceId,
        isLoading: isLoadingEventsPlaceId
    } = useSWR(
        idNumber ? `/api/data?event_from_place=${idNumber}` : null,
        () => fetchEventsInPlaceByID(idNumber), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
    }
    );

    const cacheEvents = findDataByIdPlace(idNumber);
    console.log('cacheEvents', cacheEvents);

    useEffect(() => {
        let result = [];

        if (dataPlaceById && !isLoadingById) {
            setPlace(dataPlaceById);
            console.log('place в useEffect', place);
        }

        if (cacheEvents) {
            // Удаляем дубликаты внутри cacheEvents
            const uniqueCacheEvents = cacheEvents.filter((event, index, self) =>
                index === self.findIndex((e) => e.id === event.id)
            );

            setEventsInPlace(uniqueCacheEvents);
            console.log('Берем мероприятия из кэша', uniqueCacheEvents.length);
        }

        if (!isLoadingEventsPlaceId && dataEventsByPlaceId && cacheEvents?.length < 4) {
            // Объединяем массивы и снова убираем дубликаты
            result = [...cacheEvents, ...dataEventsByPlaceId]
                .filter((event, index, self) =>
                    index === self.findIndex((e) => e.id === event.id)
                );

            setEventsInPlace(result);
            console.log('делаем запрос мероприятий на сервер', result);
        }

    }, [dataPlaceById, isLoadingById, dataEventsByPlaceId, isLoadingEventsPlaceId, place]);



    if (isLoadingById || isLoadingEventsPlaceId || !place) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-violet-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute w-12 h-12 border-4 border-pink-300 border-solid border-r-transparent rounded-full animate-spin"></div>
                    <div className="absolute w-8 h-8 border-4 border-indigo-200 border-solid border-l-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (

        <div className='max-w-custom-container mx-auto relative'>
            {/* <BackButton className='lg:hidden'/> */}

            <div className='flex relative'>

                <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

                    <div className='lg:flex lg:items-center bg-[#fff] rounded-xl p-10'>

                        <div className='overflow-hidden rounded-xl shadow-xl h-60 md:h-96'>
                            <Image className='object-cover object-center w-full lg:w-[32rem] h-60 md:h-96  cursor-pointer 
                             hover:scale-105 transform transition-all duration-300'
                                src={place?.place_image || '/img/cat.png'}
                                width={1000}
                                height={1000}
                                alt="avatar"
                                priority
                            />
                        </div>

                        <div className='mt-8 lg:px-10 lg:mt-0'>

                            <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5 mx-1">
                                {place?.place_name}
                            </h1>

                            <div className='mx-1 mb-3 p-5 bg-[#f4f4f9] rounded-2xl w-full lg:min-w-[300px]'>
                                <div className='flex mb-3'>
                                    <p className='text-[#777]'>Метро: </p>
                                    <p className='font-roboto text-[#333] text-gray-[#333]  lg:w-72 ml-[20px]'>
                                        {place?.place_metro}</p>
                                </div>

                                <div className='flex items-baseline mt-3 '>
                                    <p className='text-[#777]'>Адрес: </p>


                                    <p className='font-roboto text-[#333] ml-6'>
                                        {place?.place_address}</p>

                                </div>
                            </div>
                            <div className='flex'>
                            </div>
                        </div>

                    </div>
                    {eventsInPlace?.length > 0 ?
                        <h1 className='font-roboto font-bold'>Мероприятия в этом месте</h1>
                        :
                        <h1 className='font-roboto font-bold'>Мероприятий в ближайшее время нет</h1>
                    }

                    <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto'>
                        {eventsInPlace?.map((card) => (
                            <Card
                                type='mini'
                                category={card.category}
                                price={card.price}
                                title={card.title}
                                from_date={card.from_date}
                                address={card.address}
                                key={card.event_id}
                                id={card.id}
                                data={card}
                                image={card.image} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
};