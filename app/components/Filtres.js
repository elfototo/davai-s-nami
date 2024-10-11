'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';

const FilterButton = ({ onClick, children, isVisible }) => (
    <button
        onClick={onClick}
        className={`mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${isVisible ? 'block' : 'hidden'}`}
    >
        {children}
    </button>
);

const Filtres = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [selectedTags, setSelectedTags] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [selectedButton, setSelectedButton] = useState('');
    const [bgColor, setBgColor] = useState('bg-white');


    const tags = ['Театры', 'Кинопоказы', 'Концерты', 'Оркестр', 'Музыка', 'Cтендапы', 'Лекции', 'Выставки'];

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

    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    };

    const selectToday = () => {
        setStartDate(new Date());
        setEndDate(null);
        setBgColor('bg-pink-500');
        setSelectedButton('today');
    }

    const selectTomorrow = () => {
        setStartDate(addDays(new Date(), 1));
        setEndDate(null);
        setBgColor('bg-pink-500');
        setSelectedButton('tomorrow');
    }

    const selectWeekends = () => {
        const today = new Date();
        const day = today.getDay();
        let saturday, sunday;

        if (day === 6) {
            saturday = today;
            sunday = addDays(today, 1)
        } else if (day === 0) {
            saturday = addDays(today, -1);
            sunday = today;
        } else {
            saturday = addDays(today, 6 - day);
            sunday = addDays(saturday, 1);
        }

        setStartDate(saturday);
        setEndDate(sunday);
        setBgColor('bg-pink-500');
        setSelectedButton('weekend');
    };

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setBgColor('bg-white');
        setSelectedButton('');
    };

    const cancelFilter = () => {
        clearSelection();
        toggleFilter();
        setSelectedTags([]);
    }

    return (
        <div className={`${isOpen ? 'bg-white' : 'bg-[#f4f4f9]'} relative rounded-lg lg:bg-white lg:border lg:border-[#D9D9D9] lg:shadow-lg`}>

            {/* Filter button for mobile */}
            <div className={`${isOpen ? 'absolute' : 'block'}`}>
                <div className='lg:hidden px-2 py-2 flex justify-start -mx-3 overflow-y-auto whitespace-nowrap scroll-hidden'>
                    <FilterButton onClick={toggleFilter} isVisible={!isOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                        </svg>
                    </FilterButton>

                    {['Цена', 'Сегодня', 'Завтра', 'Выходные'].map((label) => (
                        <FilterButton key={label} onClick={toggleFilter} isVisible={!isOpen}>
                            {label}
                        </FilterButton>
                    ))}
                </div>
            </div>

            {/* Filter content, hidden by default on mobile */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full p-4 relative`}>
                {/* Date selection */}
                <div className="mb-5">
                {/* title */}
                <div className='flex justify-between items-baseline  mb-3'>
                    <h3 className="text-lg">Когда</h3>
                    <button
                        className='underline text-blue-600'
                        onClick={cancelFilter}>
                        Отмена
                    </button>
                </div>
                {/* date */}

                <div className="flex gap-2 mt-3">
                    <button onClick={selectToday} className={`${selectedButton === 'today' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 py-2 rounded-md`}>Сегодня</button>
                    <button onClick={selectTomorrow} className={`${selectedButton === 'tomorrow' ? 'bg-pink-400 text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 py-2 rounded-md`}>Завтра</button>
                </div>
                <div className='flex justify-center items-center mt-2'>
                    <button onClick={selectWeekends} className={`${selectedButton === 'weekend' ? 'bg-pink-400  text-white transform transition-colors duration-200' : 'bg-gray-100 hover:bg-gray-200'} w-1/2 py-2 rounded-md`}>Выходные</button>
                </div>

                <div className='flex justify-center mt-5'>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            if (endDate && date > endDate) {
                                setEndDate(null);
                            }
                            setStartDate(date);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="w-full px-2 py-1 border rounded-md "
                        placeholderText="Дата начала"
                    />
                    <p className='mx-2'>-</p>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate} // Ограничиваем выбор даты конца диапазона
                        className="w-full px-2 py-1 border rounded-md"
                        placeholderText="Дата окончания"
                    />
                </div>
            </div>

            {/* Tag selection */}
            <div>
                <h3 className="text-lg mb-3">Теги</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 rounded-xl ${selectedTags.includes(tag) ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hide button for mobile */}
            <div className='flex justify-center items-center'>
                <button
                    onClick={toggleFilter}
                    className="font-roboto mt-5 w-full py-4 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg shadow-lg transform transition-transform duration-300 hover:bg-pink-400"
                >
                    Сохранить
                </button>
            </div>
        </div>
        </div >
    );
};

export default Filtres;
