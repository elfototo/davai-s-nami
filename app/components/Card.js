import Image from 'next/image';
import Tag from './Tag';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import Link from 'next/link';
import { BsFillGeoAltFill } from "react-icons/bs";
import { AiFillClockCircle } from "react-icons/ai";
import { useEvents } from '../../context/SwrContext';


dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

const Card = ({ type, main_category_id, title, from_date, address, price, id, image, to_date }) => {

  const { convertImageUrlToJpeg } = useEvents();
  const [showFulltext, setShowFulltext] = useState(false);
  const [showFullTitletext, setShowFullTitletext] = useState(false);

  const maxTitleText = 50;
  const maxAdressText = 25;
  const toggleFullText = () => {
    setShowFulltext(!showFulltext)
  };
  const toggleFullTitleText = () => {
    setShowFullTitletext(!showFullTitletext)
  }

  const imageUrl = image || '/img/cat.png';
  const processedImageUrl = convertImageUrlToJpeg(imageUrl);

  const heightImage = {
    mini: 'object-cover object-center w-full h-[200px] transform transition duration-300 group-hover:scale-105 relative',
    max: 'object-cover object-center w-full h-auto transform transition duration-300 group-hover:scale-105 relative',
  };

  const formatDateRange = (from_date, to_date) => {
    if (!from_date) return 'Скоро будет дата';
  
    const from = dayjs(from_date).utc().tz('Europe/Moscow');
    const to = to_date ? dayjs(to_date).utc().tz('Europe/Moscow') : null;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const fromWeekday = capitalize(from.format('dd'));
    const toWeekday = to ? capitalize(to.format('dd')) : '';

    console.log('fromWeekday', fromWeekday)
  
    if (!to || from.isSame(to)) {
      return `${fromWeekday}, ${from.format('D MMMM')}`;
    }
  
    if (from.isSame(to, 'day')) {
      return `${fromWeekday}, ${from.format('D MMMM')}`;
    }
  
    if (to.hour() === 0 && to.minute() === 0) {
      return `${fromWeekday}, ${from.format('D MMMM')} - 00:00`;
    }
  
    return `${fromWeekday}, ${from.format('D MMMM')} - ${toWeekday}, ${to.format('D MMMM')}`;
  };

  return (
    <div className='group '>
      <div className="flex flex-col justify-between w-full h-auto min-h-full max-w-sm overflow-hidden bg-white rounded-lg border border-[#D9D9D9] group-hover:border-pink-400">
        {/* Header card */}
        <div>
          <div className='relative overflow-hidden border-b border-[#D9D9D9]'>

            <Image className={heightImage[type]}
              src={processedImageUrl}
              width={500}
              height={500}
              alt="avatar" />

            <div className='flex items-baseline absolute top-3 left-3 rounded-full px-3 py-1 border border-[#D9D9D9] bg-[#fff]'>
              <p className='text-[#444] mr-1 font-roboto font-bold'></p>
              <p className="text-[#444] font-roboto font-bold dark:text-white">{price ? `${price}` : 'Без цены'}</p>
            </div>

            {/* Category template */}
            <Tag main_category_id={main_category_id ? main_category_id : 'Без категории'} />

          </div>

          {/* Card content */}
          <div>
            <div className='h-full px-2 pt-2 flex flex-col items-start justify-start'>
              <div className="mb-3">
                <p
                  title={title}
                  onClick={toggleFullTitleText}
                  className="text-[#444] font-medium font-roboto cursor-pointer">
                  {title ? (title.length > maxTitleText
                    ? (showFullTitletext
                      ? title
                      : <>
                        {title.slice(0, maxTitleText)} <span className='text-[#777]'>...</span>

                      </>)
                    : title)
                    : 'Название скоро появится'}
                </p>
              </div>
              <div className='flex items-start justify-start flex-wrap'>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center'>
                    <div className='h-3 w-3 mr-2 mb-[3px]'>
                      <AiFillClockCircle className='text-[#777] h-3 w-3' />
                    </div>

                    <p className="text-[#777] font-roboto">
                    {formatDateRange(from_date, to_date)}
                    </p>
                    <p>

                    </p>
                  </div>
                  <div className='flex items-start'>
                    {address ?
                      <div className='h-3 w-3 mr-2 mt-[4px]'>
                        <BsFillGeoAltFill className='text-[#777] h-3 w-3' />
                      </div>
                      :
                      ''}
                    <p
                      onClick={toggleFullText}
                      title={address}
                      className="text-[#777] font-roboto cursor-pointer ">
                      {address ? (address.length > maxAdressText
                        ? (showFulltext
                          ? address
                          : <>
                            {address.slice(0, maxAdressText)} <span className='text-[#777] '>...</span>

                          </>)
                        : address)
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Link href={`/events/${id}`}>
            <div className='flex'>
              <button className='font-roboto my-2 mx-2 w-full py-2 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg transform transition-transform duration-300 hover:bg-pink-400'>Смотреть</button>
            </div>
          </Link>
        </div>
      </div>
    </div>

  );
};

export default Card;
