'use client';

import '../globals.css';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import timezone from 'dayjs/plugin/timezone';
import { IoMdClose } from "react-icons/io";


dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(timezone);


const daysInWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const CalendarModal = ({ startDate, setStartDate, endDate, setEndDate }) => {

    const [currentDate, setCurrentDate] = useState(dayjs().utc().tz('Europe/Moscow').startOf('day'));
    const [showCalendar, setShowCalendar] = useState(false);

    const today = dayjs().utc().tz('Europe/Moscow').startOf('day');

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
        if (!startDate) {
            setStartDate(today);
        }
    };

    const handleDateClick = (day) => {
        const dayJsDate = dayjs(day); // Convert clicked date to a Day.js object
        if (!startDate) {
            setStartDate(dayJsDate);
            setEndDate(null);
        } else if (!endDate) {
            if (dayJsDate.isBefore(startDate)) {
                setEndDate(startDate);
                setStartDate(dayJsDate);
            } else {
                setEndDate(dayJsDate);
            }
        } else {
            if (dayJsDate.isBefore(startDate)) {
                setStartDate(dayJsDate);
                setEndDate(null);
            } else if (dayJsDate.isAfter(endDate)) {
                setEndDate(dayJsDate);
            } else {
                setStartDate(dayJsDate);
                setEndDate(null);
            }
        };
        // console.log(startDate);
        // console.log(endDate);

    };

    const renderDays = () => {
        // First and last day of the current month using dayjs
        const firstDayOfMonth = dayjs(currentDate).startOf('month');
        const lastDayOfMonth = dayjs(currentDate).endOf('month');
        const days = [];

        // Empty cells for alignment
        for (let i = 0; i < firstDayOfMonth.day() - 1; i++) {
            days.push(<div key={`empty-${i}`} className='w-[2.25rem] h-[2.25rem]' />);
        }

        // Days of the month
        for (let day = 1; day <= lastDayOfMonth.date(); day++) {
            const date = dayjs(currentDate).utc().tz('Europe/Moscow').date(day); // Set the day in the current month
            const isToday = date.isSame(dayjs().utc().tz('Europe/Moscow').startOf('day'), 'day');
            const isStartSelected = startDate && date.isSame(dayjs(startDate).utc().tz('Europe/Moscow').startOf('day'), 'day');
            const isEndSelected = endDate && date.isSame(dayjs(endDate).utc().tz('Europe/Moscow').startOf('day'), 'day');

            const startDay = startDate ? dayjs(startDate).utc().tz('Europe/Moscow').startOf('day') : null;
            const endDay = endDate ? dayjs(endDate).utc().tz('Europe/Moscow').startOf('day') : null;

            const isInRange = startDay && endDay &&
                (date.isBetween(startDay, endDay, null, '[]') ||
                    date.isSame(startDay, 'day') ||
                    date.isSame(endDay, 'day'));

            const isFirstInRange = isStartSelected || date.isSame(startDay, 'day');;
            const isLastInRange = isEndSelected || date.isSame(endDay, 'day');;

            // Text color based on date
            const textColor = date.isBefore(dayjs().utc().tz('Europe/Moscow').startOf('day')) ? 'text-gray-400' : 'text-black';
            const isTodayClass = isToday ? 'border border-pink-400 rounded-full' : '';
            const isSelectedClass = isStartSelected || isEndSelected ? 'bg-pink-400 text-white' : '';
            const isInRangeClass = isInRange ? `bg-pink-200 ${isFirstInRange ? 'rounded-tl-[50%] rounded-bl-[50%]' : ''} ${isLastInRange ? 'rounded-tr-[50%] rounded-br-[50%]' : ''}`
                : 'rounded-full';

            days.push(
                <div key={`day-${day}`} className={`${isInRangeClass} w-[3rem] h-[3rem] flex items-center justify-center grid-item `}>
                    <div
                        className={`w-[3rem] h-[3rem] rounded-full leading-normal text-[1rem] flex items-center justify-center text-center cursor-pointer duration-200 transform transition-colors duration-[250ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)]
                            ${isTodayClass} ${isSelectedClass} hover:border-pink-400 hover:border-[1px] ${textColor}`}
                        onClick={() => handleDateClick(date)}
                    >
                        <span>{day}</span>
                    </div>
                </div>
            );
        }

        return days;
    };


    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            // Use dayjs to manipulate the month
            return dayjs(prevDate).utc().tz('Europe/Moscow').add(direction, 'month').toDate(); // Convert back to Date if needed
        });
    };

    const handleInputClick = () => {
        toggleCalendar();
    };


    return (
        <div className='relative w-full'>
            <div className='md:flex lg:block'>
                <div className='flex items-center justify-between w-1/2 lg:w-full border border-gray-300 rounded cursor-pointer text-[#777] text-center px-2 py-1 hover:bg-gray-50 transition duration-200 mx-auto mb-2 md:mb-0 md:mr-2 lg:mr-0 lg:mb-2'
                    onClick={handleInputClick}
                >
                    <div className='text-[1rem] whitespace-nowrap'>
                        {startDate && endDate
                            ? `${dayjs(startDate).utc().tz('Europe/Moscow').format('DD/MM/YYYY')}`
                            : startDate
                                ? `${dayjs(startDate).utc().tz('Europe/Moscow').format('DD/MM/YYYY')}`
                                : 'Начальная дата'}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#777]">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex items-center justify-between w-1/2 lg:w-full border border-gray-300 rounded cursor-pointer text-[#777] text-center px-2 py-1 hover:bg-gray-50 transition duration-200 mx-auto mt-2 md:mt-0 md:ml-2 lg:ml-0 lg:mt-2"
                    onClick={handleInputClick}
                >
                    <div className='text-[1rem] whitespace-nowrap'>
                        {startDate && endDate
                            ? `${dayjs(endDate).utc().tz('Europe/Moscow').format('DD/MM/YYYY')}`
                            : startDate
                                ? `${dayjs(startDate).utc().tz('Europe/Moscow').format('DD/MM/YYYY')}`
                                : 'Конечная дата'}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#777]">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            {showCalendar && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                    <div className="relative bg-white border border-gray-300 rounded shadow-md p-4 max-w-[90%] sm:max-w-full">
                        <div className="flex justify-between mb-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-1 text-pink-500 hover:bg-gray-200 rounded transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold">
                                {dayjs(currentDate).utc().tz('Europe/Moscow').format('MMMM YYYY')}
                            </h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-1 text-pink-500 hover:bg-gray-200 rounded transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 text-center font-bold">
                            {daysInWeek.map((day) => (
                                <div key={day} className="p-2">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {renderDays()}
                        </div>
                        <button
                            onClick={toggleCalendar}
                            className='font-roboto mt-5 w-full py-4 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg shadow-lg transform transition-transform duration-300 hover:bg-pink-400'
                        >
                            Применить
                        </button>
                        <button onClick={toggleCalendar} className="absolute top-[105%] smd:-top-8 right-1/2 smd:-right-8 translate-x-1/2  smd:translate-x-0 p-3 smd:p-0 smd:bg-transparent text-[1.8rem] smd:text-[2rem] text-[#333] rounded-full bg-white border smd:border-none smd:text-[#fff]">
                            <IoMdClose />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CalendarModal;