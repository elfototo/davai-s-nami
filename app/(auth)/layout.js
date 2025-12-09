import Link from 'next/link';
export default function AuthLayout({ children }) {
  return (
    <div className="fixed left-0 top-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
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
