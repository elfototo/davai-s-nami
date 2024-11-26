'use client';

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const Posts = ({ events, setEvents, category, startDate, search, endDate, sortPrice, selectedTags }) => {
    const [status, setStatus] = useState(null);
    const [sortedEvents, setSortedEvents] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                let res = await fetch('http://159.223.239.75:8005/api/get_valid_events/', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer zevgEv-vimned-ditva8',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date_from: '2024-11-24',
                        date_to: '2024-11-30',
                        fields: ['event_id', 'title', 'image', 'price', 'address','from_date','full_text', 'main_category_id'],
                        limit: 50,
                        page: 0,
                    })
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
                                'Content-Type': 'application/json'
                            },
                        });

                        if (!statusResponse.ok) {
                            throw new Error(`Ошибка: ${statusResponse.statusText}`);
                        };

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
                }, 10000);
            } catch (error) {
                console.log('Ошибка при создании задачи', error);
                setStatus('Ошибька при создании задачи');
            }
        }

        fetchPosts();
    }, []);

    useEffect(() => {
        if (!events || events.length === 0) return;

        const getCategoryNameById = (id) => {
            const categoryObj = categoriesID.find((cat) => cat.id === id);
            return categoryObj ? categoryObj.category : null;
        };

        const filteredEvents = events.filter((event) => {
            const eventCategoryName = getCategoryNameById(event.main_category_id);
            const matchesCategory = !category || eventCategoryName === category;

            const eventDate = dayjs(event.from_date).utcOffset(+3).startOf('day');
            const isInDateRange = (!startDate || eventDate.isSameOrAfter(startDate, 'day')) &&
                (!endDate || eventDate.isSameOrBefore(endDate, 'day'));

            const matchesSearch = search
                ? (event.title?.toLowerCase() || '').includes(search.toLowerCase())
                : true;

            const matchesTags = selectedTags.length === 0 || selectedTags.includes(eventCategoryName);

            return matchesCategory && isInDateRange && matchesSearch && matchesTags;
        });

        const sorted = sortPrice
            ? filteredEvents.sort((a, b) => (sortPrice === 'asc' ? a.price - b.price : b.price - a.price))
            : filteredEvents;

        setSortedEvents(sorted);
    }, [events, category, search, sortPrice]); // add dependencies

    if (!sortedEvents.length) return <div>Loading...</div>;

    return (
        <>
            {
                sortedEvents.length > 0 ? (
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
                            id={card.event_id}
                            data={card}
                            image={card.image}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600 text-lg font-semibold">
                        Нет доступных событий.
                    </p>
                )
            }
        </>
    );
};

export default Posts;
