'use client';
import { useState } from "react";

function Category({ value }) {

    return (
        <div className="relative bg-[#D9D9D9] h-[150px] md:h-[200px] rounded-[40px]">
            <h2 className=" absolute top-10 left-10">
                {value}
            </h2>
        </div>

    )
};

function Categories() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Category value="Музыка" />
            <Category value="Познавательное" />
            <Category value="Кино" />
            <Category value="Представления" />
            <Category value="Выставки" />
            <Category value="Тусовки" />
        </div>
    )
}

export default Categories;