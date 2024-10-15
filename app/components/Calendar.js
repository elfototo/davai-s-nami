'use client';
import React, { useState } from 'react';

const daysInWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const CalendarModal = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
        if (!selectedStartDate) {
            setSelectedStartDate(today);
        }
    };

    const handleDateClick = (day) => {
        if (!selectedStartDate) {
            // If start date is not selected, set it
            setSelectedStartDate(day);
            setSelectedEndDate(null); // Reset end date
        } else if (!selectedEndDate) {
            // If end date is not selected, set it
            if (day < selectedStartDate) {
                // If new date is less than start date, set it as the start date
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(day);
            } else {
                // Set end date
                setSelectedEndDate(day);
            }
        } else {
            // If both dates are selected, reset selection and set new start date
            if (day < selectedStartDate) {
                setSelectedStartDate(day);
                setSelectedEndDate(null); // Reset end date
            } else if (day > selectedEndDate) {
                setSelectedEndDate(day);
            } else {
                // If date is between selected dates, reset both
                setSelectedStartDate(day);
                setSelectedEndDate(null); // Reset end date
            }
        }
    };

    const renderDays = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const days = [];

        // Empty cells for alignment
        for (let i = 0; i < firstDayOfMonth.getDay() - 1; i++) {
            days.push(<div key={`empty-${i}`} className="w-1/7 h-10" />);
        }

        // Days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isStartSelected = selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
            const isEndSelected = selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
            const isInRange =
                selectedStartDate && selectedEndDate &&
                ((date > selectedStartDate && date < selectedEndDate) || (date < selectedStartDate && date > selectedEndDate));

            // Text color based on date
            const textColor = date < today ? 'text-gray-400' : 'text-black';
            const isTodayClass = isToday ? 'border border-pink-400' : '';
            const isSelectedClass = isStartSelected || isEndSelected ? 'bg-pink-400 text-white' : '';
            const isInRangeClass = isInRange ? 'bg-pink-100' : '';

            days.push(
                <div
                    key={day}
                    className={`w-[3rem] h-[3rem] my-1 flex items-center justify-center cursor-pointer transition-colors duration-200 rounded-full 
            ${isTodayClass} ${isSelectedClass} ${isInRangeClass} hover:bg-pink-100 ${textColor}`}
                    onClick={() => handleDateClick(date)}
                >
                    <span>{day}</span>
                </div>
            );
        }

        return days;
    };

    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const handleInputClick = () => {
        toggleCalendar();
    };

    return (
        <div className="relative">
            <div
                onClick={handleInputClick}
                className="mb-4 p-3 border border-gray-300 rounded cursor-pointer text-center hover:bg-gray-100 transition duration-200"
            >
                {selectedStartDate && selectedEndDate
                    ? `${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()}`
                    : selectedStartDate
                        ? `${selectedStartDate.toLocaleDateString()}`
                        : 'Выбрать дату'}
            </div>
            {showCalendar && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white border border-gray-300 rounded shadow-md p-4 max-w-md w-full">
                        <div className="flex justify-between mb-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-1 text-pink-500 hover:bg-gray-200 rounded transition duration-200"
                            >
                                &lt;
                            </button>
                            <h2 className="text-lg font-semibold">
                                {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-1 text-pink-500 hover:bg-gray-200 rounded transition duration-200"
                            >
                                &gt;
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

