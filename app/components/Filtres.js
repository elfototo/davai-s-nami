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

const Filtres = ({ selectedTags, setSelectedTags, setBgColor, startDate, setStartDate, endDate, setEndDate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');

    const tags = ['Концерты', 'Хобби и творчество', 'Выставка', 'Танцевальная драма', 'Мастер-класс', 'Интервью', 'Библиотеки', 'Кино', 'Перформанс', 'Лекция', 'Вечеринка', 'Презентация', 'Театры', 'Фестиваль', 'Танцевальный вечер', 'Кинопоказ', 'Искусство и культура', 'Экскурсии и путешествия', 'Музыка'];

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
                <div className='lg:hidden px-2 py-2 flex justify-start -mx-3 overflow-y-auto whitespace-nowrap scroll-hidden'>
                    <button onClick={toggleFilter} className={`mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                        Фильтр
                    </button>
                    {['Цена', 'Сегодня', 'Завтра', 'Выходные'].map((label) => (
                        <button key={label} onClick={toggleFilter} className={`mx-3 text-[1rem] items-center justify-center py-1 px-2 bg-[#fff] rounded-md ${!isOpen ? 'block' : 'hidden'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full p-4 relative`}>
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
                                className={`mx-1 my-1 py-2 px-4 text-left rounded-md ${selectedTags.includes(tag) ? 'bg-pink-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
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
    );
};

export default Filtres;