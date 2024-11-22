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

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

const Card = ({ type, category, main_category_id, title, from_date, address, price, id, image }) => {
  const [showFulltext, setShowFulltext] = useState(false);
  const [showFullTitletext, setShowFullTitletext] = useState(false);

  const maxTitleText = 30;
  const maxAdressText = 20;
  const toggleFullText = () => {
    setShowFulltext(!showFulltext)
  };
  const toggleFullTitleText = () => {
    setShowFullTitletext(!showFullTitletext)
  }


  const heightImage = {
    mini: 'object-cover object-center w-full h-[200px] transform transition duration-300 group-hover:scale-105 relative',
    max: 'object-cover object-center w-full h-auto transform transition duration-300 group-hover:scale-105 relative',
  };

  return (
    <div className='group '>
      <div className="flex flex-col justify-between w-full h-auto min-h-full max-w-sm overflow-hidden bg-white rounded-lg border border-[#D9D9D9] group-hover:border-pink-400">
        {/* Header card */}
        <div>
          <div className='relative overflow-hidden border-b border-[#D9D9D9]'>

            <Image className={heightImage[type]}
              src={image ? image : '/img/cat.png'}
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

                    <p className="text-[#777] font-roboto">{from_date ? dayjs(from_date).utc().tz('Europe/Moscow').format('DD MMMM') : 'Скоро будет дата'}</p>
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
          <Link href={`/events/${id}`} className='flex ' >
            <button className='font-roboto my-2 mx-2 w-full py-2 text-[1rem] font-medium bg-pink-500 text-[#fff] rounded-lg transform transition-transform duration-300 hover:bg-pink-400'>Смотреть</button></Link>
        </div>
      </div>
    </div>

  );
};

export default Card;
