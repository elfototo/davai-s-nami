'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
      {/* <div className="w-[100%] p-3 lg:flex lg:w-full lg:items-center lg:justify-between">
        <div className="flex w-[100%] items-center justify-between">
          <div className="flex">
            <button
              onClick={handleBack}
              className="rounded-full transition lg:mr-6"
            >
              <IoMdArrowBack className="text-gray-500" size={28} />
            </button>
          </div>
          <div className="mx-auto h-full lg:mr-6">
            <Link href="/" className="">
              {/* Давай с нами!*/}

              {/* <Image
                src={'/img/logo_main.png'}
                width={1000}
                height={1000}
                className="w-[20vh]"
                alt="avatar"
                priority
              />
            </Link>
          </div>
        </div>
      </div> */}

      {/* <header>
        <Link
          className="mx-auto mt-10 rounded-lg px-3 py-2 text-gray-400"
          href="/"
        >
          Назад
        </Link>
      </header> */}
      <div className="grid h-screen w-full">
        {/* <div className="bg-pink-400"></div> */}
        {children}
      </div>
    </div>
  );
}

//  fixed z-50 top-0 left-0 w-full
