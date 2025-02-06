'use client';

export default function Loading() {
    return (
        <div className="space-y-4">
            <div className="h-[65px] w-[100%] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>

            <div className="t-3 max-w-custom-container mx-auto px-4 lg:flex flex-cols justify-center">
                <section className="lg:w-[20%] w-full mb-3 mr-3 relative">
                    <div className="rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer lg:top-4 w-[100%] lg:h-[580.8px] hidden lg:block"></div>
                </section>
                <section className="lg:w-[80%] w-full">
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 items-stretch grid-rows-auto">
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[396px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                    </div>
                </section>
            </div>


            <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
        `}</style>
        </div>
    );
}
