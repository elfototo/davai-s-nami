import Image from 'next/image';
import Tag from './Tag';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import Link from 'next/link';
import { BsFillGeoAltFill } from 'react-icons/bs';
import { AiFillClockCircle } from 'react-icons/ai';
import { useEvents } from '../../context/SwrContext';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  selectWishlistLoading,
  selectWishlistInitialized,
} from '../../store/slices/wishlistSlice.js';

dayjs.extend(isoWeek);
dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

const Card = ({
  type,
  main_category_id,
  title,
  from_date,
  address,
  price,
  id,
  image,
  to_date,
}) => {
  const idNumber = parseInt(id);

  const dispatch = useDispatch();
  const isInWishlist = useSelector(selectIsInWishlist(idNumber));

  const { findDataById, convertImageUrlToJpeg } = useEvents();
  const [showFulltext, setShowFulltext] = useState(false);
  const [showFullTitletext, setShowFullTitletext] = useState(false);

  const maxTitleText = 50;
  const maxAdressText = 25;
  const toggleFullText = () => {
    setShowFulltext(!showFulltext);
  };
  const toggleFullTitleText = () => {
    setShowFullTitletext(!showFullTitletext);
  };

  const imageUrl = image || '/img/cat.png';
  const processedImageUrl = convertImageUrlToJpeg(imageUrl);

  const handleAddToWishList = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(idNumber));
    } else {
      dispatch(addToWishlist(idNumber));
    }
  };

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
    <div className="group">
      <div className="flex h-auto min-h-full w-full max-w-sm flex-col justify-between overflow-hidden rounded-lg border border-[#D9D9D9] bg-white group-hover:border-pink-400">
        {/* Header card */}
        <div>
          <div className="relative overflow-hidden border-b border-[#D9D9D9]">
            <Link href={`/events/${id}`} className='z-0'>
              <Image
                className={heightImage[type]}
                src={processedImageUrl}
                width={500}
                height={500}
                alt="avatar"
              />
            </Link>

            <div className="absolute top-3 flex w-full items-center justify-between gap-3 px-3">
              <div className="flex items-baseline rounded-full border border-[#D9D9D9] bg-[#fff] px-2 py-1">
                {/* <p className="font-roboto font-bold text-[#444]"></p> */}
                <p className="flex-nowrap font-roboto font-bold text-[#444] dark:text-white">
                  {price ? `${price}` : 'Без цены'}
                </p>
              </div>
            </div>

            {/* Category template */}
            <Tag
              main_category_id={
                main_category_id ? main_category_id : 'Без категории'
              }
            />
          </div>

          {/* Card content */}
          <div>
            <div className="flex h-full flex-col items-start justify-start px-2 pt-2">
              <div className="mb-3">
                <p
                  title={title}
                  onClick={toggleFullTitleText}
                  className="cursor-pointer font-roboto font-medium text-[#444]"
                >
                  {title ? (
                    title.length > maxTitleText ? (
                      showFullTitletext ? (
                        title
                      ) : (
                        <>
                          {title.slice(0, maxTitleText)}{' '}
                          <span className="text-[#777]">...</span>
                        </>
                      )
                    ) : (
                      title
                    )
                  ) : (
                    'Название скоро появится'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-start justify-start">
                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    <div className="mb-[3px] mr-2 h-3 w-3">
                      <AiFillClockCircle className="h-3 w-3 text-[#777]" />
                    </div>

                    <p className="font-roboto text-[#777]">
                      {formatDateRange(from_date, to_date)}
                    </p>
                    <p></p>
                  </div>
                  <div className="flex items-start">
                    {address ? (
                      <div className="mr-2 mt-[4px] h-3 w-3">
                        <BsFillGeoAltFill className="h-3 w-3 text-[#777]" />
                      </div>
                    ) : (
                      ''
                    )}
                    <p
                      onClick={toggleFullText}
                      title={address}
                      className="cursor-pointer font-roboto text-[#777]"
                    >
                      {address ? (
                        address.length > maxAdressText ? (
                          showFulltext ? (
                            address
                          ) : (
                            <>
                              {address.slice(0, maxAdressText)}{' '}
                              <span className="text-[#777]">...</span>
                            </>
                          )
                        ) : (
                          address
                        )
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 m-3">
            <Link href={`/events/${id}`} className="flex-1">
              <button className="w-full rounded-lg bg-pink-500 py-2 font-roboto text-[1rem] font-medium text-white transition hover:bg-pink-400">
                Смотреть
              </button>
            </Link>

            <button
              onClick={handleAddToWishList}
              className="flex h-[40px] min-h-[40px] w-[40px] min-w-[40px] flex-shrink-0 items-center justify-center rounded-full border border-[#D9D9D9] bg-white"
            >
              {isInWishlist ? (
                <MdFavorite className="text-red-400" size={20} />
              ) : (
                <MdFavoriteBorder className="text-gray-400" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
