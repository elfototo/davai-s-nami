import Image from 'next/image';
import Tags from './Tag';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; 
dayjs.locale('ru');

const Card = ({ type, category, title, date, place, price, data }) => {
  const heightImage = {
    mini: 'object-cover object-center w-full h-[200px]',
    max: 'object-cover object-center w-full h-auto',
  };

  return (
    <div className="w-full h-auto max-w-sm overflow-hidden bg-white rounded-lg border border-[#D9D9D9] hover:shadow-lg cursor-pointer">
      {/* Header card */}
      <div className='relative border-b border-[#D9D9D9]'>
        <Image className={heightImage[type]}
          src="/img/card.svg"
          width={250}
          height={250}
          alt="avatar" />

        {/* Category template */}
        <Tags category={category}/>
      </div>

      {/* Card content */}
      <div className='h-[150] px-5 py-5'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex items-baseline mr-3'>
            <p className='text-[#444] mr-1 font-roboto font-bold'>от</p>
            <h2 className="text-[#444] font-roboto font-medium dark:text-white">{price}₽</h2>
          </div>

          <div className=''>
            <div className='flex items-center'>
              <svg className="text-[#777] w-4 h-auto fill-current mr-1 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
              <p className="text-[#777] font-roboto">{dayjs(date, 'DD-MM-YYYY').format('DD MMM YYYY')}</p>
            </div>
            <div className='flex items-center'>
              <svg className="text-[#777] w-4 h-auto fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              <p className="text-[#777] font-roboto">{place}</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-[#444] font-medium font-roboto">{title}</p>
        </div>
      </div>
    </div>

  );
};

export default Card;
