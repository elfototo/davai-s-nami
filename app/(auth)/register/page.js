'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { keys } from 'lodash';

export default function RegisterPage() {
  const [user, setUser] = useState({
    nickname: '',
    email: '',
    password: '',
    full_name: '',
  });

  const [errors, setErrors] = useState({});

  const requireFields = ["nickname", "email", "password"];

  const validate = (name, value) => {
    if (!requireFields.includes(name) && !value.trim()) return null;

    switch (name) {
      case 'nickname': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 2) return 'Не менее двух символов';
        return null;
      }
      case 'email': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (!value.trim().includes('@')) return 'Не менее двух символов';
        return null;
      }

      case 'password': {
        if (!value.trim()) return 'Поле не должно быть пустым';
        if (value.trim().length < 8) return 'Не менее двух символов';
        return null;
      }
    }
  };

  const handleOnSubmit = (e) => {
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
      alert('Форма отправлена');
      setUser({
        nickname: '',
        email: '',
        password: '',
        full_name: '',
      });
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
              className="rounded-lg px-2 py-1 w-full"
            />
            {errors.nickname && (
              <div className="text-red-400">{errors.nickname}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-5">
          <label htmlFor="email">email</label>
          <div>
            <input
              onChange={handleOnChange}
              value={user.email}
              type="text"
              placeholder="email"
              name="email"
              className="rounded-lg px-2 py-1 w-full"
            />
            {errors.email && <div className="text-red-400">{errors.email}</div>}
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
              className="rounded-lg px-2 py-1 w-full"
            />
            {errors.password && (
              <div className="text-red-400">{errors.password}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-5">
          <label htmlFor="full_name">Полное имя</label>
          <div>
            <input
              onChange={handleOnChange}
              value={user.full_name}
              type="text"
              placeholder="full_name"
              name="full_name"
              className="rounded-lg px-2 py-1 w-full"
            />
          </div>
        </div>

        <button
          disabled={!isValidating}
          className={`${isValidating ? 'cursor-pointer rounded-lg bg-[#D52FDD] text-white' : 'cursor-not-allowed bg-gray-300'} col-span-full w-full rounded-lg px-2 py-1`}
        >
          Отправить
        </button>
      </form>
    </main>
  );
}
