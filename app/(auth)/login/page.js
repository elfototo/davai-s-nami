'use client';

import { useState, useEffect } from 'react';
import { NEXT_PUBLIC_Login, API_HEADERS } from '../../../config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [user, setUser] = useState({
    nickname: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const requireFields = ['nickname', 'password'];

  const validate = (name, value) => {
    switch (name) {
      case 'nickname': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 2) return 'Не менее двух символов';
        return null;
      }

      case 'password': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 8) return 'Не менее двух символов';
        return null;
      }
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const errorList = {};

    requireFields.forEach((key) => {
      const newErr = validate(key, user[key]);

      if (newErr) {
        errorList[key] = newErr;
      }
    });

    setErrors(errorList);

    if (Object.keys(errorList).length === 0) {
      try {
        const response = await fetch(NEXT_PUBLIC_Login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error('network error');
        }

        const data = await response.json();
        console.log('result', data);

        localStorage.setItem('access_token', data.access_token);

        router.push('/dashboard');

        alert('Форма отправлена');
        setUser({
          nickname: '',
          password: '',
        });
      } catch (err) {
        console.log('ошибка', err);
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValidating =
    Object.keys(errors).some((err) => err) &&
    requireFields.every((name) => user[name].trim() !== '');

  return (
    <main className="flex items-center justify-center">
      <form
        onSubmit={handleOnSubmit}
        className="grid gap-5 rounded-xl bg-gray-100 p-10"
      >
        <div className="grid grid-cols-[1fr_3fr] gap-5">
          <label htmlFor="nickname">Nickname</label>
          <div>
            <input
              onChange={handleOnChange}
              value={user.nickname}
              type="text"
              placeholder="nickname"
              name="nickname"
              className="w-full rounded-lg px-2 py-1"
            />
            {errors.nickname && (
              <div className="text-red-400">{errors.nickname}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-5">
          <label htmlFor="password">Пароль</label>
          <div>
            <input
              onChange={handleOnChange}
              value={user.password}
              type="password"
              placeholder="password"
              name="password"
              className="w-full rounded-lg px-2 py-1"
            />
            {errors.password && (
              <div className="text-red-400">{errors.password}</div>
            )}
          </div>
        </div>

        <button
          disabled={!isValidating}
          className={`${isValidating ? 'cursor-pointer rounded-lg bg-[#D52FDD] text-white' : 'cursor-not-allowed bg-gray-300'} col-span-full w-full rounded-lg px-3 py-2`}
        >
          Отправить
        </button>
      </form>
    </main>
  );
}
