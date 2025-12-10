'use client';

import { FaUserCircle } from 'react-icons/fa';
import { FaSignInAlt } from 'react-icons/fa';
import { FiLogIn } from "react-icons/fi";
import { TbLogin2 } from "react-icons/tb";


import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dropdown({isOpenMenu, setIsOpenMenu}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggestIn, setIsLoggestIn] = useState(false);
  // const [isToken, setIsToken] = useState(false);
  const [hilightIndex, setHilightIndex] = useState(-1);
  const containRef = useRef(null);
  const router = useRouter();

  const guestOptions = [
    {
      id: 1,
      label: 'Войти',
      href: '/login',
    },
    {
      id: 2,
      label: 'Зарегистрироваться',
      href: '/register',
    },
  ];

  const userOptions = [
    {
      id: 'dashboard',
      label: 'Профиль',
      href: '/dashboard',
    },
    {
      id: 'logout',
      label: 'Выйти',
      href: null,
      action: 'logout',
    },
  ];

  const options = isLoggestIn ? userOptions : guestOptions;

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // setIsToken(!!token);
    setIsLoggestIn(!!token);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('access_token');

      setIsLoggestIn(!!token);
      console.log('Auth changed, token:', !!token);
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containRef.current && !containRef.current.contains(e.target)) {
        setIsOpen(false);
        setHilightIndex(-1);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    setIsLoggestIn(false);
    setIsOpen(false);

    window.dispatchEvent(new Event('auth-changed'));
    router.push('/');
  };

  const handleOptionClick = (option) => {
    if (option.action === 'logout') {
      handleLogOut();
    } else if (option.href) {
      setIsOpen(false);
      if (isOpenMenu) {
        setIsOpenMenu(false)
      }
      router.push(option.href);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setHilightIndex((i) => (i > 0 ? i - 1 : options.length - 1));
        break;

      case 'ArrowDown':
        e.preventDefault();
        setHilightIndex((i) => (i + 1) % options.length);
        break;

      case 'Enter':
        e.preventDefault();
        if (hilightIndex >= 0) {
          handleOptionClick(options[hilightIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHilightIndex(-1);
        break;
    }
  };

  return (
    <div ref={containRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-center px-3 text-gray-500"
      >
        {isLoggestIn ? <FaUserCircle size={25} /> : <TbLogin2 size={25} />}
      </button>

      {isOpen && (
        <ul className="mt-2 overflow-hidden border-gray-300 bg-white lg:absolute lg:right-0 lg:top-[100%] lg:rounded-lg lg:border">
          {options.map((opt, index) => (
            <li
              key={opt.id}
              className={`${hilightIndex === index ? 'bg-gray-100' : 'transparent'} cursor-pointer rounded-lg px-3 py-2 lg:rounded-none`}
              onMouseEnter={() => setHilightIndex(index)}
              onClick={() => handleOptionClick(opt)}
            >
              {opt.href ? (
                <Link href={opt.href}>{opt.label}</Link>
              ) : (
                <button>{opt.label}</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
