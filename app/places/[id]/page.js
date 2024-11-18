'use client'

import { places, data } from '../../data/events';
import { useState } from 'react';
import Image from 'next/image';
import Card from '../../components/Card';


export default function eventPlace({ params }) {

    const [events, setEvents] = useState(data);

    

    const { id } = params;
    const place = places.find(event => event.id === parseInt(id));

    const filteredPlace = events.filter((event) => event.place_id === place.id)

    if (!place) {
        return <div>Место не найдено</div>;
    }

    return (
        <div className='relative max-w-custom-container mx-auto'>
            <div className='flex'>

                <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

                    <div className='lg:flex lg:items-center bg-[#fff] rounded-xl p-10'>

                        <div className='overflow-hidden shadow-xl h-96'>
                            <Image className='object-cover object-center w-full lg:w-[32rem] rounded-lg h-96  cursor-pointer hover:scale-105 transform transition-all duration-300'
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
                    {filteredPlace.length > 0 ? 
                    <h1 className='font-roboto font-bold'>Мероприятия в этом месте</h1>
                    :
                    <h1 className='font-roboto font-bold'>Мероприятий в блийшее время нет</h1>
                    }
                    
                    
                    <div className='grid gap-3 grid-cols-2 md:grid-cols-4 items-center justify-center'>
                        {filteredPlace.map((card) => (
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