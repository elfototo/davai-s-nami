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

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);


export default function eventPlace({ params }) {

    // const [events, setEvents] = useState(data);
    const { cache } = useEvents();
    const [eventsInPlace, setEventsInPlace] = useState([]);
    const { id } = params;
    console.log(id);
    const place = places.find(event => event.id === Number(id));

    console.log(place);

    const todayforcount = dayjs().utc().tz('Europe/Moscow').startOf('day');
    const today = todayforcount.format('YYYY-MM-DD');

    const fetchIdPlace = async (id) => {
        try {
            const res = await fetch(`http://159.223.239.75:8005/api/get_valid_events/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer zevgEv-vimned-ditva8',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date_from: today,
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
                    limit: 4,
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка поиска id ${res.statusText}`);
            }

            const result = await res.json();

            console.log('result на странице place id', result);

            if (result.task_id) {
                try {
                    setTimeout(async () => {

                        const taskId = result.task_id;
                        const statusUrl = `http://159.223.239.75:8005/api/status/${taskId}`;

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

                        if (statusResult && Array.isArray(statusResult)) {
                            console.log('statusResult на странице id', statusResult.result);
                            return statusResult;
                        } else if (statusResult.result && Array.isArray(statusResult.result)) {
                            console.log('statusResult.result на странице id', statusResult.result);
                            return statusResult.result;
                        } else if (statusResult.result.events && Array.isArray(statusResult.result.events)) {
                            console.log('result.result.events на странице id', statusResult.result.events);
                            return statusResult.result.events[0];
                        } else {
                            console.error('Неизвестная структура данных:', statusResult);
                        };
                    });

                } catch (error) {
                    console.log('Ошибка при запросе', error);
                }
            } else {
                if (result && Array.isArray(result)) {
                    console.log('result на странице id', result.result);
                    return result;
                } else if (result.result && Array.isArray(result.result)) {
                    console.log('result.result на странице id', result.result);
                    return result.result;
                } else if (result.result.events && Array.isArray(result.result.events)) {
                    console.log('result.result.events на странице id', result.result.events);
                    return result.result.events;
                } else {
                    console.error('Неизвестная структура данных:', result);
                }
            }
        } catch (error) {
            console.log('Ошибка при запросе:', error);
            return null;
        }
    };

    const {
        data: dataPlaceId,
        error: errorPlaceId,
        isLoading: isLoadingPlaceId
    } = useSWR(
        place.id ? `/api/data?id=${place.id}` : null,
        () => fetchIdPlace(place.id), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    }
    );

    console.log('dataPlaceId', dataPlaceId)

    useEffect(() => {
        if (!isLoadingPlaceId && dataPlaceId) {
            setEventsInPlace(dataPlaceId);
        }

    }, [dataPlaceId])

    const filteredPlace = dataPlaceId?.filter((event) => event.place_id === place.id);

    if (!place) {
        return <div>Место не найдено</div>;
    }

    return (
        <div className='relative max-w-custom-container mx-auto'>
            <div className='flex'>

                <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

                    <div className='lg:flex lg:items-center bg-[#fff] rounded-xl p-10'>

                        <div className='overflow-hidden rounded-xl shadow-xl h-96'>
                            <Image className='object-cover object-center w-full lg:w-[32rem] h-96 cursor-pointer 
                             hover:scale-105 transform transition-all duration-300'
                                src={place.image || '/img/cat.png'}
                                width={1000}
                                height={1000}
                                alt="avatar"
                            />
                        </div>

                        <div className='mt-8 lg:px-10 lg:mt-0'>

                            <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5 mx-1">
                                {place.place_name}
                            </h1>

                            <div className='mx-1 mb-3 p-5 bg-[#f4f4f9] rounded-2xl w-full lg:min-w-[300px]'>
                                <div className='flex mb-3'>
                                    <p className='text-[#777]'>Метро: </p>
                                    <p className='font-roboto text-[#333] text-gray-[#333]  lg:w-72 ml-[20px]'>
                                        {place.place_metro}</p>
                                </div>

                                <div className='flex items-baseline mt-3 '>
                                    <p className='text-[#777]'>Адрес: </p>


                                    <p className='font-roboto text-[#333] ml-6'>
                                        {place.place_address}</p>

                                </div>
                            </div>
                            <div className='flex'>
                            </div>
                        </div>

                    </div>
                    {eventsInPlace?.length > 0 ?
                        <h1 className='font-roboto font-bold'>Мероприятия в этом месте</h1>
                        :
                        <h1 className='font-roboto font-bold'>Мероприятий в блийшее время нет</h1>
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