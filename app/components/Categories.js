'use client';

function Category({ value, className, imageBg }) {

    return (
        <div className={`relative bg-[#D9D9D9] h-[150px] md:h-[200px] overflow-hidden rounded-[40px] cursor-pointer transition-colors duration-300 transform ${className} hover:bg-opacity-80`}>
            <div className="absolute mix-blend-multiply left-0 w-full h-full bg-cover bg-no-repeat opacity-40 hue-rotate-60  hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url(${imageBg})` }} >
            </div>
            <h2 className="absolute top-10 left-10 text-white">
                {value}
            </h2>
        </div >
    )
};

function Categories() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Category value="Музыка" className="bg-category-music" imageBg='/img/music.svg' />
            <Category value="Познавательное" className="bg-category-knowlege" imageBg='/img/univer_2.svg' />
            <Category value="Кино" className="bg-category-cinema" imageBg='/img/movie.svg'/>
            <Category value="Представления" className="bg-category-theater" imageBg='/img/actor.svg'/>
            <Category value="Выставки" className="bg-category-lecture" imageBg='/img/painting.svg'/>
            <Category value="Тусовки" className="bg-category-standup" imageBg='/img/party.svg'/>
        </div>
    );
};
export default Categories;