'use client';

function Category({ value, className }) {

    return (
        <div className={`relative h-[150px] md:h-[200px] overflow-hidden rounded-[40px] cursor-pointer transition-colors duration-300 transform ${className} group hover:bg-opacity-50`}>
            <div className='absolute inset-0 bg-gradient-to-tl from-white/40 to-transparent transition-opacity duration-300 group-hover:opacity-0'>
            </div>
            <h2 className='absolute top-10 left-10 text-white'>
                {value}
            </h2>
        </div >
    )
};

function Categories() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Category value="Музыка" className='bg-gradient-to-br from-[#2dd4bf] to-[#2dd4bf]' />
            <Category value="Познавательное" className='bg-gradient-to-br from-[#c084fc] to-[#c084fc]'/>
            <Category value="Кино" className='bg-gradient-to-br from-[#3E62E4] to-[#3E62E4]'/>
            <Category value="Представления" className='bg-gradient-to-br from-[#E43E3E] to-[#E43E3E]'/>
            <Category value="Выставки" className='bg-gradient-to-br from-[#4ade80] to-[#4ade80]'/>
            <Category value="Тусовки" className='bg-gradient-to-br from-[#EA8918] to-[#EA8918]'/>
        </div>
    );
};
export default Categories;

// function Category({ value, className, imageBg }) {

//     return (
//         <div className={`relative bg-[#D9D9D9] h-[150px] md:h-[200px] overflow-hidden rounded-[40px] cursor-pointer transition-colors duration-300 transform ${className} hover:bg-opacity-80`}>
//             <div className="absolute mix-blend-multiply left-0 w-full h-full bg-cover bg-no-repeat opacity-40 hue-rotate-60  hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url(${imageBg})` }} >
//             </div>
//             <h2 className="absolute top-10 left-10 text-white">
//                 {value}
//             </h2>
//         </div >
//     )
// };

// function Categories() {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             <Category value="Музыка" className="bg-category-music" imageBg='/img/music.svg' />
//             <Category value="Познавательное" className="bg-category-knowlege" imageBg='/img/univer_2.svg' />
//             <Category value="Кино" className="bg-category-cinema" imageBg='/img/movie.svg'/>
//             <Category value="Представления" className="bg-category-theater" imageBg='/img/actor.svg'/>
//             <Category value="Выставки" className="bg-category-lecture" imageBg='/img/painting.svg'/>
//             <Category value="Тусовки" className="bg-category-standup" imageBg='/img/party.svg'/>
//         </div>
//     );
// };