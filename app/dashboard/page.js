'use client';

import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { IoIosSave } from 'react-icons/io';
import { API_URL1 } from '../../config';
import { IoCloseOutline } from 'react-icons/io5';

export default function DashBoard() {
  const [isEdit, setIsedit] = useState(false);
  const [user, setUser] = useState({});
  const [userInput, setUserInput] = useState({
    full_name: '',
    telegram_nickname: '',
  });
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('access_token');

  const fetchUser = async (url, token) => {
    try {
      const res = await fetch(`${url}api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      console.log('res', res);

      if (!res.ok) {
        throw new Error('network Error');
      }

      const data = await res.json();

      console.log('data', data);
      setUser(data);
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser(API_URL1, token);
    }
  }, []);

  const validate = (name, value) => {
    switch (name) {
      case 'full_name':
        if (!value.trim()) return 'поле не должно быть пустым';
        return null;

      case 'telegram_nickname':
        if (!value.trim()) return 'поле не должно быть пустым';
        return null;
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    setUserInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async () => {
    const newErrorList = {};

    const fieldsToValidate = ['full_name', 'telegram_nickname'];

    fieldsToValidate.forEach((key) => {
      const value = userInput[key] || user[key];

      const newErr = validate(key, value);
      if (newErr) {
        newErrorList[key] = newErr;
      }
    });
    setErrors(newErrorList);

    if (Object.keys(newErrorList).length === 0) {
      try {
        const res = await fetch(`${API_URL1}api/auth/me`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: userInput.full_name || user.full_name,
            telegram_nickname:
              userInput.telegram_nickname || user.telegram_nickname,
          }),
        });

        if (!res.ok) {
          throw new Error('network error');
        }

        const data = await res.json();

        console.log('data forms', data);

        setUser({
          nickname: user.nickname,
          email: user.email,
          full_name: userInput.full_name || user.full_name,
          telegram_nickname:
            userInput.telegram_nickname || user.telegram_nickname,
        });

        setUserInput({
          full_name: '',
          telegram_nickname: '',
        });
        setIsedit(false);
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const handleEdit = () => {
    setUserInput({
      full_name: user.full_name || '',
      telegram_nickname: user.telegram_nickname || '',
    });
    setIsedit(true);
  };
  const handleCancel = () => {
    setUserInput({
      full_name: '',
      telegram_nickname: '',
    });
    setErrors({});
    setIsedit(false);
  };
  return (
    <div className="mx-auto min-h-screen max-w-custom-container bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="mb-16">
          <div className="items-center justify-between p-2 md:p-4 lg:flex">
            <div className="w-full">
              <h1 className="mb-10 mt-0 text-start text-4xl font-bold text-gray-700">
                Личный кабинет
              </h1>

              <div className="rounded-lg border border-gray-300 bg-white p-10 shadow-sm">
                <div className="flex items-center gap-10">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                      <FaUserCircle size={32} className="text-gray-500" />
                    </div>
                  </div>

                  <div className="flex-1">
                    {isEdit ? (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label
                            htmlFor="nickname"
                            className="block font-medium text-gray-700"
                          >
                            full_name:
                          </label>
                          <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            placeholder="Введите full_name"
                            value={userInput.full_name}
                            onChange={handleOnChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.full_name && (
                            <span className="text-sm text-red-500">
                              {errors.full_name}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block font-medium text-gray-700"
                          >
                            telegram_nickname:
                          </label>
                          <input
                            type="text"
                            id="telegram_nickname"
                            name="telegram_nickname"
                            placeholder="Введите telegram_nickname"
                            value={userInput.telegram_nickname}
                            onChange={handleOnChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.telegram_nickname && (
                            <span className="text-sm text-red-500">
                              {errors.telegram_nickname}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3 pt-3">
                          <button
                            onClick={handleSubmit}
                            className="flex items-center justify-center gap-2 rounded-lg bg-pink-400 px-4 py-2 text-white transition-colors hover:bg-pink-300"
                          >
                            <IoIosSave size={18} />
                            <span>Сохранить</span>
                          </button>

                          <button
                            onClick={handleCancel}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                          >
                            <IoCloseOutline size={18} />
                            <span>Отмена</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {user.nickname}
                          </h2>
                          <div className='grid gap-2'>
                            <div className="grid grid-cols-[1fr_2fr] gap-5">
                              <p>email:</p>
                              <p className=" text-gray-600">{user.email}</p>
                            </div>
                            <div className="grid grid-cols-[1fr_2fr] gap-5">
                              <p>Полное имя: </p>
                              <p className=" text-gray-600">
                                {user.full_name}
                              </p>
                            </div>

                            <div className="grid grid-cols-[1fr_2fr] gap-5">
                              <p>Телеграм: </p>
                              <p className=" text-gray-600">
                                {user.telegram_nickname}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleEdit}
                          className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                        >
                          <FaEdit size={16} />
                          <span>Редактировать</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
