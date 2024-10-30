import { data } from '../../data/events';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { IoMdPricetags } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { MdPlace } from "react-icons/md";
import { IoShareSocialSharp } from "react-icons/io5";
import { PiClockFill } from "react-icons/pi";




dayjs.locale('ru');

export default function EventPage({ params }) {


  const { id } = params;
  const event = data.find(event => event.id === parseInt(id));

  if (!event) {
    return <div>Событие не найдено</div>;
  }

  return (
    <div className='max-w-custom-container mx-auto'>
      <div className='relative flex'>

        {/* <div className="lg:w-1/2 w-2/3 h-[350px] lg:min-h-screen bg-[#F52D85] md:block hidden"></div> */}
        {/* <div className="min-h-screen lg:w-3/4"></div> */}

        <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 '>

          <div className='lg:flex lg:items-start bg-[#fff] rounded-xl p-10'>
            {/* <div className=relative bg-cover bg-center md:h-[200px] lg:h-[400px]э style={{ backgroundImage: `url(${events.image})` }}></div> */}
            {/* <div className="absolute inset-0 bg-black opacity-50" />  */}
            <div>
              <Image className='object-cover object-center w-full lg:w-[32rem] rounded-lg h-96 shadow-xl'
                src={event.image}
                width={1000}
                height={1000}
                alt="avatar" />
            </div>
            
            <div className='mt-8 lg:px-10 lg:mt-0'>

              <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5 mx-1">
                {event.category} <br /> <span className="text-[#F52D85]">{event.title}</span>
              </h1>

              <div className='mx-1 mb-6 p-5 bg-[#f4f4f9] rounded-2xl w-full lg:w-[300px]'>
                <div className='flex items-center'>
                  <IoMdPricetags size={18} color='#333' />
                  <p className='font-roboto text-[#333] text-gray-[#333] mb-1 lg:w-72 ml-2'>{event.price} ₽</p>
                </div>
                <div className='flex items-center'>
                  <MdCalendarMonth size={18} color='#333' />
                  <p className='font-roboto text-[#333] text-gray-[#333] my-1 lg:w-72 ml-2'>{event.date}</p>
                </div>
                <div className='flex items-center'>
                  <PiClockFill size={19} color='#333' />
                  <p className='font-roboto text-[#333] text-gray-[#333] my-1 lg:w-72 ml-2'>c 09:00 по 12:00</p>
                </div>
                <div className='flex items-center'>
                  <MdPlace size={21} color='#333' className='mt-1' />
                  <p className='font-roboto text-[#333] mt-1 lg:w-72 ml-1 underline hover:text-[#F52D85] cursor-pointer'>{event.place}</p>
                </div>
              </div>
              <div className='flex mb-5 flex-wrap'>
                <div className='border-[#F52D85] border px-4 py-2 rounded-xl text-[#333] hover:bg-[#F52D85] hover:text-white my-1 mx-1 transform transition-colors duration-300 cursor-pointer'>Кино</div>
                <div className='border-[#F52D85] border px-4 py-2 rounded-xl text-[#333] hover:bg-[#F52D85] hover:text-white my-1 mx-1 transform transition-colors duration-300 cursor-pointer'>Музыка</div>
                <div className='border-[#F52D85] border px-4 py-2 rounded-xl text-[#333] hover:bg-[#F52D85] hover:text-white my-1 mx-1 transform transition-colors duration-300 cursor-pointer'>Концерт</div>
                <div className='border-[#F52D85] border px-4 py-2 rounded-xl text-[#333] hover:bg-[#F52D85] hover:text-white my-1 mx-1 transform transition-colors duration-300 cursor-pointer'>Театр</div>
                <div className='border-[#F52D85] border px-4 py-2 rounded-xl text-[#333] hover:bg-[#F52D85] hover:text-white my-1 mx-1 transform transition-colors duration-300 cursor-pointer'>Вечеринка</div>
              </div>

              <div className='flex'>
                <div className='bg-[#F52D85] border px-4 py-2 mx-1 text-white flex items-center rounded-xl cursor-pointer hover:bg-white hover:border-[#F52D85] hover:text-[#F52D85] transform transition-colors duration-300'>
                  <IoShareSocialSharp size={18} className='mr-2 ' />
                  <p>Поделиться</p>
                </div>
              </div>


            </div>

          </div>
          {/* <div className='bg-[#F52D85] h-[1px] w-2/3'></div> */}
          <p className=' font-roboto font-bold text-[#777] text-gray-[#333] lg:w-72 mt-10'>Описание:</p>
          <p className='text-[#777] font-roboto'>{event.content}</p>
        </div>
      </div>
    </div>
  );
};