'use client';
import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        category: 'Культура', color: 'bg-[#d946ef]', icon: '/img/exibition.png'
    },
    {
        category: 'Кино', color: 'bg-[#0ea5e9]', icon: '/img/movie.png'
    },
    {
        category: 'Лекции', color: 'bg-[#14b8a6]', icon: '/img/lekcia.png'

    },
    {
        category: 'Вечеринки', color: 'bg-[#10b981]', icon: '/img/party.png'

    },
    {
        category: 'Музыка', color: 'bg-[#ef4444]', icon: '/img/music_2.png'
    },
    {
        category: 'Представления', color: 'bg-[#ef4444]', icon: '/img/scena.png'
    },
];


function Category({ value, circle, circleOut, circleHover, circleOutHover, cardBgHover, circleMediumHover }) {

    const currentCategory = categories.find((item) => item.category === value);

    return (
        <div className={`group relative`}>
            <Link href={`/events?category=${encodeURIComponent(value)}`}>
                <div className={`flex flex-col justify-center items-center h-auto rounded-lg overflow-hidden cursor-pointer group-hover:shadow-xl group-hover:-translate-y-2 bg-white py-10 transform transition-all duration-300 group-active:translate-y-0`}>

                    <div className={`absolute top-[115px] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] ${circle} ${cardBgHover} rounded-full group-hover:h-[600px] group-hover:w-[600px] transform transition-all duration-500`}></div>
                    <div className={`${circleOut} ${circleOutHover} border-[4px] rounded-full transform transition-all duration-300`}>
                        <div className={` ${circle} ${circleHover} h-[150px] w-[150px] rounded-full overflow-hidden flex items-center justify-center border-[8px] border-[#fff] ${circleMediumHover} transform transition-all duration-300`}>
                            {currentCategory ?
                                <Image
                                    className='object-contain object-center mx-auto p-2'
                                    src={currentCategory.icon}
                                    height={100}
                                    width={100}
                                    alt='category'
                                />
                                :
                                <Image
                                    className='object-contain object-center mx-auto'
                                    src='/img/card.svg'
                                    height={100}
                                    width={100}
                                    alt='category'
                                />
                            }

                        </div>
                    </div>

                    <h2 className='text-[1.2rem] md:text-[1rem] mt-5 text-[#333]  transform transition-all duration-300'>
                        {value}
                    </h2>
                </div>
            </Link>
        </div >
    )
};

function Categories() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            <Category
                value="Музыка"
                circle='bg-teal-100'
                circleHover='group-hover:bg-teal-50'
                circleMediumHover='group-hover:border-teal-200'
                circleOut='border-teal-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-teal-100' />
            <Category
                value="Лекции"
                circle='bg-purple-100'
                circleHover='group-hover:bg-purple-50'
                circleMediumHover='group-hover:border-purple-200'
                circleOut='border-purple-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-purple-100' />
            <Category
                value="Кино"
                circle='bg-blue-100'
                circleHover='group-hover:bg-blue-50'
                circleMediumHover='group-hover:border-blue-200'
                circleOut='border-blue-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-blue-100' />
            <Category
                value="Представления"
                circle='bg-rose-100'
                circleHover='group-hover:bg-rose-50'
                circleMediumHover='group-hover:border-rose-200'
                circleOut='border-rose-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-rose-100' />
            <Category
                value="Культура"
                circle='bg-green-100'
                circleHover='group-hover:bg-green-50'
                circleMediumHover='group-hover:border-green-200'
                circleOut='border-green-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-green-100' />
            <Category
                value="Вечеринки"
                circle='bg-orange-100'
                circleHover='group-hover:bg-orange-50'
                circleMediumHover='group-hover:border-orange-200'
                circleOut='border-orange-100'
                circleOutHover='group-hover:border-white'
                cardBgHover='group-hover:bg-orange-100' />
        </div>
    );
};
export default Categories;