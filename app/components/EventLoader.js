import React from 'react';

const CatLoader = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-24 h-24">
            {/* Голова */}
            <div className="relative w-16 h-16 bg-black rounded-full"></div>
            {/* Глаза */}
            <div className="absolute top-5 left-6 w-3 h-3 bg-white rounded-full animate-blink"></div>
            <div className="absolute top-5 right-6 w-3 h-3 bg-white rounded-full animate-blink"></div>
            {/* Усы */}
            <div className="absolute flex items-center justify-between top-8 w-20">
                <div className="w-6 h-0.5 bg-gray-300 animate-whisker"></div>
                <div className="w-6 h-0.5 bg-gray-300 animate-whisker"></div>
            </div>
        </div>
    );
};

export default CatLoader;
