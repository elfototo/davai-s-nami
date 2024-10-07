'use client';

function Category({ value, className }) {

    return (
        <div className={`relative bg-[#D9D9D9] h-[150px] md:h-[200px] rounded-[40px] cursor-pointer transition-colors duration-300 transform ${className} hover:bg-opacity-80`}>
            <h2 className="absolute top-10 left-10 text-white">
                {value}
            </h2>
        </div>

    )
};

function Categories() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Category value="Музыка" className="bg-category-music" />
            <Category value="Познавательное" className="bg-category-knowlege"/>
            <Category value="Кино" className="bg-category-cinema"/>
            <Category value="Представления" className="bg-category-theater"/>
            <Category value="Выставки" className="bg-category-lecture"/>
            <Category value="Тусовки" className="bg-category-standup"/>
        </div>
    );
};
export default Categories;