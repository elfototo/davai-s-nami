'use client';

import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const Filtres = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle filter visibility on mobile
    const toggleFilter = () => {
        setIsOpen(!isOpen);
    };

    const [selectedTags, setSelectedTags] = useState([]);
    const tags = ['Театры', 'Кинопоказы', 'Концерты', 'Оркестр', 'Игра на палочке', 'Музыка'];

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };


    return (
        <div className='rounded-lg bg-white border max-w-custom-container border-[#D9D9D9] shadow-lg'>
            {/* Filter button for mobile */}
            <div className='lg:hidden px-2 py-2 flex justify-center'>
                <button
                    onClick={toggleFilter}
                    className="mx-2 items-center justify-center py-2 px-2 bg-[#f4f4f9] rounded-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                    </svg>
                </button>
                <button
                    onClick={toggleFilter}
                    className="mx-2 items-center justify-center py-2 px-2 bg-[#f4f4f9] rounded-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                    </svg>

                </button>
            </div>

            {/* Filter content, hidden by default on mobile */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full  p-4 relative`}>
                {/* Date selection */}
                <div className="mb-5">
                    <h3 className="text-lg mb-2">Когда</h3>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-gray-100 rounded-md">Сегодня</button>
                        <button className="flex-1 py-2 bg-gray-100 rounded-md">Завтра</button>
                    </div>
                    <button className="w-full mt-2 py-2 bg-gray-100 rounded-md">Выходные</button>
                    <input type="date" placeholder="John Doe" className="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                </div>

                {/* Tag selection */}
                <div>
                   
                    <h3 className="text-lg mb-2">Теги</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-2 py-1 rounded-xl ${selectedTags.includes(tag) ? 'bg-pink-500 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hide button for mobile */}
                <button
                    onClick={toggleFilter}
                    className="lg:hidden mt-4 text-blue-600 underline"
                >
                    Скрыть
                </button>
            </div>

        </div>


    );
};

export default Filtres;
