'use client';

export default function Loading() {
    // Or a custom loading skeleton component
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-violet-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute w-12 h-12 border-4 border-pink-300 border-solid border-r-transparent rounded-full animate-spin"></div>
                <div className="absolute w-8 h-8 border-4 border-indigo-200 border-solid border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}