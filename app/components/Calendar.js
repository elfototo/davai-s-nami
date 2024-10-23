'use client';

import '../globals.css';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(isBetween);

const daysInWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const CalendarModal = ({ startDate, setStartDate, endDate, setEndDate }) => {

    const [currentDate, setCurrentDate] = useState(dayjs().utc(+3).startOf('day'));
    const [showCalendar, setShowCalendar] = useState(false);

    const today = dayjs().utc(+3).startOf('day');

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
        if (!startDate) {
            setStartDate(today);
        }
    };

    const handleDateClick = (day) => {
        const dayJsDate = dayjs(day).utc(+3); // Convert clicked date to a Day.js object
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
        const firstDayOfMonth = dayjs(currentDate).utc(+3).startOf('month');
        const lastDayOfMonth = dayjs(currentDate).utc(+3).endOf('month');
        const days = [];

        // Empty cells for alignment
        for (let i = 0; i < firstDayOfMonth.day() - 1; i++) {
            days.push(<div key={`empty-${i}`} className='w-[2.25rem] h-[2.25rem]' />);
        }

        // Days of the month
        for (let day = 1; day <= lastDayOfMonth.date(); day++) {
            const date = dayjs(currentDate).utc(+3).date(day); // Set the day in the current month
            const isToday = date.isSame(dayjs().utc(+3).startOf('day'), 'day');
            const isStartSelected = startDate && date.isSame(dayjs(startDate).utc(+3).startOf('day'), 'day');
            const isEndSelected = endDate && date.isSame(dayjs(endDate).utc(+3).startOf('day'), 'day');

            const startDay = startDate ? dayjs(startDate).utc(+3).startOf('day') : null;
            const endDay = endDate ? dayjs(endDate).utc(+3).startOf('day') : null;

            // console.log('date:', date.format('YYYY-MM-DD'), 'startDay:', startDay ? startDay.format('YYYY-MM-DD') : null, 'endDay:', endDay ? endDay.format('YYYY-MM-DD') : null);

            const isInRange = startDay && endDay && 
            (date.isBetween(startDay, endDay, null, '[]') || 
             date.isSame(startDay, 'day') || 
             date.isSame(endDay, 'day'));

            const isFirstInRange = isStartSelected || date.isSame(startDay, 'day');;
            const isLastInRange = isEndSelected || date.isSame(endDay, 'day');;

            // Text color based on date
            const textColor = date.isBefore(dayjs().utc(+3).startOf('day')) ? 'text-gray-400' : 'text-black';
            const isTodayClass = isToday ? 'border border-pink-400 rounded-full' : '';
            const isSelectedClass = isStartSelected || isEndSelected ? 'bg-pink-400 text-white' : '';
            const isInRangeClass = isInRange ? `bg-pink-200 ${isFirstInRange ? 'rounded-tl-[50%] rounded-bl-[50%]' : ''} ${isLastInRange ? 'rounded-tr-[50%] rounded-br-[50%]' : ''}`
                : 'rounded-full';

            days.push(
                <div key={`day-${day}`} className={`${isInRangeClass} my-1 flex items-center justify-center grid-item `}>
                    <div
                        className={`w-[3.6rem] h-[3.6rem] rounded-full leading-normal text-[1rem] flex items-center justify-center text-center cursor-pointer duration-200 transform transition-colors duration-[250ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)]
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
            return dayjs(prevDate).utc(+3).add(direction, 'month').toDate(); // Convert back to Date if needed
        });
    };

    const handleInputClick = () => {
        toggleCalendar();
        // console.log(startDate);
        // console.log(endDate); 
    };


    return (
        <div className='relative w-full'>
            <div className='md:flex lg:block'>
                <div className='flex items-center justify-between w-1/2 lg:w-full border border-gray-300 rounded cursor-pointer text-[#777] text-center px-2 py-1 hover:bg-gray-50 transition duration-200 mx-auto mb-2 md:mb-0 md:mr-2 lg:mr-0 lg:mb-2'
                    onClick={handleInputClick}
                >
                    <div className='text-[1rem] whitespace-nowrap'>
                        {startDate && endDate
                            ? `${dayjs(startDate).utc(+3).format('DD/MM/YYYY')}`
                            : startDate
                                ? `${dayjs(startDate).utc(+3).format('DD/MM/YYYY')}`
                                : 'Начальная дата'}
                    </div>
                    <button className='flex items-center justify-center ml-2 p-2 rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#777]">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center justify-between w-1/2 lg:w-full border border-gray-300 rounded cursor-pointer text-[#777] text-center px-2 py-1 hover:bg-gray-50 transition duration-200 mx-auto mt-2 md:mt-0 md:ml-2 lg:ml-0 lg:mt-2"
                    onClick={handleInputClick}
                >
                    <div className='text-[1rem] whitespace-nowrap'>
                        {startDate && endDate
                            ? `${dayjs(endDate).utc(+3).format('DD/MM/YYYY')}`
                            : startDate
                                ? `${dayjs(startDate).utc(+3).format('DD/MM/YYYY')}`
                                : 'Конечная дата'}
                    </div>
                    <button className='flex items-center justify-center ml-1 p-2 rounded-full hover:bg-gray-100 transition duration-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#777]">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            {showCalendar && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white border border-gray-300 rounded shadow-md p-4 max-w-md w-full">
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
                                {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
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
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarModal;