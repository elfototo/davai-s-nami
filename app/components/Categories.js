'use client';
import '../globals.css';


function Category({ value, className }) {

    return (
        <div className={`relative flex justify-center items-center h-[90px] md:h-[150px] lg:h-[200px] overflow-hidden rounded-full md:rounded-[40px] cursor-pointer transform transition-scale duration-300 hover:scale-[98%] ${className}`}>
            <div className='category absolute inset-0 bg-gradient-to-tl from-white/40 to-transparent'>
            </div>
            <h2 className='md:absolute md:top-10 md:left-10 text-[1.4rem] md:text-[1.6rem] text-white'>
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
            <Category value="Тусовки" className='bg-[#f97316]' />
        </div>
    );
};
export default Categories;