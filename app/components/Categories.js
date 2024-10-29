'use client';
import '../globals.css';
import { BsFillMortarboardFill } from "react-icons/bs";
import { MdMuseum } from "react-icons/md";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { BsFillPaletteFill } from "react-icons/bs";
import { HiMiniPaintBrush } from "react-icons/hi2";
import { MdFestival } from "react-icons/md";
import { PiMusicNoteFill } from "react-icons/pi";
import { PiMusicNotesFill } from "react-icons/pi";
import { RiSpeakFill } from "react-icons/ri";
import { BiSolidCameraMovie } from "react-icons/bi";
import { FaPersonFalling } from "react-icons/fa6";
import { FaMask } from "react-icons/fa";
import { PiMaskHappyFill } from "react-icons/pi";
import { PiCityFill } from "react-icons/pi";
import { FaCompactDisc } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

const categories = [
    {
        category: 'Выставки', color: 'bg-[#d946ef]', icon: <MdMuseum size={40} color='#22c55e' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />
    },
    {
        category: 'Кино', color: 'bg-[#0ea5e9]', icon: <BiSolidCameraMovie size={40} color='#3b82f6' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />
    },
    {
        category: 'Лекции', color: 'bg-[#14b8a6]', icon: <BsFillMortarboardFill size={40} color='#a855f7' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />

    },
    {
        category: 'Вечеринки', color: 'bg-[#10b981]', icon: <FaCompactDisc size={40} color='#f97316' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />

    },
    {
        category: 'Музыка', color: 'bg-[#ef4444]', icon: <PiMusicNoteFill size={40} color='#14b8a6' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />
    },
    {
        category: 'Представления', color: 'bg-[#ef4444]', icon: <FaMask size={40} color='#f43f5e' className='absolute top-[40%] -left-[11%] transition-all duration-300 group-hover:ml-[16%] transform opacity-90' />
    },
];


function Category({ value, className }) {

    const currentCategory = categories.find((item) => item.category === value);

    return (
        <div className={`relative group flex justify-center items-center h-[90px] md:h-[150px] lg:h-[200px] overflow-hidden rounded-full md:rounded-[40px] cursor-pointer ${className} transform transition-all duration-200 focus:scale-[95%]`} tabIndex="0">
            <div className='absolute -left-[90%] transition-all duration-300 rotate-45 lg:group-hover:ml-[58%] special:group-hover:ml-[65%] transform bg-white w-[90px] md:w-[150px] lg:w-[170px] h-[90px] md:h-[150px] lg:h-[170px] rounded-xl'>
            </div>
            <div className='absolute inset-0 bg-gradient-to-tl from-white/40 to-transparent '>
                {currentCategory ? currentCategory.icon : <IoStar size={40} color='white' className='absolute top-[36%] -left-[30%] transition-all duration-300 transform' />}
            </div>
            <h2 className='md:absolute md:top-10 md:left-10 text-[1.4rem] md:text-[1.6rem] text-white lg:group-hover:ml-[20%] transform transition-all duration-300'>
                {value}
            </h2>
        </div >
    )
};

function Categories() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            <Category value="Музыка" className='bg-[#14b8a6]' />
            <Category value="Лекции" className='bg-[#a855f7]' />
            <Category value="Кино" className='bg-[#3b82f6]' />
            <Category value="Представления" className='bg-[#f43f5e]' />
            <Category value="Выставки" className='bg-[#22c55e]' />
            <Category value="Вечеринки" className='bg-[#f97316]' />
        </div>
    );
};
export default Categories;