'use client';

import { useState } from 'react';
import CalendarModal from './Calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);

const Filtres = ({ selectedTags, setSelectedTags, setBgColor, startDate, setStartDate, endDate, setEndDate, setSortPrice, isOpen, setIsOpen }) => {
    const [selectedButton, setSelectedButton] = useState('');

    const tags = ['Концерт', 'Выставка', 'Танцы', 'Мастер-класс', 'Интервью', 'Кино', 'Перформанс', 'Лекция', 'Вечеринка', 'Театр', 'Фестиваль', 'Искусство', 'Экскурсия', 'Музыка', 'Стендап', 'Другое'];

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
        const todayDate = dayjs().utc(+3).startOf('day');
        setStartDate(todayDate);
        setEndDate(todayDate);
        setSelectedButton('today');
    };

    const selectTomorrow = () => {
        const tomorrowDate = dayjs().add(1, 'day').utc(+3).startOf('day');
        setStartDate(tomorrowDate);
        setEndDate(tomorrowDate);
        setSelectedButton('tomorrow');
    };

    const selectWeekends = () => {
        const startOfWeekend = dayjs().isoWeekday(6).utc(+3).startOf('day');
        const endOfWeekend = startOfWeekend.add(1, 'day');
        setStartDate(startOfWeekend);
        setEndDate(endOfWeekend);
        setSelectedButton('weekend');
    };

    const selectPrice = () => {
        setSelectedButton('price');
        setSortPrice((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setBgColor('bg-white');
        setSelectedButton('');
        setSelectedTags([]);
        setSortPrice('default');
    };

    const cancelFilter = () => {
        clearSelection();
        toggleFilter();
    };

    return (
        <div className={`${isOpen ? 'bg-white' : 'bg-[#f4f4f9]'} relative rounded-lg lg:bg-white lg:border lg:border-[#D9D9D9] lg:shadow-lg`}>
            <div className={`${isOpen ? 'absolute' : 'block'}`}>
                <div className='lg:hidden px-2 py-2 flex justify-start -mx-3 overflow-y-auto whitespace-nowrap scroll-hidden'>
                    <button onClick={toggleFilter} className={` flex mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                        </svg>
                    </button>

                    <button onClick={selectPrice} className={`hover:bg-gray-100 flex mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-1">
                            <path fillRule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                        Цена
                    </button>
                    <button onClick={selectToday} className={`${selectedButton === 'today' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-[#fff]  hover:bg-gray-100'} mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        Сегодня
                    </button>
                    <button onClick={selectTomorrow} className={`${selectedButton === 'tomorrow' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-[#fff]  hover:bg-gray-100'} mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        Завтра
                    </button>
                    <button onClick={selectWeekends} className={`${selectedButton === 'weekend' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-[#fff]  hover:bg-gray-100'} mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        Выходные
                    </button>
                    <button onClick={clearSelection} className={`bg-[#fff]  hover:bg-gray-100 mx-3 text-[1rem] items-center justify-center py-1 px-2 rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        Сбросить фильтр
                    </button>
                </div>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full p-4 relative`}>
                <div>
                    <div className="mb-5">
                        <div className='flex justify-between items-baseline  mb-3'>
                            <h3 className="text-lg">Когда</h3>
                            <button className='underline text-blue-600' onClick={cancelFilter}>
                                Отмена
                            </button>
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
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg mb-2">Категории</h3>
                        <div className='flex flex-wrap'>
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`mx-1 my-1 py-1 px-4 text-left rounded-full ${selectedTags.includes(tag) ? 'bg-pink-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >   
                                    {tag}
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