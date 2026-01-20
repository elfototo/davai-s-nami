'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isDynamicPage = /^\/(events|places)\/[^/]+$/.test(pathname);

  if (!isDynamicPage) return null;

  return (
    <button 
      onClick={() => router.back()} 
      className="fixed z-20 top-20 left-4 bg-gray-300 p-4 rounded-full shadow-md hover:bg-pink-200 transition"
    >
      <FaArrowLeft className="text-white dark:text-white" size={20} />
    </button>
  );
};

export default BackButton;
