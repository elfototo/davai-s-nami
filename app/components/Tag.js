
import { IoStar } from "react-icons/io5";
import { categoriesID } from "../data/events";


const Tag = ({ main_category_id }) => {

    const currentCategory = categoriesID.find((item) => item.id === main_category_id);

    return (
        <div className={`absolute left-3 bottom-3 rounded-full flex items-center px-3 py-1 ${currentCategory ? currentCategory.color : 'bg-[#111]'}`}>
            {currentCategory ? currentCategory.icon : <IoStar size={16} color='white' className='mr-1 mb-[0.2rem]' />}
            <p className="font-roboto text-white">{currentCategory ? currentCategory.category : "Другое"}</p>
        </div>
    )
};

export default Tag;