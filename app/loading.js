export default function Loading() {
    // Or a custom loading skeleton component
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="w-12 h-12 border-4 border-pink-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}