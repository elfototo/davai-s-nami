'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CalendarModal from './Calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useSearchParams } from 'next/navigation';
import timezone from 'dayjs/plugin/timezone';
import { categoriesID } from '../data/events';
import { IoClose } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);


const Filtres = ({ selectedTags, setSelectedTags, setBgColor, startDate, setStartDate, endDate, setEndDate, isOpen, setIsOpen, }) => {
    const [selectedButton, setSelectedButton] = useState('');
    const [selectedDate, setSelectedDate] = useState('');


    const searchParams = useSearchParams();
    const category = searchParams.get('category') || '';

    const categoryTags = {
        'Культура': ['Культура', 'Театр', 'Перформанс'],
        'Кино': ['Кино'],
        'Лекции': ['Лекция'],
        'Вечеринки': ['Фестиваль', 'Вечеринка'],
        'Музыка': ['Концерт', 'Фестиваль'],
        'Представления': ['Концерт', 'Театр', 'Перформанс', 'Стендап'],
    };

    useEffect(() => {
        if (category && categoryTags[category]) {
            setSelectedTags(categoryTags[category]);
        } else if (category === 'Сегодня') {
            selectToday();
        } else if (category === 'Завтра') {
            selectTomorrow();
        } else if (category === 'Выходные') {
            selectWeekends();
        }
    }, [category, setSelectedTags]);

    const toggleFilter = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleTag = (tag) => {
        setSelectedTags((prev) => {
            if (prev.includes(tag)) {
                return prev.filter((selectedTag) => selectedTag !== tag);
            } else {
                return [...prev, tag];
            }
        });
    };

    const selectToday = () => {
        if (selectedButton === 'today') {
            setStartDate(null);
            setEndDate(null);
            setSelectedButton('');
        } else {
            const todayDate = dayjs().utc().tz('Europe/Moscow').startOf('day');
            setStartDate(todayDate);
            setEndDate(todayDate);
            setSelectedButton('today');
            setSelectedDate('');
        }

    };

    const selectTomorrow = () => {
        if (selectedButton === 'tomorrow') {
            setStartDate(null);
            setEndDate(null);
            setSelectedButton('');
        } else {
            const tomorrowDate = dayjs().add(1, 'day').utc().tz('Europe/Moscow').startOf('day');
            setStartDate(tomorrowDate);
            setEndDate(tomorrowDate);
            setSelectedButton('tomorrow');
            setSelectedDate('');
        }

    };

    const selectWeekends = () => {
        if (selectedButton === 'weekend') {
            setStartDate(null);
            setEndDate(null);
            setSelectedButton('');
        } else {
            const startOfWeekend = dayjs().isoWeekday(6).utc().tz('Europe/Moscow').startOf('day');
            const endOfWeekend = startOfWeekend.add(1, 'day');
            setStartDate(startOfWeekend);
            setEndDate(endOfWeekend);
            setSelectedButton('weekend');
            setSelectedDate('');
        }
    };

    const selectDate = () => {
        if (selectedButton === 'date') {
            // Сброс даты, если нажали на кнопку
            setStartDate(null);
            setEndDate(null);
            setSelectedDate('');
            setSelectedButton('');
        } else if (startDate && endDate && selectedButton !== 'today' && selectedButton !== 'tomorrow' && selectedButton !== 'weekend') {
            // Форматируем дату
            const rangeStartDate = startDate.utc().tz('Europe/Moscow').startOf('day').format('DD MMM');
            const rangeEndDate = endDate.utc().tz('Europe/Moscow').startOf('day').format('DD MMM');

            const dateRange = rangeStartDate === rangeEndDate ? rangeStartDate : `${rangeStartDate} - ${rangeEndDate}`;

            // Устанавливаем новую дату
            setSelectedDate(dateRange);
            setSelectedButton('date');
        }
    };


    const buttons = [
        { id: "today", label: "Сегодня", onClick: selectToday },
        { id: "tomorrow", label: "Завтра", onClick: selectTomorrow },
        { id: "weekend", label: "Выходные", onClick: selectWeekends },
    ];

    useEffect(() => {
        if (startDate && endDate && selectedButton !== 'today' && selectedButton !== 'tomorrow' && selectedButton !== 'weekend') {
            const rangeStartDate = startDate.utc().tz("Europe/Moscow").startOf("day").format("DD MMM");
            const rangeEndDate = endDate.utc().tz("Europe/Moscow").startOf("day").format("DD MMM");

            const dateLabel = rangeStartDate === rangeEndDate ? rangeStartDate : `${rangeStartDate} - ${rangeEndDate}`;

            setSelectedDate(dateLabel);
            setSelectedButton("date"); // Устанавливаем активную кнопку без бесконечного ререндера
        }
    }, [startDate, endDate]);

    if (startDate && endDate && selectedDate) {
        buttons.push({ id: "date", label: selectedDate, onClick: selectDate });
    }

    const allButtons = [
        ...categoriesID.map((category) => ({
            id: category.id,
            label: category.category,
            icon: category.icon,
            color: category.color,
            onClick: () => toggleTag(category.category),
        })),
        ...buttons,
    ];


    // Сортируем кнопки: активные идут в начало
    const sortedButtons = [...allButtons].sort((a, b) => {
        const aActive = selectedButton === a.id || selectedTags.includes(a.label);
        const bActive = selectedButton === b.id || selectedTags.includes(b.label);

        return bActive - aActive; // Если b активен, он идет выше
    });

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setBgColor('bg-white');
        setSelectedButton('');
        setSelectedTags([]);
    };

    const cancelFilter = () => {
        clearSelection();
        toggleFilter();
    };

    return (
        <div className={`${isOpen ? 'bg-white' : 'bg-[#f4f4f9]'} relative rounded-lg lg:bg-white lg:border lg:border-[#D9D9D9] lg:shadow-lg`}>
            <div className={`${isOpen ? 'absolute' : 'block'}`}>

                <div className='lg:hidden px-2 py-2 flex justify-start -mx-2 overflow-y-auto whitespace-nowrap scroll-hidden'>
                    <button onClick={toggleFilter} className={`flex mr-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${selectedButton.length > 0 || selectedTags.length > 0 || endDate || startDate ? "bg-pink-400 text-white " : "bg-[#fff]"
                        } ${!isOpen ? 'block' : 'hidden'}`}>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                        </svg>
                    </button>

                    {sortedButtons.map((button) => (
                        <button
                            key={button.id}
                            onClick={button.onClick}
                            className={`mx-3 text-[1rem] items-center justify-center py-1 px-2 rounded-md flex ${selectedButton === button.id || selectedTags.includes(button.label) || (button.id === "date") ? "bg-pink-400 text-white " : "bg-[#fff]"
                                } ${!isOpen ? 'block' : 'hidden'}`}
                        >
                            {button.label}
                            {(selectedButton === button.id || selectedTags.includes(button.label) || (button.id === "date")) && button.label ? <IoClose size={18} className='mt-[3px] ml-2' />
                                : ''}

                        </button>
                    ))}

                </div>

                {selectedButton.length > 0 || selectedTags.length > 0 || endDate || startDate ?
                    <button onClick={clearSelection} className={`mr-3 lg:hidden font-medium text-[1rem] text-red-500 items-center justify-center py-1 flex rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        <IoIosCloseCircle size={16} className=' mt-[2px] mr-1' />
                        Сбросить фильтры
                    </button>
                    : ''
                }
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full p-4 relative`}>
                <div>
                    <div className="mb-5">
                        <div className='flex justify-between items-baseline  mb-3'>
                            <h3 className="text-lg">Когда</h3>
                            <Link href="/events">
                                <div className='underline text-blue-600' onClick={cancelFilter}>
                                    Отмена
                                </div>
                            </Link>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button onClick={selectToday} className={`${selectedButton === 'today' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 py-2 rounded-md`}>Сегодня</button>
                            <button onClick={selectTomorrow} className={`${selectedButton === 'tomorrow' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 py-2 rounded-md`}>Завтра</button>
                        </div>
                        <div className='flex justify-center items-center mt-2'>
                            <button onClick={selectWeekends} className={`${selectedButton === 'weekend' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 lg:w-full py-2 px-4 rounded-md`}>Выходные</button>
                        </div>
                        <div className='flex lg:flex-col items-start justify-center w-full mt-2'>
                            {/* CalendarModal with passed props */}
                            <CalendarModal
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                setSelectedButton={setSelectedButton}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg mb-2">Категории</h3>
                        <div className='flex flex-wrap'>
                            {categoriesID.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.category)}
                                    className={`mx-1 my-1 py-1 px-4 text-left rounded-full ${selectedTags.includes(tag.category) ? 'bg-pink-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {tag.category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button
                            onClick={toggleFilter}
                            className="lg:hidden font-roboto mt-5 w-full py-4 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg shadow-lg transform transition-transform duration-300 hover:bg-pink-400"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filtres;