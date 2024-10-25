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


const Tag = ({ category }) => {
    const tags = ['Концерт', 'Выставка', 'Танцы', 'Мастер-класс', 'Интервью', 'Кино', 'Перформанс', 'Лекция', 'Вечеринка', 'Театр', 'Фестиваль', 'Искусство', 'Экскурсия', 'Музыка', 'Стендап', 'Другое'];

    const categories = [
        {
            category: 'Концерт', color: 'bg-[#f43f5e]', icon: <PiMusicNotesFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Выставка', color: 'bg-[#d946ef]', icon: <MdMuseum size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Танцы', color: 'bg-[#a855f7]', icon: <FaPersonFalling size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Мастер-класс', color: 'bg-[#8b5cf6]', icon: <HiMiniPaintBrush size={15} color='white' className='mr-1 mb-[0.1rem]'/>
        },
        {
            category: 'Интервью', color: 'bg-[#6366f1]', icon: <RiSpeakFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>

        },
        {
            category: 'Кино', color: 'bg-[#0ea5e9]', icon: <BiSolidCameraMovie size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Перформанс', color: 'bg-[#06b6d4]', icon: <PiMaskHappyFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>

        },
        {
            category: 'Лекция', color: 'bg-[#14b8a6]', icon: <BsFillMortarboardFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>

        },
        {
            category: 'Вечеринка', color: 'bg-[#10b981]', icon: <FaCompactDisc size={16} color='white' className='mr-1 mb-[0.2rem]'/>

        },
        {
            category: 'Театр', color: 'bg-[#84cc16]', icon: <FaMask size={16} color='white' className='mr-1 mb-[0.1rem]'/>
        },
        {
            category: 'Фестиваль', color: 'bg-[#eab308]', icon: <MdFestival size={16} color='white' className='mr-1 mb-[0.1rem]'/>

        },
        {
            category: 'Искусство', color: 'bg-[#f59e0b]', icon: <BsFillPaletteFill size={16} color='white' className='mr-1 mb-[0.1rem]'/>

        },
        {
            category: 'Экскурсия', color: 'bg-[#f97316]', icon: <PiCityFill size={16} color='white' className='mr-1 mb-[0.1rem]'/>

        },
        {
            category: 'Музыка', color: 'bg-[#ef4444]', icon: <PiMusicNoteFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Стендап', color: 'bg-[#ec4899]', icon: <PiMicrophoneStageFill size={16} color='white' className='mr-1 mb-[0.2rem]'/>
        },
        {
            category: 'Другое', color: 'bg-[#111]', icon: <IoStar size={16} color='white' className='mr-1 mb-[0.2rem]'/>

        },
    ];

    const currentCategory = categories.find((item) => item.category === category);

    return (
        <div className={`absolute left-3 bottom-3 rounded-full flex items-center px-3 py-1 ${currentCategory ? currentCategory.color : 'bg-[#111]'}`}>
            {currentCategory ? currentCategory.icon : <IoStar size={16} color='white' className='mr-1 mb-[0.2rem]'/>}
            <p className="font-roboto text-white">{category}</p>
        </div>
    )
};

export default Tag;