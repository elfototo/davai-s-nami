import { data } from '../../data/events';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export default function EventPage({ params }) {


  const { id } = params;
  const event = data.find(event => event.id === parseInt(id));

  if (!event) {
    return <div>Событие не найдено</div>;
  }

  return (
    <div className='bg-[#fff] max-w-custom-container mx-auto'>
      <div className='relative flex'>

        <div className="lg:w-1/2 w-2/3 h-[350px] lg:min-h-screen bg-[#F52D85] md:block hidden"></div>
        <div className="min-h-screen lg:w-3/4"></div>

        <div className='flex flex-col justify-center w-full min-h-scree px-6 py-5 md:py-10 mx-auto lg:inset-x-0 md:absolute'>

          <div className='mt-5 lg:mt-20 lg:flex lg:items-start'>
            <Image className='object-cover object-center w-full lg:w-[32rem] rounded-lg h-96 md:shadow-xl'
              src="/img/cat.png"
              width={1000}
              height={1000}
              alt="avatar" />

            <div className='mt-8 lg:px-10 lg:mt-0'>

              <h1 className="text-2xl font-bold text-[#333] lg:text-3xl my-0 font-roboto mb-5">
                {event.category} <br /> <span className="text-[#F52D85]">{event.title}</span>
              </h1>

              <div className='mb-5'>
                <p className='font-roboto font-bold text-[#777] text-gray-[#333] my-2 lg:w-72'>Цена: {event.price}</p>
                <p className='font-roboto font-bold text-[#777] text-gray-[#333] my-2 lg:w-72'>Дата: {event.date}</p>
                <p className='font-roboto font-bold text-[#777] text-gray-[#333] mt-2 lg:w-72'>Место: {event.place}</p>
              </div>
              <div className='bg-[#F52D85] h-[1px] w-2/3'></div>
              <p className=' font-roboto font-bold text-[#777] text-gray-[#333] mt-2 lg:w-72'>Описание:</p>
              <p className='text-[#777] font-roboto'>{event.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};