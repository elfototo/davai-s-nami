'use client'
import Link from 'next/link';
import { useState, useRef } from 'react';

export default function Navbar({ search, setSearch, value }) {
    const inputRef = useRef(null);

  const handleClear = () => {
    setSearch(""); // Очищаем состояние
    if (inputRef.current) {
      inputRef.current.value = ""; // Очистка содержимого инпута с помощью рефа
      inputRef.current.focus(); // Фокус на инпуте после очистки
    }
  };
    
    return (
        <nav className="relative bg-accent-gradient shadow dark:bg-gray-800">
            <div className="max-w-custom-container px-6 py-3 mx-auto">
                <div className="flex flex-col">

                    <div className="flex">
                        <div className="relative w-[100%]">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </span>

                            <input
                                type="text"
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.target.blur(); // Убираем фокус
                                    }
                                }}
                                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 
                                 focus:ring-blue-300"
                                placeholder={value}
                            />
                            {/* Крестик для очистки
                            {search && (
                                <button
                                    onClick={handleClear}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-400 hover:text-gray-600"
                                >
                                    ✖
                                </button>
                            )} */}

                        </div>
                        {/* <button className='px-6 py-2 hover:bg-stone-100 font-medium tracking-wide text-[#333] transition-colors duration-300 transform bg-white rounded-lg'>Найти</button> */}

                    </div>
                </div>
            </div>
        </nav >
    );
}
