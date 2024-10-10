'use client';

function Category({ value, className }) {

    return (
        <div className={`relative flex justify-center items-center h-[90px] md:h-[150px] lg:h-[200px] overflow-hidden rounded-full md:rounded-[40px] cursor-pointer transition-colors duration-300 transform ${className} group hover:bg-opacity-50`}>
            <div className='absolute inset-0 bg-gradient-to-tl from-white/40 to-transparent transition-opacity duration-300 group-hover:opacity-0'>
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
            <Category value="Музыка" className='bg-gradient-to-br from-[#2dd4bf] to-[#2dd4bf]' />
            <Category value="Лекции" className='bg-gradient-to-br from-[#c084fc] to-[#c084fc]'/>
            <Category value="Кино" className='bg-gradient-to-br from-[#3E62E4] to-[#3E62E4]'/>
            <Category value="Представления" className='bg-gradient-to-br from-[#E43E3E] to-[#E43E3E]'/>
            <Category value="Выставки" className='bg-gradient-to-br from-[#4ade80] to-[#4ade80]'/>
            <Category value="Тусовки" className='bg-gradient-to-br from-[#EA8918] to-[#EA8918]'/>
        </div>
    );
};
export default Categories;