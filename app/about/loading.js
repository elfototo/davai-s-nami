'use client';

export default function Loading() {
    return (
        <div className="space-y-4">

            <div className="mt-20 max-w-custom-container mx-auto  px-4">
                <div className="lg:flex lg:items-center flex-cols justify-around">
                    <section className="lg:w-[50%] w-full mb-3 mr-3">
                        <div className="grid gap-3 grid-cols-1 items-stretch grid-rows-auto">
                            <div className="h-[50px] w-[50%] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            <div className="h-[250px] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        </div>
                    </section>
                    <section className="lg:w-[50%] w-full flex justify-center items-center">
                        <div className="mx-auto p-10">
                            <div className="flex">
                                <div className="m-3 h-[200px] w-[200px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                                <div className="m-3 h-[200px] w-[200px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            </div>
                            <div className="flex">
                                <div className="m-3 h-[200px] w-[200px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                                <div className="m-3 h-[200px] w-[200px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            </div>



                        </div>
                    </section>
                </div>
                <section className="mt-20 lg:w-[100%] w-full ">
                    <div className="grid gap-3 lg:grid-cols-3 grid-cols-1 items-stretch grid-rows-auto">
                        <div className="h-[250px] w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[250px] w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        <div className="h-[250px] w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
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